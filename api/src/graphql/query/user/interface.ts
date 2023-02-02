import { ObjectType } from '@nestjs/graphql';
import { User } from '../../../model';
import { ApiResponseDataList } from '../../../util/api-response';

@ObjectType()
export class UserListResponse extends ApiResponseDataList([User]) {}
