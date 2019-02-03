const testServer = require('../helpers/server');
const rp  = require('request-promise');
const faker  = require('faker');
const User = require('../../dist/entity/user');

let server = null;
let hostUrl = null;

const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
const randomPassword = faker.internet.password(); // Kassandra.Haley@erich.biz

beforeAll(async () => {
  await testServer.clearDb();
  const result = await testServer.start();
  server = result.server;
  hostUrl = result.hostUrl;
});

describe('User registration', () => {

  test('Create new user', async (done) => {
    try {
      const response = await rp.post(
        {
          method: 'POST',
          uri: `${hostUrl}/users/registration`,
          body: {
            email: randomEmail,
            password: randomPassword
          },
          json: true // Automatically stringifies the body to JSON
        });
      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('groups');
      expect(response.groups).toContain('user');
      done();
    } catch (err) {
      done(err);
    }
  });

  test('Tried creating exist user', async (done) => {
    try {
      const response = await rp.post(
        {
          method: 'POST',
          uri: `${hostUrl}/users/registration`,
          body: {
            email: randomEmail,
            password: randomPassword
          },
          json: true // Automatically stringifies the body to JSON
        });
      expect(false).toBe(true);
      done();
    } catch (err) {
      expect(err).toHaveProperty('error');
      expect(err.error).toHaveProperty('error');
      expect(err.statusCode).toBe(403);
      expect(err.error.error).toBe('User is exist');
      done();
    }
  });

});

describe('User login', () => {

  test('Login to exist account', async (done) => {
    try {
      const response = await rp.post(
        {
          method: 'POST',
          uri: `${hostUrl}/users/login`,
          body: {
            email: randomEmail,
            password: randomPassword
          },
          json: true // Automatically stringifies the body to JSON
        });
      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('groups');
      expect(response.groups).toContain('user');
      done();
    } catch (err) {
      done(err);
    }
  });

  test('Login to did not exist account', async (done) => {
    try {
      const response = await rp.post(
        {
          method: 'POST',
          uri: `${hostUrl}/users/login`,
          body: {
            email: faker.internet.email(),
            password: faker.internet.password()
          },
          json: true // Automatically stringifies the body to JSON
        });
      expect(false).toBe(true);
      done();
    } catch (err) {
      expect(err).toHaveProperty('error');
      expect(err.error).toHaveProperty('error');
      expect(err.statusCode).toBe(401);
      expect(err.error.error).toBe('Unauthorized');
      done();
    }
  });

});


afterAll(async () => {
  server.close();
});
