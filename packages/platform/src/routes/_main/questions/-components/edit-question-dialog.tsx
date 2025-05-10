import { App, Form, Modal } from 'antd';
import { FormItems } from './formitems';
import { CreateQuestionDto } from 'backend-services/questions/dto/create-question.dto.js';
import React, { FC, useEffect } from 'react';
import { addQuestion, editQuestion } from '@/api/questions';
import { useRequest } from 'ahooks';
import { SectionQuestion } from 'backend-services/common/prisma.type.ts';
import * as _ from 'lodash-es';

interface Props {
  data: SectionQuestion | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshCurrentList: () => void;
  resetList: () => void;
}

export const EditQuestionDialog: FC<Props> = ({
  data,
  open,
  setOpen,
  refreshCurrentList,
  resetList,
}) => {
  const [form] = Form.useForm<CreateQuestionDto>();

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const { message } = App.useApp();

  const { run: addQuestionRequest, loading: addQuestionLoading } = useRequest(
    addQuestion,
    {
      manual: true,
      onError(e) {
        message.error(e.message);
      },
      onSuccess() {
        message.success('添加成功');
        onCancel();
        resetList();
      },
    },
  );

  const { run: editQuestionRequest, loading: editQuestionLoading } = useRequest(
    editQuestion,
    {
      manual: true,
      onError(e) {
        message.error(e.message);
      },
      onSuccess() {
        message.success('编辑成功');
        onCancel();
        refreshCurrentList();
      },
    },
  );

  const onOk = async () => {
    const values = await form.validateFields();
    if (!data) {
      addQuestionRequest(values);
      return;
    }
    editQuestionRequest(data.id, values);
  };

  useEffect(() => {
    if (data && open) {
      form.setFieldsValue(
        _.mapValues(data, (value) => {
          return value === null ? undefined : value;
        }) as CreateQuestionDto,
      );
    }
  }, [data, form, open]);

  return (
    <Modal
      centered
      open={open}
      onCancel={onCancel}
      title={data ? '编辑问题' : '添加问题'}
      onOk={onOk}
      loading={addQuestionLoading || editQuestionLoading}
    >
      <Form
        form={form}
        layout="vertical"
        className="max-h-65vh overflow-y-auto"
      >
        <FormItems></FormItems>
      </Form>
    </Modal>
  );
};
