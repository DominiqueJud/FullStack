const {test,after,describe,beforeEach}=require('node:test')
const assert=require('assert')
const supertest=require('supertest')
const mongoose= require('mongoose')
const app=require('../app')
const api=supertest(app)
const User=require('../models/users')
const url='/api/users'


describe.only('user tests',async ()=>{
    beforeEach(async ()=>{
        await User.deleteMany({})
    })
    test('get returns a empty json', async ()=>{
        response=await api.get(url)
        .expect(200)
        .expect('content-type',/application\/json/)
        assert.deepEqual(response.body.length,0)
    })
    test('adding an user makes a new user with the right username and name',async ()=>{
        const oldResponse = await api.get(url)
        const newUser={username:"Dani", name:"Daniel",password:"hidden"}
        await api.post(url)
        .send(newUser)
        .expect(201)

        const newResponse= await api.get(url)

        assert.strictEqual(newResponse.body.length,oldResponse.body.length+1)
        assert.strictEqual(newResponse.body[0].username,newUser.username)
        assert.strictEqual(newResponse.body[0].name,newUser.name)

    })
    test('adding an duplicate username returns an corresponding Error', async ()=>{
        const newUser={username:"Dani", name:"Daniel",password:"hidden"}
        const response = await api.post(url)
        .send(newUser)
        .expect(201)
        await api.post(url)
        .send(newUser)
        .expect(400)
    })
    test('adding an User with no username or Password send an Error', async ()=>{
        const userNoUsername={ name:"Daniel",password:"hidden"}
        await api.post(url)
        .send(userNoUsername)
        .expect(400)
        const userNoPassword={username:"Dani", name:"Daniel"}
        await api.post(url)
        .send(userNoPassword)
        .expect(400)
        const response=await api.get(url) 
        assert.strictEqual(response.body.length,0)
    })
})

after(()=>{
    mongoose.connection.close()
})