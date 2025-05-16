import { App, Form, Input, Modal } from 'antd';
import React, { FC, useEffect } from 'react';
import { createDifyManage, updateDifyManage } from '@/api/dify-manage';
import { useRequest } from 'ahooks';
import * as _ from 'lodash-es';
import { CodeEditor } from '@/components/code-editor';
import { DifyManage } from 'backend-services/common/prisma.type.ts';
import { CreateDifyManageDto } from 'backend-services/dify-manage/dto/create-dify-manage.dto.js';

interface Props {
  data: DifyManage | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshCurrentList: () => void;
  resetList: () => void;
}

type FormValues = CreateDifyManageDto;

export const EditDifyDialog: FC<Props> = ({
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

  const { run: addDifyRequest, loading: addDifyLoading } = useRequest(
    createDifyManage,
    {
      manual: true,
      onError(e) {
        message.error(e.message);
      },
      onSuccess() {
        message.success('添加Dify配置成功');
        onCancel();
        resetList();
      },
    },
  );

  const { run: editDifyRequest, loading: editDifyLoading } = useRequest(
    updateDifyManage,
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

    const formattedValues: CreateDifyManageDto = {
      ...values,
      body: values.body ? JSON.parse(values.body as unknown as string) : {},
      headers: values.headers
        ? JSON.parse(values.headers as unknown as string)
        : {},
    };

    if (!data) {
      addDifyRequest(formattedValues);
      return;
    }
    editDifyRequest(data.id, formattedValues);
  };

  useEffect(() => {
    if (data && open) {
      form.setFieldsValue({
        ...(_.mapValues(data, (value, key) => {
          // 将对象转为字符串以便显示
          if (
            value &&
            typeof value === 'object' &&
            (key === 'body' || key === 'headers')
          ) {
            return JSON.stringify(value, null, 2);
          }
          return value === null ? undefined : value;
        }) as unknown as FormValues),
      });
    }
  }, [data, form, open]);

  return (
    <Modal
      centered
      open={open}
      onCancel={onCancel}
      title={data ? '编辑Dify配置' : '添加Dify配置'}
      onOk={onOk}
      width={'80vw'}
      confirmLoading={addDifyLoading || editDifyLoading}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-h-65vh overflow-y-auto"
        initialValues={{
          body: '{}',
          headers: '{}',
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Form.Item<FormValues>
              name="name"
              label="名称"
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Input placeholder="请输入配置名称"></Input>
            </Form.Item>

            <Form.Item<FormValues>
              name="apiUrl"
              label="API地址"
              rules={[{ required: true, message: '请输入API地址!' }]}
            >
              <Input placeholder="请输入API地址，例如: https://api.dify.ai/v1/chat-messages"></Input>
            </Form.Item>

            <Form.Item<FormValues> name="description" label="描述">
              <Input placeholder="请输入描述"></Input>
            </Form.Item>

            <Form.Item<FormValues>
              name="token"
              label="Token"
              rules={[{ required: true, message: '请输入Token!' }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="请输入Token"
              ></Input.TextArea>
            </Form.Item>
          </div>
          <div>
            <Form.Item<FormValues>
              name="body"
              label="请求体模板(JSON)"
              tooltip="支持设置$age这样的变量，后续传递相对应参数会自动替换掉。"
              rules={[
                {
                  validator: (_, value) => {
                    try {
                      if (value) JSON.parse(value);
                      return Promise.resolve();
                    } catch {
                      return Promise.reject('无效的JSON格式');
                    }
                  },
                },
              ]}
            >
              <CodeEditor language="json" height="200px" />
            </Form.Item>

            <Form.Item<FormValues>
              name="headers"
              label="自定义请求头(JSON)"
              tooltip="除了必要的Authorization和Content-Type外，可以设置额外的请求头"
              rules={[
                {
                  validator: (_, value) => {
                    try {
                      if (value) JSON.parse(value);
                      return Promise.resolve();
                    } catch {
                      return Promise.reject('无效的JSON格式');
                    }
                  },
                },
              ]}
            >
              <CodeEditor language="json" height="150px" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
