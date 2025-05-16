import { App, Form, Modal } from 'antd';
import React, { FC } from 'react';
import { DifyManage } from 'backend-services/common/prisma.type.ts';
import { useDynamicFetch } from '@/hooks/use-dynamic-fetch';
import { CodeEditor } from '@/components/code-editor';
import { useUserStore } from '@/stores/user';

interface Props {
  data: DifyManage | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
  inputs: string;
}

export const TestDifyDialog: FC<Props> = ({ data, open, setOpen }) => {
  const [form] = Form.useForm<FormValues>();

  const { message } = App.useApp();

  const {
    loading,
    run,
    data: responseData,
    isSSE,
  } = useDynamicFetch({
    onError(error) {
      message.error(error.message);
    },
  });

  const onCancel = () => {
    setOpen(false);
  };

  const token = useUserStore((s) => s.user?.access_token);

  const onOk = async () => {
    const values = await form.validateFields();
    const newValues = values.inputs ? JSON.parse(values.inputs) : {};
    run(`/api/dify-manage/proxy/${data?.id}`, {
      body: JSON.stringify(newValues),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={onCancel}
      title="测试Dify接口"
      width={800}
      okText="运行"
      onOk={onOk}
      loading={isSSE ? false : loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          inputs: '{}',
        }}
      >
        <Form.Item<FormValues>
          name="inputs"
          label="输入参数"
          rules={[
            {
              validator: async (_, value) => {
                if (!value) {
                  return;
                }
                try {
                  JSON.parse(value);
                } catch {
                  return Promise.reject(new Error('请输入合法的JSON格式'));
                }
              },
            },
          ]}
        >
          <CodeEditor
            height="30vh"
            language="json"
            theme="vs-light"
            value={JSON.stringify(data)}
          ></CodeEditor>
        </Form.Item>

        <Form.Item label={`响应数据${isSSE && loading ? ' loading...' : ''}`}>
          <CodeEditor
            language="txt"
            theme="vs-light"
            height="30vh"
            options={{
              readOnly: true,
              minimap: {
                enabled: false,
              },
            }}
            value={
              Array.isArray(responseData)
                ? responseData.join('\n\n')
                : `${responseData}`
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
