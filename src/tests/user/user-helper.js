import user from '../../models/user';

export const cleanUsers = async () => {
  const users = await user.deleteMany({});
  return users;
};

export const seedAllDataForGettingAllUser = async (params) => {
  await cleanUsers();
  const user1 = await user.create({
    name: 'test_user1',
    email: 'testuser1@gmail.com',
    password: 'test_user1',
  });

  return {
    user1,
  };
};
