import { App, Button, Form, Input, Modal, Upload, UploadFile } from 'antd';
import { CreateUserDto } from 'backend-services/users/dto/create-user.dto.ts';
import React, { FC, useEffect } from 'react';
import { createUser, updateUser } from '@/api/users';
import { useRequest } from 'ahooks';
import { User } from 'backend-services/common/prisma.type.ts';
import * as _ from 'lodash-es';
import { UploadOutlined } from '@ant-design/icons';
import { pictureBedUpload } from '@/api/upload';

interface Props {
  data: User | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshCurrentList: () => void;
  resetList: () => void;
}

type FormValues = Pick<CreateUserDto, 'nickname' | 'phone'> & {
  file?: UploadFile<string>[];
};

export const EditQuestionDialog: FC<Props> = ({
  data,
  open,
  setOpen,
  refreshCurrentList,
  resetList,
}) => {
  const [form] = Form.useForm<FormValues>();

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const { message } = App.useApp();

  const { run: addQuestionRequest, loading: addQuestionLoading } = useRequest(
    createUser,
    {
      manual: true,
      onError(e) {
        message.error(e.message);
      },
      onSuccess() {
        message.success('添加用户成功');
        onCancel();
        resetList();
      },
    },
  );

  const { run: editQuestionRequest, loading: editQuestionLoading } = useRequest(
    updateUser,
    {
      manual: true,
      onError(e) {
        message.error(e.message);
      },
      onSuccess() {
        message.success('更新成功');
        onCancel();
        refreshCurrentList();
      },
    },
  );

  const onOk = async () => {
    const values = await form.validateFields();
    const obj: CreateUserDto = {
      ...values,
      avatarUrl: values?.file?.[0]?.response || values?.file?.[0]?.url,
    };
    if (!data) {
      addQuestionRequest(obj);
      return;
    }
    editQuestionRequest(data.id, _.omit(obj, ['phone']));
  };

  useEffect(() => {
    if (data && open) {
      form.setFieldsValue({
        ...(_.mapValues(data, (value) => {
          return value === null ? undefined : value;
        }) as CreateUserDto),
        file: data.avatarUrl
          ? [
              {
                uid: `${data.id}`,
                name: data.avatarUrl?.split('/').pop() || '',
                status: 'done',
                url: data.avatarUrl,
              },
            ]
          : [],
      });
    }
  }, [data, form, open]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={onCancel}
      title={data ? '编辑用户' : '添加用户'}
      onOk={onOk}
      loading={addQuestionLoading || editQuestionLoading}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-h-65vh overflow-y-auto"
      >
        <>
          <Form.Item<FormValues> name={'nickname'} label="昵称">
            <Input placeholder="请输入昵称"></Input>
          </Form.Item>
          {/*
           * 禁止修改手机号，编辑情况下
           */}

          {data ? null : (
            <Form.Item<FormValues>
              name={'phone'}
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号!' },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入正确的手机号!',
                },
              ]}
            >
              <Input placeholder="请输入手机号"></Input>
            </Form.Item>
          )}

          <Form.Item<FormValues>
            name="file"
            label="头像"
            valuePropName="fileList"
            getValueFromEvent={normFile}
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
        </>
      </Form>
    </Modal>
  );
};
