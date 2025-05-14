import { createFileRoute } from '@tanstack/react-router';
import {
  Table,
  Button,
  Space,
  Tag,
  Form,
  Input,
  Select,
  App,
  Image,
  Popconfirm,
} from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';
import { FindCoursesQueryDto } from 'backend-services/courses/dto/find-courses-query.dto.ts';
import { useAntdTable, useRequest } from 'ahooks';
import { deleteCourse, getList, toggleCourseStatus } from '@/api/courses';
import { Course } from 'backend-services/common/prisma.type.ts';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useList } from '@/hooks/use-list';
import { AddEdit } from './-components/add-edit';

export const Route = createFileRoute('/_manage/courses/')({
  component: CoursesPage,
});

function CoursesPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { message } = App.useApp();

  // 删除课程
  const { run: deleteCourseRun } = useRequest(deleteCourse, {
    manual: true,
    onError(e) {
      message.error(e.message);
    },
    onSuccess() {
      message.success('删除成功');
      refresh();
    },
  });

  const { run: toggleCourseStatusRun, loading: toggleCourseStatusLoading } =
    useRequest(toggleCourseStatus, {
      manual: true,
      onError(e) {
        message.error(e.message);
      },
      onSuccess() {
        message.success('操作成功');
        refresh();
      },
    });

  const showAddModal = () => {
    setIsModalVisible(true);
    setEditForm(null);
  };

  const columns: TableProps<Course>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '标题', dataIndex: 'title', key: 'title' },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
    },
    {
      title: '略缩图',
      render: (_, record) => {
        if (!record.coverImageUrl) {
          return null;
        }
        return <Image src={record.coverImageUrl} width={72}></Image>;
      },
      key: 'coverImageUrl',
    },
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
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            className="p-0!"
            type="link"
            onClick={() => {
              showAddModal();
              setEditForm(record);
            }}
          >
            编辑
          </Button>
          {record.isPublished ? (
            <Button
              type="link"
              className="p-0!"
              loading={toggleCourseStatusLoading}
              onClick={() => {
                toggleCourseStatusRun(record.id, {
                  isPublished: false,
                });
              }}
            >
              停用
            </Button>
          ) : (
            <Button
              type="link"
              loading={toggleCourseStatusLoading}
              className="p-0!"
              onClick={() => {
                toggleCourseStatusRun(record.id, {
                  isPublished: true,
                });
              }}
            >
              启用
            </Button>
          )}

          <Popconfirm
            title="确定删除吗？"
            description="删除后将无法恢复，请谨慎操作。"
            onConfirm={() => {
              deleteCourseRun(record.id);
            }}
          >
            <Button type="link" danger className="p-0!">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [queryForm] = Form.useForm<FindCoursesQueryDto>();

  const { tableProps, search, refresh, resetList, refreshCurrentList } =
    useList(
      useAntdTable(getList, {
        form: queryForm,
      }),
    );
  const { submit, reset } = search;

  // 编辑的表单数据
  const [editForm, setEditForm] = useState<Course | null>(null);

  return (
    <div>
      {/* <h1 className="text-2xl font-semibold mb-4">课程管理</h1>
      <div className="mb-4">
        <Button type="primary" onClick={showAddModal}>
          创建课程
        </Button>
      </div> */}

      <div className="flex items-center mb-4">
        <Form
          layout="inline"
          className="flex-1"
          initialValues={{ isPublished: 'all' }}
          form={queryForm}
        >
          <Form.Item<FindCoursesQueryDto> name="title">
            <Input className="w-60" placeholder="请输入课程名称"></Input>
          </Form.Item>
          <Form.Item<FindCoursesQueryDto> name="isPublished">
            <Select
              className="w-30!"
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
        <Button type="primary" onClick={showAddModal} icon={<PlusOutlined />}>
          创建课程
        </Button>
      </div>

      <Table columns={columns} rowKey="id" {...tableProps} />
      <AddEdit
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        editForm={editForm}
        refreshCurrentList={refreshCurrentList}
        resetList={resetList}
      ></AddEdit>
    </div>
  );
}
