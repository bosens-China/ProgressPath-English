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

    // 确保body和headers是对象
    try {
      if (values.body && typeof values.body === 'string') {
        values.body = JSON.parse(values.body);
      }
      if (values.headers && typeof values.headers === 'string') {
        values.headers = JSON.parse(values.headers);
      }
    } catch (error) {
      message.error('JSON格式错误，请检查');
      return;
    }

    if (!data) {
      addDifyRequest(values as CreateDifyManageDto);
      return;
    }
    editDifyRequest(data.id, values as CreateDifyManageDto);
  };

  useEffect(() => {
    if (data && open) {
      form.setFieldsValue({
        ...(_.mapValues(data, (value) => {
          // 将对象转为字符串以便显示
          if (value && typeof value === 'object') {
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
      width={800}
      confirmLoading={addDifyLoading || editDifyLoading}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-h-65vh overflow-y-auto"
      >
        <Form.Item<FormValues>
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述!' }]}
        >
          <Input placeholder="请输入描述"></Input>
        </Form.Item>

        <Form.Item<FormValues>
          name="apiUrl"
          label="API地址"
          rules={[{ required: true, message: '请输入API地址!' }]}
        >
          <Input placeholder="请输入API地址，例如: https://api.dify.ai/v1/chat-messages"></Input>
        </Form.Item>

        <Form.Item<FormValues>
          name="token"
          label="Token"
          rules={[{ required: true, message: '请输入Token!' }]}
        >
          <Input.Password placeholder="请输入Token"></Input.Password>
        </Form.Item>

        <Form.Item<FormValues>
          name="body"
          label="请求体模板(JSON)"
          tooltip="可以设置默认的请求体参数，实际调用时会被合并"
        >
          <CodeEditor language="json" height="200px" defaultValue="{}" />
        </Form.Item>

        <Form.Item<FormValues>
          name="headers"
          label="自定义请求头(JSON)"
          tooltip="除了必要的Authorization和Content-Type外，可以设置额外的请求头"
        >
          <CodeEditor language="json" height="150px" defaultValue="{}" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
