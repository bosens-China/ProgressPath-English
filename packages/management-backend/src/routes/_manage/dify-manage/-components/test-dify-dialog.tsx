import { App, Button, Form, Modal, Spin } from 'antd';
import React, { FC, useState } from 'react';
import { useRequest } from 'ahooks';
import { testDifyConnection } from '@/api/dify-manage';
import TextArea from 'antd/es/input/TextArea';
import { DifyManage } from 'backend-services/common/prisma.type.ts';

// 使用条件渲染代替ReactJson
import { JsonView } from './json-view';

interface Props {
  data: DifyManage | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TestDifyDialog: FC<Props> = ({ data, open, setOpen }) => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const { message: appMessage } = App.useApp();

  const { loading, run } = useRequest(testDifyConnection, {
    manual: true,
    onSuccess: (res) => {
      setResult(res as Record<string, unknown>);
    },
    onError: (e) => {
      appMessage.error(e.message);
    },
  });

  const onCancel = () => {
    setOpen(false);
    setMessage('');
    setResult(null);
  };

  const handleTest = () => {
    if (!data) {
      appMessage.error('请先选择Dify配置');
      return;
    }

    if (!message.trim()) {
      appMessage.error('请输入测试消息');
      return;
    }

    run(data.id, message);
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={onCancel}
      title="测试Dify接口"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="test"
          type="primary"
          onClick={handleTest}
          loading={loading}
        >
          测试
        </Button>,
      ]}
      width={800}
    >
      <div className="mb-4">
        <div className="mb-2">当前配置: {data?.description || '未选择'}</div>
        <div className="mb-2">API地址: {data?.apiUrl || '未选择'}</div>
        <Form layout="vertical">
          <Form.Item label="测试消息">
            <TextArea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="请输入要发送的测试消息"
            />
          </Form.Item>
        </Form>
      </div>

      <div>
        <div className="mb-2 font-bold">响应结果:</div>
        <div className="p-4 border rounded bg-slate-50 max-h-60 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Spin tip="请求中..." />
            </div>
          ) : result ? (
            <JsonView data={result} />
          ) : (
            <div className="text-gray-400 h-40 flex items-center justify-center">
              暂无数据，点击测试按钮发送请求
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
