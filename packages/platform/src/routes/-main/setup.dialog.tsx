import { pictureBedUpload } from '@/api/upload';
import { UploadOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Tabs,
  Upload,
  UploadFile,
} from 'antd';
import { UpdateUserDto } from 'backend-services/users/dto/update-user.dto.js';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user';
import { updatePhone, updateUser } from '@/api/users';
import { useRequest } from 'ahooks';
import * as _ from 'lodash-es';
import { VerificationCode } from '@/routes/login/-components/verification-code';
import { UpdatePhoneDto } from 'backend-services/users/dto/update-phone.dto.js';

export const Setup: FC<PropsWithChildren> = ({ children }) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);

  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const onCancel = () => {
    setOpen(false);
  };

  const [baseForm] = Form.useForm<
    Pick<UpdateUserDto, 'nickname'> & {
      avatarUrl: UploadFile<string>[];
    }
  >();

  const [phoneForm] = Form.useForm<UpdatePhoneDto>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [activeKey, setActiveKey] = useState('base');

  useEffect(() => {
    if (!open) {
      return;
    }
    if (activeKey === 'base') {
      baseForm.setFieldsValue({
        ...user,
        nickname: user?.nickname || '',
        avatarUrl: user?.avatarUrl
          ? [
              {
                uid: `${user.id}`,
                name: user.avatarUrl?.split('/').pop() || '',
                status: 'done',
                url: user.avatarUrl,
              },
            ]
          : [],
      });
      return;
    }
    if (activeKey === 'phone') {
      phoneForm.setFieldsValue({
        newPhone: user?.phone || '',
        code: '',
      });
    }
  }, [activeKey, baseForm, open, phoneForm, user]);

  const { run: updataRun, loading: updataLoading } = useRequest(updateUser, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess(values) {
      message.success('更新成功');
      setUser(_.merge({}, user, values));
      onCancel();
    },
  });

  const { run: updataPhoneRun, loading: updataPhoneLoading } = useRequest(
    updatePhone,
    {
      manual: true,
      onError(e) {
        message.error(e.message);
      },
      onSuccess(values) {
        message.success('更新成功');
        setUser(_.merge({}, user, values));
        onCancel();
      },
    },
  );

  const onOk = async () => {
    if (!user?.id) {
      return;
    }
    if (activeKey === 'base') {
      const values = await baseForm.validateFields();
      updataRun(user.id, {
        ...values,
        avatarUrl:
          values.avatarUrl?.[0]?.response || values.avatarUrl?.[0]?.url,
      });
      return;
    }
    if (activeKey === 'phone') {
      const values = await phoneForm.validateFields();
      updataPhoneRun(user.id, {
        ...values,
      });
      return;
    }
  };

  const phone = Form.useWatch('phone', phoneForm);

  return (
    <>
      <div
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </div>
      <Modal
        title="设置用户信息"
        open={open}
        onCancel={onCancel}
        onOk={onOk}
        loading={updataLoading || updataPhoneLoading}
      >
        <Tabs
          accessKey={activeKey}
          onChange={(e) => {
            setActiveKey(e);
          }}
          items={[
            {
              key: 'base',
              label: `基础信息修改`,
              children: (
                <>
                  <Form layout="vertical" form={baseForm}>
                    <Form.Item<UpdateUserDto>
                      label="用户名"
                      name="nickname"
                      rules={[{ required: true, message: '请输入用户名' }]}
                    >
                      <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item<UpdateUserDto>
                      name="avatarUrl"
                      label="头像"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      rules={[
                        {
                          required: true,
                          message: '请上传头像',
                        },
                      ]}
                    >
                      <Upload
                        name="file"
                        accept="image/*"
                        customRequest={async (f) => {
                          try {
                            const data = await pictureBedUpload(f.file as File);
                            f.onSuccess?.(data.original || '');
                          } catch (e) {
                            f.onError?.(e as Error);
                          }
                        }}
                        listType="picture"
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />}>点击上传图片</Button>
                      </Upload>
                    </Form.Item>
                  </Form>
                </>
              ),
            },
            {
              key: 'phone',
              label: '手机号修改',
              children: (
                <>
                  <Form layout="vertical" form={phoneForm}>
                    <Form.Item<UpdatePhoneDto>
                      name="newPhone"
                      label="手机号"
                      rules={[
                        { required: true, message: '请输入手机号' },
                        {
                          pattern: /^1[3456789]\d{9}$/,
                          message: '请输入正确的手机号',
                        },
                      ]}
                    >
                      <Input placeholder="请输入手机号" />
                    </Form.Item>
                    <Form.Item<UpdatePhoneDto>
                      label="验证码"
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: '请输入验证码',
                        },
                        {
                          type: 'regexp',
                          pattern: /^\d{4,6}$/,
                          message: '请输入正确的验证码',
                        },
                      ]}
                    >
                      <VerificationCode phone={phone}></VerificationCode>
                    </Form.Item>
                  </Form>
                </>
              ),
            },
          ]}
        />
      </Modal>
    </>
  );
};
