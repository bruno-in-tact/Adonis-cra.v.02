import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import { faker } from '@faker-js/faker';


test.group('Creation of users', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })


  test('- create a user ', async ({ client, assert }) => {
    const fakeUser = {
      first_name: faker.name.findName(),
      last_name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      start_date: "2021-10-08",
      town: faker.random.word(),
      country: faker.random.word(),
      // is_admin: 0
    }
    const response = await client.post('/api/users/new').form(fakeUser);
    const body = response.body();
    assert.equal(body.first_name, fakeUser.first_name);
    assert.equal(body.email, fakeUser.email.toLocaleLowerCase());
    const user = await User.find(body.id);
    assert.notEqual(user?.password, fakeUser.password);
  });

  
  test('- create a user without password ', async ({ client, assert }) => {
    const fakeUser = {
      first_name: faker.name.findName(),
      last_name: faker.name.findName(),
      email: faker.internet.email(),
      start_date: "2021-10-08",
      town: faker.random.word(),
      country: faker.random.word(),
      // is_admin: 0
    }
    const response = await client.post('/api/users/new').form(fakeUser);
    const body = response.body();
    const status = response.status();
    assert.equal(status, 422);
    assert.equal(status, 422);
    assert.isObject(body);
    assert.exists(body.errors);
    assert.isArray(body.errors);
    assert.equal(body.errors.length, 1);
    assert.exists(body.errors[0].field);
    assert.equal(body.errors[0].field, 'password');
  });
  

  test('- create a user without email ', async ({ client, assert }) => {
    const fakeUser = {
      first_name: faker.name.findName(),
      last_name: faker.name.findName(),
      password: faker.internet.password(),
      start_date: "2021-10-08",
      town: faker.random.word(),
      country: faker.random.word(),
      // is_admin: 0
    }
    const response = await client.post('/api/users/new').form(fakeUser);
    const body = response.body();
    const status = response.status();
    assert.equal(status, 422);
    assert.isObject(body);
    assert.exists(body.errors);
    assert.isArray(body.errors);
    assert.equal(body.errors.length, 1);
    assert.exists(body.errors[0].field);
    assert.equal(body.errors[0].field, 'email');

  });

  test('- create a user with a wrong email ', async ({ client, assert }) => {
    const fakeUser = {
      first_name: faker.name.findName(),
      last_name: faker.name.findName(),
      email : "bruno.com",
      password: faker.internet.password(),
      start_date: "2021-10-08",
      town: faker.random.word(),
      country: faker.random.word(),

      // is_admin: 0
    }
    const response = await client.post('/api/users/new').form(fakeUser);
    const body = response.body();
    const status = response.status();
    assert.equal(status, 422);
    assert.isObject(body);
    assert.exists(body.errors);
    assert.isArray(body.errors);
    assert.equal(body.errors.length, 1);
    assert.exists(body.errors[0].field);
    assert.equal(body.errors[0].field, 'email');
    assert.equal(body.errors[0].rule, 'email'); 
  });

  test('- create a user with a wrong password (incorrect length) ', async ({ client, assert }) => {
    const fakeUser = {
      first_name: faker.name.findName(),
      last_name: faker.name.findName(),
      email : faker.internet.email(),
      password: 123,
      start_date: "2021-10-08",
      town: faker.random.word(),
      country: faker.random.word(),
      // is_admin: 0
    }
    const response = await client.post('/api/users/new').form(fakeUser);
    const body = response.body();
    const status = response.status();
    assert.equal(status, 422);
    assert.isObject(body);
    assert.exists(body.errors);
    assert.isArray(body.errors);
    assert.equal(body.errors.length, 1);
    assert.exists(body.errors[0].field);
    assert.equal(body.errors[0].field, 'password');
    assert.equal(body.errors[0].rule, 'minLength');    
  });
  test('- create a user without first and last name ', async ({ client, assert }) => {
    const fakeUser = {
      email : faker.internet.email(),
      password: faker.internet.password(),
      start_date: "2021-10-08",
      town: faker.random.word(),
      country: faker.random.word(),
      // is_admin: 0
    }
    const response = await client.post('/api/users/new').form(fakeUser);
    const body = response.body();
    const status = response.status();
    assert.equal(status, 422);
    assert.isObject(body);
    assert.exists(body.errors);
    assert.isArray(body.errors);
    assert.equal(body.errors.length, 2);
    assert.exists(body.errors[0].field);
    assert.equal(body.errors[0].field, 'first_name');
    assert.equal(body.errors[0].rule, 'required'); 
    assert.equal(body.errors[1].field, 'last_name');
    assert.equal(body.errors[1].rule, 'required');    
  });
});