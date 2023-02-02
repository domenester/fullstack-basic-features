import { buildMutation } from '../util';
import { defaultUser } from './user.mock';

export const signup = (body: any = defaultUser) => {
  return buildMutation('signup', body, ['id', 'name', 'email']);
};

export const register = (body: any = { password: defaultUser.password }) => {
  return buildMutation('register', body, ['id', 'name', 'email']);
};
