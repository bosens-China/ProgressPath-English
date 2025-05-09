import { getAllQuestionTypes } from '@/api/question-types';
import { useRequest } from 'ahooks';
import { App, Select, SelectProps } from 'antd';
import { FC } from 'react';

export const QuestionType: FC<SelectProps> = (props) => {
  const { message } = App.useApp();
  const { data, loading } = useRequest(getAllQuestionTypes, {
    onError(e) {
      message.error(e.message);
    },
  });

  return (
    <Select
      {...props}
      loading={loading}
      options={data?.map((f) => {
        return {
          label: f.name,
          value: f.id,
        };
      })}
    ></Select>
  );
};
