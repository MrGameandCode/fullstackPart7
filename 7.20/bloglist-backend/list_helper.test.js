const listHelper = require('./utils/list_helper');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('./app');
const Blog = require('./models/blog');
const User = require('./models/user');
const { response } = require('./app');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'first blog',
    author: 'first author',
    url: 'http://www.first.com',
    likes: 4,
  },
  {
    title: 'second blog',
    author: 'second author',
    url: 'http://www.second.com',
    likes: 2,
  },
];

beforeEach(async () => {
  const testUser = new User({
    username: 'admin',
    name: 'Adam',
    passwordHash: await bcrypt.hash('admin', 10),
  });
  await User.deleteMany({});
  await testUser.save();
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  blogObject.user = await User.findOne({});
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  blogObject.user = await User.findOne({});
  await blogObject.save();
});

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  const emptyBlogs = [];
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ];
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0,
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0,
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0,
    },
  ];

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyBlogs);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe('blogs tests', () => {
  const blogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0,
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0,
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0,
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0,
    },
  ];

  test('that get which is the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toBe(blogs[2]);
  });

  test('that we know who has the most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toStrictEqual({ author: 'Robert C. Martin', blogs: 3 });
  });

  test('that we know who has most likes in all his blogs', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toStrictEqual({ author: 'Edsger W. Dijkstra', likes: 17 });
  });
});

describe('API blogs tests', () => {
  test('blogs are returned as json', async () => {
    token = await getToken();
    await api
      .get('/api/blogs')
      .set({ Authorization: token })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('we have 1 blog and has ID property', async () => {
    token = await getToken();
    const response = await api.get('/api/blogs').set({ Authorization: token });
    expect(response.body[0]._id).toBeDefined();
  });

  test('can create a new blog', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'Me',
      url: 'http://test.com',
      likes: 400,
    };

    token = await getToken();
    let response = await api.get('/api/blogs').set({ Authorization: token });
    const prev = response.body.length;
    await api.post('/api/blogs').send(newBlog).set({ Authorization: token });
    response = await api.get('/api/blogs').set({ Authorization: token });
    const current = response.body.length;
    expect(prev < current);
  });

  test('a blog without likes property defaults to 0', async () => {
    const newBlog = {
      title: 'blog without likes',
      author: 'Me',
      url: 'http://nolikes.com',
    };
    token = await getToken();
    await api.post('/api/blogs').send(newBlog).set({ Authorization: token });
    const response = await api.get('/api/blogs').set({ Authorization: token });
    const blogs = response.body;
    const blog = blogs.filter((blog) => blog.title === 'blog without likes');
    expect((blog.likes = 0));
  });

  test('a blog cannot be created without author or title', async () => {
    token = await getToken();
    const newBlog = {
      title: 'blog without author',
      url: 'http://anonymblog.com',
    };
    await api.post('/api/blogs').send(newBlog).set({ Authorization: token }).expect(400);
  });

  test('delete an existing blog', async () => {
    token = await getToken();
    const response = await api.get('/api/blogs').set({ Authorization: token });
    await api
      .delete('/api/blogs/' + response.body[0]._id)
      .set({ Authorization: token })
      .expect(204);
  });

  test('update an existing blog', async () => {
    token = await getToken();
    const response = await api.get('/api/blogs').set({ Authorization: token });
    let updatedBlog = response.body[0];
    updatedBlog.likes = 414;
    await api
      .put('/api/blogs/' + updatedBlog._id)
      .set({ Authorization: token })
      .send(updatedBlog)
      .expect(200);
  });
});

const getToken = async () => {
  const response = await api.post('/api/login').send({
    username: 'admin',
    password: 'admin',
  });
  return 'bearer ' + response.body.token;
};
