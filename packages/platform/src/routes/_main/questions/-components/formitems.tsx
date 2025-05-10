import { Divider, Form, Input, InputNumber, TreeSelect } from 'antd';
import { FC } from 'react';
import { QuestionType } from './question-type';
import { useStructuralSection } from '@/hooks/use-structural-section';

interface Props {
  name?: number;
}

export const FormItems: FC<Props> = ({ name }) => {
  const { tree } = useStructuralSection();

  return (
    <>
      <Form.Item
        name={name ? [name, 'sectionId'] : 'sectionId'}
        label="课程小节"
        rules={[{ required: true, message: '请选择问题类型!' }]}
        getValueFromEvent={(value: string) => {
          return Number.parseFloat(value.split(',').at(0) as string);
        }}
      >
        <TreeSelect
          style={{ width: '100%' }}
          styles={{
            popup: { root: { maxHeight: 400, overflow: 'auto' } },
          }}
          treeData={tree}
        ></TreeSelect>
      </Form.Item>

      <Form.Item
        name={name ? [name, 'questionTypeId'] : 'questionTypeId'}
        label="问题类型"
        rules={[{ required: true, message: '请选择问题类型!' }]}
        extra="如果未创建，请到问题类型管理页面创建类型后再选择"
      >
        <QuestionType placeholder="请选择问题类型" />
      </Form.Item>
      <Divider />
      <Form.Item
        name={name ? [name, 'questionText'] : 'questionText'}
        label="问题"
        rules={[{ required: true, message: '请输入问题!' }]}
      >
        <Input.TextArea rows={2} placeholder="请输入问题" />
      </Form.Item>

      <Form.Item
        name={name ? [name, 'correctAnswer'] : 'correctAnswer'}
        label="正确答案"
      >
        <Input.TextArea rows={2} placeholder="请输入正确答案" />
      </Form.Item>
      <Form.Item
        name={name ? [name, 'explanation'] : 'explanation'}
        label="答案解析"
      >
        <Input.TextArea rows={2} placeholder="请输入答案解析" />
      </Form.Item>
      <Divider />
      <Form.Item
        name={name ? [name, 'options'] : 'options'}
        label="问题额外选项"
        extra="要求json类型"
      >
        <Input.TextArea rows={3} placeholder="请输入问题额外选项" />
      </Form.Item>

      <Form.Item name={name ? [name, 'order'] : 'order'} label="排序">
        <InputNumber placeholder="请输入排序" className="w-40" />
      </Form.Item>
    </>
  );
};
