import { request } from '@/utils/request';
import { AdminLoginDto } from 'backend-services/admin/dto/admin-login.dto.ts';
import { AdminService } from 'backend-services/admin/admin.service.ts';

// 登陆
export const login = async (body: AdminLoginDto) => {
  const {
    data: { data },
  } = await request.post<GlobalApiTypes<ReturnType<AdminService['login']>>>(
    '/admin/login',
    body,
  );

  return data;
};
