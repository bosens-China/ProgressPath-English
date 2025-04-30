import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { App, Button, Form, Input, Typography } from 'antd';
import { AdminLoginDto } from 'backend-services/admin/dto/admin-login.dto.ts';
import { login } from '@/api/admin';
import { useRequest } from 'ahooks';
import { useUserStore } from '@/stores/user';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [form] = Form.useForm<AdminLoginDto>();

  const setUser = useUserStore((s) => s.setUser);
  const { message } = App.useApp();

  const { run } = useRequest(login, {
    manual: true,
    onSuccess(data) {
      setTimeout(() => {
        navigate({
          to: '/courses',
        });
      }, 2000);
      message.success('登陆成功');
      setUser(data);
    },
    onError(error) {
      message.error(error.message);
    },
  });

  const onFinish = (values: AdminLoginDto) => {
    run(values);
  };
  return (
    <>
      <div className="h-100vh overflow-hidden flex">
        <div className="flex-1"></div>
        <div className="p-12 flex  flex-col flex-wrap items-center justify-center h-100vh">
          <Typography.Title level={3}>欢迎登陆</Typography.Title>

          <Form
            form={form}
            layout="vertical"
            className="w-120"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<AdminLoginDto>
              name="username"
              label="用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input placeholder="请输入用户名"></Input>
            </Form.Item>
            <Form.Item<AdminLoginDto>
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input.Password placeholder="请输入密码"></Input.Password>
            </Form.Item>
            <Form.Item>
              <Button type="primary" block htmlType="submit">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
