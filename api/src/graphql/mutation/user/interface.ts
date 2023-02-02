import { ObjectType } from '@nestjs/graphql';
import { User } from '../../../model';
import { ApiResponseData } from '../../../util/api-response';

@ObjectType()
export class UserResponse extends ApiResponseData(User) {}
