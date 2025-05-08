import { CloseOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  Form,
  FormInstance,
  Input,
  InputNumber,
} from 'antd';
import { CreateQuestionDto } from 'backend-services/questions/dto/create-question.dto.js';
import { FC, useEffect } from 'react';

export type Data = Partial<CreateQuestionDto>[];
interface Props {
  data: Data;
  form: FormInstance<{
    items: Partial<CreateQuestionDto>[];
  }>;
}

export const AddItem: FC<Props> = ({ data, form }) => {
  useEffect(() => {
    if (Array.isArray(data)) {
      form.setFieldsValue({
        items: data,
      });
    }
  }, [data, form]);
  return (
    <>
      <Form initialValues={{ items: [{}] }} form={form} layout="vertical">
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              <div className="grid grid-cols-3 gap-8 max-h-60vh overflow-y-auto">
                {fields.map(({ key, name }) => {
                  return (
                    <Card
                      title={`items: ${name + 1}`}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            remove(name);
                          }}
                        />
                      }
                      key={key}
                    >
                      <Form.Item
                        name={[name, 'questionText']}
                        label="问题"
                        rules={[{ required: true, message: '请输入问题!' }]}
                      >
                        <Input placeholder="请输入问题" />
                      </Form.Item>
                      <Form.Item
                        name={[name, 'options']}
                        label="问题额外选项"
                        extra="要求json类型"
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="请输入问题额外选项"
                        />
                      </Form.Item>
                      <Form.Item
                        name={[name, 'correctAnswer']}
                        label="正确答案"
                      >
                        <Input placeholder="请输入正确答案" />
                      </Form.Item>
                      <Form.Item name={[name, 'explanation']} label="答案解析">
                        <Input placeholder="请输入答案解析" />
                      </Form.Item>
                      <Form.Item name={[name, 'order']} label="排序">
                        <InputNumber
                          placeholder="请输入排序"
                          className="w-40"
                        />
                      </Form.Item>
                      <Divider />
                    </Card>
                  );
                })}
              </div>
              <Button
                type="dashed"
                className="w-40! inline-flex"
                onClick={() => add()}
                block
              >
                添加 items
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
};
