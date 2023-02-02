import { buildMutation } from '../util';
import { defaultUser } from './user.mock';

export const forgotPassword = (body: any = { email: defaultUser.email }) => {
  return buildMutation('forgotPassword', body, ['id', 'name', 'email'], true);
};

export const resetPassword = (
  body: any = { password: defaultUser.password },
) => {
  return buildMutation('resetPassword', body, ['id', 'name', 'email'], true);
};
