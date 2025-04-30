import { createFileRoute, useParams, Link } from '@tanstack/react-router';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
} from 'antd';
import type { TableProps } from 'antd';
import { useState, useEffect } from 'react';

const { Option } = Select;

// TODO: Define Question interface based on backend API
interface Question {
  id: number;
  questionText: string;
  questionType: 'multiple_choice' | 'single_choice'; // Example types
  order: number;
  sectionId: number;
  createdAt: string;
}

export const Route = createFileRoute(
  '/_manage/questions',
)({
  component: QuestionsPage,
});

function QuestionsPage() {
  const { courseId, sectionId } = useParams({ from: Route.id });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // TODO: Replace with actual API calls to fetch questions for sectionId
  const fetchQuestions = (sId: string) => {
    console.log('Fetching questions for section:', sId);
    setLoading(true);
    const mockQuestions: Question[] = [
      {
        id: 1001,
        questionText: 'React 是什么？',
        questionType: 'single_choice',
        order: 1,
        sectionId: parseInt(sId),
        createdAt: new Date().toISOString(),
      },
      {
        id: 1002,
        questionText: '以下哪些是 React Hooks？',
        questionType: 'multiple_choice',
        order: 2,
        sectionId: parseInt(sId),
        createdAt: new Date().toISOString(),
      },
    ];
    setTimeout(() => {
      setQuestions(mockQuestions);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (sectionId) {
      fetchQuestions(sectionId);
    }
  }, [sectionId]);

  const showAddModal = () => {
    form.resetFields();
    form.setFieldsValue({ order: (questions.length + 1) * 10 }); // Default order
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Add Question:', { ...values, sectionId });
      // TODO: Add API call to create question for sectionId
      setIsModalVisible(false);
      if (sectionId) fetchQuestions(sectionId); // Refresh list
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: TableProps<Question>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      sorter: (a, b) => a.order - b.order,
    },
    { title: '问题内容', dataIndex: 'questionText', key: 'questionText' },
    { title: '类型', dataIndex: 'questionType', key: 'questionType' },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        小节 {sectionId} - 问题管理
      </h1>
      <div className="mb-4">
        <Button type="primary" onClick={showAddModal}>
          添加问题
        </Button>
        <Link
          to="/manage/courses/$courseId/sections"
          params={{ courseId: courseId }}
          className="ml-4"
        >
          <Button>返回小节列表</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={questions.sort((a, b) => a.order - b.order)} // Ensure sorted display
        loading={loading}
        rowKey="id"
        bordered
      />
      <Modal
        title="添加新问题"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="添加"
        cancelText="取消"
        width={800} // Wider modal for question details
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="questionText"
            label="问题内容"
            rules={[{ required: true, message: '请输入问题内容!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="questionType"
            label="问题类型"
            rules={[{ required: true, message: '请选择问题类型!' }]}
          >
            <Select placeholder="选择类型">
              <Option value="single_choice">单选题</Option>
              <Option value="multiple_choice">多选题</Option>
              {/* Add other question types as needed */}
            </Select>
          </Form.Item>
          <Form.Item
            name="order"
            label="排序"
            rules={[
              { required: true, type: 'number', message: '请输入排序值!' },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          {/* TODO: Add fields for options, correct answer, explanation based on questionType */}
        </Form>
      </Modal>
    </div>
  );
}
