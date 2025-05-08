import { Modal, Upload, Button, App, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Papa from 'papaparse';
import { AddItem, Data } from './add-item';
import { useState } from 'react';
import { CreateQuestionDto } from 'backend-services/questions/dto/create-question.dto.js';
import { addQuestions } from '@/api/questions';
import { useRequest } from 'ahooks';

interface BatchUploadDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  resetList: () => void;
}

export function BatchUploadDialog({
  visible,
  setVisible,
  resetList,
}: BatchUploadDialogProps) {
  const onCancel = () => {
    setVisible(false);
  };

  const [data, setData] = useState<Data>([]);
  const { message } = App.useApp();
  const [form] = Form.useForm<{
    items: Partial<CreateQuestionDto>[];
  }>();

  const { run, loading } = useRequest(addQuestions, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success(`批量添加成功。`);
      resetList();
    },
  });

  const onOk = async () => {
    const values = await form.validateFields();
    if (!values.items.length) {
      message.warning(`上传项目不能为空`);
      return;
    }
    run(values.items as Required<CreateQuestionDto>[]);
  };

  const items = Form.useWatch('items', form);

  return (
    <Modal
      centered={items ? !!items.length : false}
      title="批量上传问题"
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      width={`80vw`}
      loading={loading}
    >
      <div className="my-4">
        <Upload
          name="file"
          beforeUpload={(file) => {
            Papa.parse(file, {
              header: true,
              complete: (results) => {
                const { errors, data } = results;
                if (errors.length) {
                  message.error(errors.join('\n'));
                  return;
                }

                setData(data as Data);
              },
            });
            return false;
          }}
          maxCount={1}
          accept=".csv"
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
      </div>
      <AddItem data={data} form={form}></AddItem>
    </Modal>
  );
}
