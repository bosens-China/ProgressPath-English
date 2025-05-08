import { App, Form, Input, Modal } from 'antd';
import { QuestionType } from 'backend-services/common/prisma.type.ts';
import { FC, useEffect } from 'react';
import { addQuestionType, editQuestionType } from '@/api/question-types';
import { useRequest } from 'ahooks';
import * as _ from 'lodash-es';
import { CreateQuestionTypeDto } from 'backend-services/question-types/dto/create-question-type.dto.js';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: QuestionType | null;
  resetList: () => void;
  refreshCurrentList: () => void;
}

export const AddEdit: FC<Props> = ({
  open,
  setOpen,
  formData,
  resetList,
  refreshCurrentList,
}) => {
  const { message } = App.useApp();

  const [form] = Form.useForm<QuestionType>();

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const { loading: addLoading, run: addRun } = useRequest(addQuestionType, {
    manual: true,
    onSuccess() {
      message.success('添加成功');
      onCancel();
      resetList();
    },
    onError(e) {
      message.error(e.message);
    },
  });
  const { loading: editLoading, run: editRun } = useRequest(editQuestionType, {
    manual: true,
    onSuccess() {
      message.success('编辑成功');
      onCancel();
      refreshCurrentList();
    },
    onError(e) {
      message.error(e.message);
    },
  });

  const onOk = async () => {
    const values = await form.validateFields();
    const json = _.mapValues(values, (value) =>
      value === null ? undefined : value,
    ) as CreateQuestionTypeDto;
    if (formData) {
      editRun(formData.id, json);
      return;
    }
    addRun(json);
  };

  useEffect(() => {
    if (formData && open) {
      form.setFieldsValue(formData);
    }
  }, [form, formData, open]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title={formData ? '编辑问题类型' : '添加问题类型'}
      loading={addLoading || editLoading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item<QuestionType>
          label="名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入名称',
            },
          ]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item<QuestionType> label="描述" name="description">
          <Input placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
