const { test, describe,after } = require('node:test')
const assert = require('node:assert')
const mongoose=require('mongoose')

const listhelper = require('../utils/list_helper.js')

test('dummy returns one', () => {
    const emptyblogs = []

    const result = listhelper.dummy(emptyblogs)

    assert.strictEqual(result, 1)
})

test('totalLikes returs the sum of likes of multiple blogs', () => {
    const blogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b57892389261607f8',
            title: 'Google',
            author: 'XXX',
            url: 'https://google.com',
            likes: 4,
            __v: 0
        },
        {
            _id: '5a422a23421354a676234d17f8',
            title: 'Netflix',
            author: 'Hoi',
            url: 'https://netflix.com',
            likes: 1,
            __v: 0
        }]
    const result = listhelper.totalLikes(blogs)

    assert.strictEqual(result, 10)
})

test('totalLikes returns 0 with no blogs', () => {
    const blogs = []
    const result = listhelper.totalLikes(blogs)

    assert.strictEqual(result, 0)
})

test('totalLikes with one blog returns the likes of this blog', () => {
    const listWithOneBlog = [{
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    }]
    const result = listhelper.totalLikes(listWithOneBlog, 5)
    assert.strictEqual(result, 5)
})

describe('favoriteBlog', () => {
    test('returns none with no Blogs', () => {
        assert.equal(listhelper.favoriteBlog([]), null)
    })
    test('returns blog with one Blog', () => {
        const listWithOneBlog = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }]
        const result = listhelper.favoriteBlog(listWithOneBlog)
        delete listWithOneBlog[0].__v
        delete listWithOneBlog[0]._id
        delete listWithOneBlog[0].url
        assert.deepEqual(result, listWithOneBlog[0])
    })
    test('returns blog with most likes whit multiple blogs', () => {
        const blogs = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
                likes: 5,
                __v: 0
            },
            {
                _id: '5a422aa71b57892389261607f8',
                title: 'Google',
                author: 'XXX',
                url: 'https://google.com',
                likes: 4,
                __v: 0
            },
            {
                _id: '5a422a23421354a676234d17f8',
                title: 'Netflix',
                author: 'Hoi',
                url: 'https://netflix.com',
                likes: 1,
                __v: 0
            }]

        const result = listhelper.favoriteBlog(blogs)
        const favorite = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5,
        }

        assert.deepEqual(result, favorite)

    })


})

after(( )=>{
mongoose.connection.close()
})