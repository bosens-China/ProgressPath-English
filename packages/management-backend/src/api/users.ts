import { request } from '../utils/request';
import { UsersController } from 'backend-services/users/users.controller.ts';
import { Params } from 'ahooks/lib/useAntdTable/types';
import { FindUsersQueryDto } from 'backend-services/users/dto/find-users-query.dto.js';
import { CreateUserDto } from 'backend-services/users/dto/create-user.dto.js';
import { UpdateUserDto } from 'backend-services/users/dto/update-user.dto.js';

// 用户 API 接口
export async function getUserList(params: Params[0], body?: FindUsersQueryDto) {
  const {
    data: { data },
  } = await request.get<
    GlobalApiTypes<ReturnType<UsersController['findAllPaginated']>>
  >('/users/list', {
    params: {
      ...params,
      ...body,
    },
  });
  return data;
}

export async function createUser(body: CreateUserDto) {
  const {
    data: { data },
  } = await request.post<GlobalApiTypes<ReturnType<UsersController['create']>>>(
    '/users/create',
    body,
  );
  return data;
}

export async function updateUser(id: number, body: UpdateUserDto) {
  const {
    data: { data },
  } = await request.patch<
    GlobalApiTypes<ReturnType<UsersController['update']>>
  >(`/users/${id}`, body);
  return data;
}

export async function deleteUser(id: number) {
  await request.delete<GlobalApiTypes<ReturnType<UsersController['remove']>>>(
    `/users/${id}`,
  );
  return `删除用户成功`;
}
