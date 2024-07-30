const {test, after, beforeEach}= require('node:test')
const mongoose= require('mongoose')
const supertest= require('supertest')
const app = require('../app')
const api= supertest(app)
const Blog=require('../models/blogs')
const User=require('../models/users')
const assert=require('assert')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const testUser={
    username:"testUser",
    name:"test",
    password:"secretTests"
}



let testUserToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWQiOiI2NmEzODM3OWMwNjYxNGNiMzUxNWVjZGQiLCJpYXQiOjE3MjE5OTIwNzh9.NKP_PAL0fOxBj-y07QKX1GdFU2bsC4LR8t3MEPxXt0c'

const initialBlogs = [
    {
        id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
    },
    {
        id: '5a422aa71b57892389261607f8',
        title: 'Google',
        author: 'XXX',
        url: 'https://google.com',
        likes: 4,
    },
    {
        id: '5a422a23421354a676234d17f8',
        title: 'Netflix',
        author: 'Hoi',
        url: 'https://netflix.com',
        likes: 1,
    }]
beforeEach(async ()=>{
    await Blog.deleteMany({})
    await User.deleteMany({})
    const saltedRounds=10
    const passwordHash=await bcrypt.hash("secretTests",saltedRounds)

    const user=new User({
    username:"testUser",
    name:"test",
    passwordHash:passwordHash,
    blogs:[]
})
    await user.save()
    
    const loginUser={
        username:"testUser",
        password:"secretTests"
        }
        const response=await api.post('/api/login')
        .send(loginUser)
        .expect(200)
        testUserToken=response.body.autToken

    for(let blog of initialBlogs){
        const newBlog=new Blog({
            title:blog.title,
            author:user.name,
            url:blog.url,
            likes:blog.likes,
            user:user._id
        })
        await newBlog.save()
    }
})


test('blogs are returned as JSON', async ()=>{
    await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type',/application\/json/)

})

test('the correct number of blogs are returned', async ()=>{
    const response= await api.get('/api/blogs')

    assert.strictEqual(response.body.length,initialBlogs.length)
})

test('blogs have an id propertie', async ()=>{
    const response= await api.get('/api/blogs')
    assert(response.body[0].id)
})

test('login returns the right Authorization header', async ()=>{
    const loginUser={
    username:"testUser",
    password:"secretTests"
    }
    const response=await api.post('/api/login')
    .send(loginUser)
    .expect(200)
    testUserToken=response.body.autToken
})

test('posting a blog increases the blogs by one', async ()=>{
    const newBlog=  {
        id: '5a422a23421354a676234d17f8',
        title: 'testPost',
        author: 'Dominique',
        url: 'https://xxx.com',
        likes: 3,
    }
    await api.post('/api/blogs')
    .set('Authorization',`Bearer ${testUserToken}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type',/application\/json/)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

})

test('posting a blog without a valid Token returns unauthorized', async ()=>{
    const newBlog=  {
        id: '5a422a23421354a676234d17f8',
        title: 'testPost',
        author: 'Dominique',
        url: 'https://xxx.com',
        likes: 3,
    }
    await api.post('/api/blogs')
    .set('Authorization',`Bearer 1234`)
    .send(newBlog)
    .expect(401)

})

test('posting a blog without specified likes gives a post with 0 likes',async ()=>{
    const newBlog={
        title: "noLikes",
        author: "Dominique",
        url: "www.migro.ch"
    }
    await api.post('/api/blogs')
    .set('Authorization',`Bearer ${testUserToken}`)
    .send(newBlog)
    .expect(201)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.reverse()[0].likes,0)
})

test('posting a blog without Title returns an 400 bad Request', async ()=>{
    const newBlog=  {
        author: 'Dominique',
        url: 'https://xxx.com',
        likes: 3,
    }
    await api.post('/api/blogs')
    .set('Authorization',`Bearer ${testUserToken}`)
    .send(newBlog)
    .expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(initialBlogs.length,response.body.length)
})

test('posting a blog without URL returns an 400 bad Request', async ()=>{
    const newBlog=  {
        title: "NoURL",
        author: 'Dominique',
        likes: 3,
    }
    await api.post('/api/blogs')
    .set('Authorization',`Bearer ${testUserToken}`)
    .send(newBlog)
    .expect(400)
    const response = await api.get('/api/blogs')
    assert.strictEqual(initialBlogs.length,response.body.length)
})

test('deleting a single Resource works', async ()=>{
    const response= await api.get('/api/blogs')
    const id= response.body[1].id
    console.log(id)
    await api.delete(`/api/blogs/${id}`)
    .set('Authorization',`Bearer ${testUserToken}`)
    .expect(201)

    const newResponse =await api.get('/api/blogs')
    
    assert.strictEqual(response.body.length, newResponse.body.length + 1)
})

test('deleting a not existing id returns an error', async ()=>{
    const wrongid=1234
    const response= await api.get('/api/blogs')
    await api.delete(`/api/blogs/${wrongid}`)
    .set('Authorization',`Bearer ${testUserToken}`)
    .expect(400)
    const newResponse=await api.get('/api/blogs')
    assert.strictEqual(response.body.length,newResponse.body.length)
})

test('updating the likes of a blog works', async ()=>{
    const response= await api.get('/api/blogs')
    const id= response.body[1].id
    const likes={likes:15}
    await api.put(`/api/blogs/${id}`)
    .set('Authorization',`Bearer ${testUserToken}`)
    .send(likes)
    .expect(201)
    const newResponse= await api.get('/api/blogs')
    assert.strictEqual(newResponse.body[1].likes,15)
})

test('updating a blog with a non existing id returns an error', async ()=>{
    const response= await api.get('/api/blogs')
    const wrongid= 1234
    const likes={likes:15}
    await api.put(`/api/blogs/${wrongid}`)
    .set('Authorization',`Bearer ${testUserToken}`)
    .send(likes)
    .expect(404)
    const newResponse= await api.get('/api/blogs')
    assert.deepEqual(newResponse.body,response.body)
})

after(async ()=>{
    await mongoose.connection.close()
})