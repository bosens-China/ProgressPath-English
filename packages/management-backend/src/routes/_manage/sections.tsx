import { createFileRoute, useParams, Link } from '@tanstack/react-router';
import { Table, Button, Space, Modal, Form, Input, InputNumber } from 'antd';
import type { TableProps } from 'antd';
import { useState, useEffect } from 'react';

// TODO: Define Section interface based on backend API
interface Section {
  id: number;
  title: string;
  order: number;
  courseId: number;
  createdAt: string;
}

export const Route = createFileRoute('/_manage/sections')({
  component: SectionsPage,
});

function SectionsPage() {
  const { courseId } = useParams({ from: Route.id });
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // TODO: Replace with actual API calls to fetch sections for courseId
  const fetchSections = (cId: string) => {
    console.log('Fetching sections for course:', cId);
    setLoading(true);
    const mockSections: Section[] = [
      {
        id: 101,
        title: '第一节：React 基础',
        order: 1,
        courseId: parseInt(cId),
        createdAt: new Date().toISOString(),
      },
      {
        id: 102,
        title: '第二节：组件与 Props',
        order: 2,
        courseId: parseInt(cId),
        createdAt: new Date().toISOString(),
      },
    ];
    setTimeout(() => {
      setSections(mockSections);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (courseId) {
      fetchSections(courseId);
    }
  }, [courseId]);

  const showAddModal = () => {
    form.resetFields();
    form.setFieldsValue({ order: (sections.length + 1) * 10 }); // Default order
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('Add Section:', { ...values, courseId });
      // TODO: Add API call to create section for courseId
      setIsModalVisible(false);
      if (courseId) fetchSections(courseId); // Refresh list
    } catch (info) {
      console.log('Validate Failed:', info);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: TableProps<Section>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      sorter: (a, b) => a.order - b.order,
    },
    { title: '标题', dataIndex: 'title', key: 'title' },
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
          {/* Link to questions page for this section */}
          <Link
            to="/manage/courses/$courseId/sections/$sectionId/questions"
            params={{
              courseId: record.courseId.toString(),
              sectionId: record.id.toString(),
            }}
          >
            <Button type="link">问题管理</Button>
          </Link>
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
        课程 {courseId} - 小节管理
      </h1>
      <div className="mb-4">
        <Button type="primary" onClick={showAddModal}>
          添加小节
        </Button>
        <Link to="/manage/courses" className="ml-4">
          <Button>返回课程列表</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={sections.sort((a, b) => a.order - b.order)} // Ensure sorted display
        loading={loading}
        rowKey="id"
        bordered
      />
      <Modal
        title="添加新小节"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="title"
            label="小节标题"
            rules={[{ required: true, message: '请输入小节标题!' }]}
          >
            <Input />
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
          {/* Add more fields as needed */}
        </Form>
      </Modal>
    </div>
  );
}
