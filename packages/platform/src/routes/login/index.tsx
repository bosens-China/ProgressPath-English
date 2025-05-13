import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { App, Button, Form, Input, Typography } from 'antd';
import { loginWithPhone } from '@/api/users';
import { useRequest } from 'ahooks';
import { useUserStore } from '@/stores/user';
import { useEffect } from 'react';
import { VerificationCode } from './-components/verification-code';
import { LoginWithPhoneDto } from 'backend-services/users/dto/login-with-phone.dto.js';

export const Route = createFileRoute('/login/')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [form] = Form.useForm<LoginWithPhoneDto>();

  const setUser = useUserStore((s) => s.setUser);
  const { message } = App.useApp();

  /*
   * 进入登陆页面就要清空用户信息，防止还可以返回的情况出现
   */
  useEffect(() => {
    setUser(null);
  }, [setUser]);

  const { run } = useRequest(loginWithPhone, {
    manual: true,
    onSuccess(data) {
      setTimeout(() => {
        navigate({
          to: '/dashboard',
        });
      }, 2000);
      message.success('登陆成功');
      setUser(data);
    },
    onError(error) {
      message.error(error.message);
    },
  });

  const onFinish = (values: LoginWithPhoneDto) => {
    run(values);
  };

  const phone = Form.useWatch('phone', form);

  return (
    <>
      <div className="h-100vh overflow-hidden flex">
        <div className="flex-1 bg-[#F8F7FF]"></div>
        <div className="flex-1 h-100vh p-16 flex flex-col items-center justify-center py-32">
          <Typography.Title level={1}>
            欢迎来到 Progresspath English
          </Typography.Title>
          <Typography.Paragraph>
            从今天就开始你的学习之旅🌟
          </Typography.Paragraph>

          <Form
            form={form}
            layout="vertical"
            className="flex-1 flex flex-col w-100% justify-center max-w-160"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item<LoginWithPhoneDto>
              name="phone"
              label="手机号"
              rules={[
                {
                  required: true,
                  message: '请输入手机号',
                },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入正确的手机号',
                },
              ]}
            >
              <Input placeholder="请输入手机号"></Input>
            </Form.Item>
            <Form.Item<LoginWithPhoneDto>
              name="code"
              label="验证码"
              rules={[
                {
                  required: true,
                  message: '请输入验证码',
                },
                {
                  pattern: /^\d{4,6}$/,
                  message: '请输入正确的验证码',
                },
              ]}
            >
              <VerificationCode
                placeholder="请输入验证码"
                phone={phone}
              ></VerificationCode>
            </Form.Item>
            <Form.Item>
              <Button type="primary" block htmlType="submit">
                登陆/登陆
              </Button>
            </Form.Item>
          </Form>
          <Typography.Paragraph>
            未注册新用户会自动注册，登陆即表示您同意我们的服务条款。
          </Typography.Paragraph>

          <Typography.Paragraph>
            需要帮助？
            <Typography.Link href="mailto:yangboses@gmail.com">
              联系我们
            </Typography.Link>
          </Typography.Paragraph>
        </div>
      </div>
    </>
  );
}
