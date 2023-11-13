import chai, { expect } from 'chai';
import { setupDB, requestInstance } from '../setup.js';
import { seedAllDataForGettingAllUser } from './user-helper.js';

setupDB();

describe('Test for get all users', () => {
  before(async () => {
    await seedAllDataForGettingAllUser();
  });

  it('Should get all users', async () => {
    const data = await requestInstance.get('/v1/user/all');
    const result = JSON.parse(data);
    console.log('Test response data ======> ', result);
  });
});
