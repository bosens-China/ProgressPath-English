import { Modal, Form, Input, Select, InputNumber, App } from 'antd';
import { useEffect } from 'react';
import { SectionQuestion } from 'backend-services/common/prisma.type.ts';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from 'backend-services/questions/dto'; // Assuming DTOs are exported from an index file
import { createQuestion, updateQuestion } from '@/api/questions';
import { getAllQuestionTypes } from '@/api/questionTypes'; // Added API for fetching question types
import { useRequest } from 'ahooks';
import { Prisma } from '@prisma/client'; // For Prisma.JsonValue

// If QuestionWithOptions is a specific type you have, import it. Otherwise, SectionQuestion might suffice for data.
// import { QuestionWithOptions } from 'backend-services/questions/questions.service';

interface EditQuestionDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  refreshCurrentList: () => void;
  data: (SectionQuestion & { questionTypeId?: number; name?: string }) | null; // Added name to data for potential display needs, ensure backend provides it or adjust
  initialSectionId?: number;
  availableSections?: { label: string; value: number }[]; // For section selection
}

interface QuestionType {
  id: number;
  name: string;
  // Add other fields if your QuestionType entity has them
}

function EditQuestionDialog({
  visible,
  setVisible,
  refreshCurrentList,
  data,
  initialSectionId,
  availableSections,
}: EditQuestionDialogProps) {
  const [form] = Form.useForm<CreateQuestionDto | UpdateQuestionDto>();
  const { message } = App.useApp();

  const { data: availableQuestionTypes, loading: questionTypesLoading } =
    useRequest<
      QuestionType[] // Added explicit type for useRequest data
    >(getAllQuestionTypes, {
      onError: (e) => {
        message.error(`获取问题类型失败: ${e.message}`);
      },
    });

  const { run: runCreate, loading: createLoading } = useRequest(
    async (payload: CreateQuestionDto) => createQuestion(payload),
    {
      manual: true,
      onSuccess: () => {
        message.success('添加成功');
        setVisible(false);
        refreshCurrentList();
      },
      onError: (e) => {
        message.error(`添加失败: ${e.message}`);
      },
    },
  );

  const { run: runUpdate, loading: updateLoading } = useRequest(
    async (id: number, payload: UpdateQuestionDto) =>
      updateQuestion(id, payload),
    {
      manual: true,
      onSuccess: () => {
        message.success('更新成功');
        setVisible(false);
        refreshCurrentList();
      },
      onError: (e) => {
        message.error(`更新失败: ${e.message}`);
      },
    },
  );

  useEffect(() => {
    if (visible) {
      // Reset and set fields only when dialog becomes visible
      form.resetFields(); // Reset fields first
      if (data) {
        // For 'options', Prisma.JsonValue could be an object/array.
        // For a TextArea, it should be stringified.
        // For other form components, it might need specific structuring.
        form.setFieldsValue({
          ...data,
          questionTypeId: data.questionTypeId,
          options: data.options
            ? JSON.stringify(data.options, null, 2)
            : undefined,
          sectionId: data.sectionId,
        });
      } else if (initialSectionId) {
        form.setFieldsValue({ sectionId: initialSectionId, order: 10 }); // Default order for new questions
      } else {
        form.setFieldsValue({ order: 10 }); // Default order if no specific section
      }
    }
  }, [data, form, initialSectionId, visible]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let parsedOptions: Prisma.JsonValue | undefined = undefined;

      if (
        values.options &&
        typeof values.options === 'string' &&
        values.options.trim()
      ) {
        try {
          parsedOptions = JSON.parse(values.options);
        } catch (e: any) {
          console.error('选项 JSON 解析错误:', e);
          message.error(`选项 JSON 格式不正确: ${e.message}`);
          return;
        }
      } else if (values.options === null || values.options === '') {
        // Allow explicitly setting options to null or empty
        parsedOptions = Prisma.JsonNull; // Or handle as undefined depending on backend
      }

      const payload = {
        ...values,
        questionTypeId: Number(values.questionTypeId),
        options: parsedOptions,
        sectionId: Number(values.sectionId),
        order:
          values.order === null || values.order === undefined
            ? undefined
            : Number(values.order), // Ensure order is number or undefined
      };

      // Remove undefined fields from payload to prevent issues with Prisma expecting explicit nulls or omission
      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      if (data?.id) {
        runUpdate(data.id, payload as UpdateQuestionDto);
      } else {
        runCreate(payload as CreateQuestionDto);
      }
    } catch (info) {
      console.log('表单校验失败:', info);
      message.warning('请检查表单输入！');
    }
  };

  return (
    <Modal
      title={data ? '编辑问题' : '添加新问题'}
      open={visible}
      onOk={handleOk}
      onCancel={() => setVisible(false)}
      confirmLoading={createLoading || updateLoading}
      width={800}
      destroyOnClose // Resets form state when modal is closed
      maskClosable={false}
    >
      <Form form={form} layout="vertical" name="edit_question_form">
        <Form.Item
          name="sectionId"
          label="所属小节"
          rules={[{ required: true, message: '请选择所属小节!' }]}
        >
          {availableSections ? (
            <Select
              placeholder="选择所属小节"
              options={availableSections}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          ) : (
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入所属小节ID (若无选择器)"
            />
          )}
        </Form.Item>
        <Form.Item
          name="questionText"
          label="问题内容"
          rules={[{ required: true, message: '请输入问题内容!' }]}
        >
          <Input.TextArea rows={3} placeholder="输入问题的主要描述或题目" />
        </Form.Item>
        <Form.Item
          name="questionTypeId"
          label="问题类型"
          rules={[{ required: true, message: '请选择问题类型!' }]}
        >
          <Select
            placeholder="选择问题类型"
            loading={questionTypesLoading}
            options={availableQuestionTypes?.map((qt: QuestionType) => ({
              label: qt.name,
              value: qt.id,
            }))}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="options"
          label="选项 (JSON 格式)"
          tooltip='例如: [{"text": "选项A", "value": "A"}, {"text": "选项B", "value": "B"}] 或对于填空题 [{"answer": "答案1"}, {"answer": "答案2"}]'
        >
          <Input.TextArea
            rows={4}
            placeholder='单选/多选: [{"text": "选项文本", "value": "选项值"}, ...]
判断题: [{"text": "正确", "value": "true"}, {"text": "错误", "value": "false"}]
填空题: [{"answer": "参考答案1"}, {"answer": "参考答案2"}] (每个空一个对象)
问答题: 此字段通常留空或不适用'
          />
        </Form.Item>
        <Form.Item name="correctAnswer" label="正确答案">
          <Input placeholder="例如: A (单选), A,B (多选以逗号分隔), true (判断题), 填空题答案 (若有标准答案), 问答题可留空" />
        </Form.Item>
        <Form.Item name="explanation" label="答案解析">
          <Input.TextArea rows={2} placeholder="输入对答案的详细解释说明" />
        </Form.Item>
        <Form.Item
          name="order"
          label="排序 (可选)"
          tooltip="数字越小越靠前, 用于控制问题在小节内的显示顺序"
          rules={[{ type: 'number', message: '请输入有效的排序值!' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="例如: 10, 20, 30..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditQuestionDialog;
