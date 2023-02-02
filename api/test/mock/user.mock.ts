import { buildMutation } from '../util';

export const defaultUser = {
  name: 'Name Test',
  // email: 'nametest@mail.com',
  email: 'diogodomene@gmail.com',
  password: '12345678',
};

export const createUser = (body: any = defaultUser) => {
  const { password, ...rest } = body;
  return buildMutation('createUser', rest, ['id', 'name', 'email']);
};
