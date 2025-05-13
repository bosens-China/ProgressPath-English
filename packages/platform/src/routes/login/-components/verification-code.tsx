import { sendSms } from '@/api/sms';
import { useRequest } from 'ahooks';
import { App, Button, Input, InputProps, Space } from 'antd';
import { FC, useState } from 'react';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  phone: string | undefined;
}

export const VerificationCode: FC<Props & InputProps> = ({
  phone,
  value,
  onChange,
  ...rest
}) => {
  const { message } = App.useApp();

  const { run, loading } = useRequest(sendSms, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success('验证码发送成功');
      setCount(60);
      const timer = setInterval(() => {
        setCount((count) => {
          if (count === 1) {
            clearInterval(timer);
            return null;
          }
          return count! - 1;
        });
      }, 1000);
    },
  });

  const [count, setCount] = useState<number | null>(null);

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Input
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        {...rest}
      ></Input>
      <Button
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(rest as any)}
        type="primary"
        loading={loading}
        disabled={!phone}
        className="w-20"
        onClick={() => {
          run({
            phone: phone!,
          });
        }}
      >
        {count ? `${count}s 后重新发送` : '获取验证码'}
      </Button>
    </Space.Compact>
  );
};
