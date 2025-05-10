import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Form, FormInstance } from 'antd';
import { CreateQuestionDto } from 'backend-services/questions/dto/create-question.dto.js';
import { FC, useEffect } from 'react';
import { FormItems } from './formitems';

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
                      <FormItems name={name}></FormItems>
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
