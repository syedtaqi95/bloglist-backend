const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

test('GET request returns the correct number of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier is named \'id\'', async () => {
  const response = await api.get('/api/blogs')
  const id = response.body[0].id
  expect(id).toBeDefined()
})

test('new blog is created successfully', async () => {
  newBlog = {
    title: "Test title 3",
    author: "Test author 3",
    url: "www.test-url-3.com",
    likes: 7,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toEqual(helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(b => b.title)
  expect(contents).toContain('Test title 3')
})

afterAll(() => {
  mongoose.connection.close()
})