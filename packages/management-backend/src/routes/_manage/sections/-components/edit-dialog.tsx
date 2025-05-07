import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, App } from 'antd';
import { CourseSection } from 'backend-services/common/prisma.type.ts';
import { useRequest } from 'ahooks';
import { updateSection } from '@/api/sections';
import * as _ from 'lodash-es';
import { UpdateSectionDto } from 'backend-services/sections/dto/update-section.dto.js';

interface EditDialogProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  refreshCurrentList: () => void;
  data: CourseSection | null;
}

type FormValues = Pick<CourseSection, 'content' | 'order' | 'title'>;

const EditDialog: React.FC<EditDialogProps> = ({
  visible,
  setVisible,
  refreshCurrentList,
  data,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { message } = App.useApp();

  const { run, loading } = useRequest(updateSection, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success(`更新小节信息成功`);
      refreshCurrentList();
      onCancel();
    },
  });

  const handleOk = async () => {
    const values = await form.validateFields();
    run(
      data?.id as number,

      _.transform(
        values,
        (obj, value, key) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj as any)[key] = value || undefined;
          return obj;
        },
        {} as UpdateSectionDto,
      ),
    );
  };
  const onCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
    if (data && visible) {
      form.setFieldsValue(data);
    }
  }, [visible, data, form]);

  return (
    <Modal
      title="编辑小节"
      open={visible}
      onCancel={onCancel}
      destroyOnClose
      loading={loading}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item<FormValues>
          label="标题"
          name="title"
          rules={[{ required: true, message: '标题不能为空' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item<FormValues> label="排序权重" name="order">
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入排序，可以为空"
          />
        </Form.Item>
        <Form.Item<FormValues> label="内容" name="content">
          <Input.TextArea rows={4} placeholder="请输入内容" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDialog;
