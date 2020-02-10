import { ADMIN_ROLE, User, USER_ROLE, UserRepository } from '../../../../src/domain/user/user';

export const exampleUser: User = {
  id: 1,
  username: 'User 1',
  roles: USER_ROLE,
  api_key: 'some key',
};

export const exampleAdmin: User = {
  id: 2,
  username: 'User 2',
  roles: ADMIN_ROLE,
  api_key: 'some admin key',
};

let userList: User[];

let currentId: number;

export function initUserRepository() {
  userList = [
    exampleUser,
    exampleAdmin,
  ];

  currentId = 2;
}

export const userRepository: UserRepository = {
  async find (id: number) {
    return userList.find(user => user.id === id) as User;
  },
  async findByApiKey (apiKey: string) {
    return userList.find(user => user.api_key === apiKey) as User;
  },
  async insert (user: User) {
    const id = ++currentId;
    userList.push({ ...user, id });

    return id;
  },
  async remove (id: number) {
    userList = userList.filter(user => user.id !== id);
  },
  async update (updatedUser: User) {
    const index = userList.findIndex(platform => updatedUser.id === platform.id);

    if (index >= 0) {
      userList[index] = updatedUser;
    }
  },
};

initUserRepository();
