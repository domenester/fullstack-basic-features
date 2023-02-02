import { buildMutation, formatBody } from '../util';

export const defaultUser = {
  name: 'Name Test',
  email: 'nametest@mail.com',
};

export const createUser = (body: any = defaultUser) => {
  return buildMutation('createUser', body, ['id', 'name', 'email']);
};
