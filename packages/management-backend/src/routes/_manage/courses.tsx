import { createFileRoute } from '@tanstack/react-router';
import { Table, Button, Space, Tag, Modal, Form, Input, Select } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import { FindCoursesQueryDto } from 'backend-services/courses/dto/find-courses-query.dto.ts';
import { useAntdTable } from 'ahooks';
import { getList } from '@/api/courses';
import { Course } from 'backend-services/common/prisma.type.ts';
import { CreateCourseDto } from 'backend-services/courses/dto/create-course.dto.js';

export const Route = createFileRoute('/_manage/courses')({
  component: CoursesPage,
});

function CoursesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<CreateCourseDto>();

  const showAddModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = async () => {};

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: TableProps<Course>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? 'green' : 'volcano'}>
          {isPublished ? '已发布' : '未发布'}
        </Tag>
      ),
    },
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
        <>
          <Button type="link">编辑</Button>
          {record.isPublished ? (
            <Button type="link" danger>
              停用
            </Button>
          ) : (
            <Button type="link" danger>
              启用
            </Button>
          )}
        </>
      ),
    },
  ];

  const [queryForm] = Form.useForm<FindCoursesQueryDto>();

  const { tableProps, search } = useAntdTable(getList, { form: queryForm });
  const { submit, reset } = search;
  return (
    <div>
      {/* <h1 className="text-2xl font-semibold mb-4">课程管理</h1>
      <div className="mb-4">
        <Button type="primary" onClick={showAddModal}>
          创建课程
        </Button>
      </div> */}

      <div className="flex items-center py-6">
        <Form
          layout="inline"
          className="flex-1"
          initialValues={{ isPublished: 'all' }}
          form={queryForm}
        >
          <Form.Item<FindCoursesQueryDto> name="title">
            <Input placeholder="请输入课程名称"></Input>
          </Form.Item>
          <Form.Item<FindCoursesQueryDto> name="isPublished">
            <Select
              options={[
                { label: '全部', value: 'all' },

                {
                  label: '启用',
                  value: `true`,
                },
                {
                  label: '禁用',
                  value: `false`,
                },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => submit()}>
                搜索
              </Button>
              <Button onClick={() => reset()}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <Button type="primary" onClick={showAddModal}>
          创建课程
        </Button>
      </div>

      <Table columns={columns} rowKey="id" {...tableProps} />
      <Modal
        title="创建新课程"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item<CreateCourseDto>
            name="title"
            label="课程标题"
            rules={[{ required: true, message: '请输入课程标题!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<CreateCourseDto> name="description" label="课程描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
