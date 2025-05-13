import { request } from '../utils/request';
import { UsersController } from 'backend-services/users/users.controller.ts';
import { LoginWithPhoneDto } from 'backend-services/users/dto/login-with-phone.dto.js';
import { UpdateUserDto } from 'backend-services/users/dto/update-user.dto.js';
import { UpdatePhoneDto } from 'backend-services/users/dto/update-phone.dto.js';

export async function loginWithPhone(body: LoginWithPhoneDto) {
  const {
    data: { data },
  } = await request.post<
    GlobalApiTypes<ReturnType<UsersController['loginWithPhone']>>
  >('/users/login-with-phone', body);
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

// 修改手机号
export async function updatePhone(id: number, body: UpdatePhoneDto) {
  const {
    data: { data },
  } = await request.patch<
    GlobalApiTypes<ReturnType<UsersController['updatePhone']>>
  >(`/users/${id}/phone`, body);
  return data;
}
