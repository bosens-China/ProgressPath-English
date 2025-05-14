import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Space,
  Popconfirm,
  App,
  Form,
  Select,
  Input,
  Table,
} from 'antd';
import type { TableProps } from 'antd';
import UploadDialog from './-components/upload-dialog';
import { deleteSection, getList } from '@/api/sections';
import { CourseSection } from 'backend-services/common/prisma.type.ts';
import dayjs from 'dayjs';
import { useAntdTable, useRequest } from 'ahooks';
import { useList } from '@/hooks/use-list';
import EditDialog from './-components/edit-dialog';
import { useState } from 'react';
import { getAllCourses } from '@/api/courses';
import { FindSectionsQueryDto } from 'backend-services/sections/dto/find-sections-query.dto.js';
import { Sort } from './-components/sort';

export const Route = createFileRoute('/_manage/sections/')({
  component: SectionsPage,
});

function SectionsPage() {
  const [form] = Form.useForm<FindSectionsQueryDto>();

  const { resetList, refreshCurrentList, tableProps, search } = useList(
    useAntdTable(getList, {
      form,
    }),
  );
  const { submit, reset } = search;

  const { message } = App.useApp();
  const { run: removeRun } = useRequest(deleteSection, {
    manual: true,
    onSuccess() {
      message.success(`删除成功`);
    },
    onError(e) {
      message.error(e.message);
    },
  });

  const columns: TableProps<CourseSection>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '标题', dataIndex: 'title', key: 'title' },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
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
        <Space size="middle">
          <Space>
            <Button
              className="p-0!"
              type="link"
              onClick={() => {
                setEditData(record);
                setEditDialogVisible(true);
              }}
            >
              编辑
            </Button>

            <Popconfirm
              title="确定删除吗？"
              description="删除后将无法恢复，请谨慎操作。"
              onConfirm={() => {
                removeRun(record.id);
              }}
            >
              <Button type="link" danger className="p-0!">
                删除
              </Button>
            </Popconfirm>
          </Space>
        </Space>
      ),
    },
  ];

  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editData, setEditData] = useState<null | CourseSection>(null);

  const { data: courses, loading: coursesLoading } = useRequest(getAllCourses, {
    onError(e) {
      message.error(e.message);
    },
  });

  return (
    <div>
      <div className="flex mb-4">
        <Form className="flex-1" layout="inline" form={form}>
          <Form.Item<FindSectionsQueryDto> name="courseId">
            <Select
              className="w-60!"
              placeholder="筛选课程小节"
              options={courses?.map((f) => {
                return { label: f.title, value: f.id };
              })}
              loading={coursesLoading}
            ></Select>
          </Form.Item>
          <Form.Item<FindSectionsQueryDto> name="title">
            <Input placeholder="请输入搜索标题"></Input>
          </Form.Item>
          <Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={() => submit()}>
                  搜索
                </Button>
                <Button onClick={() => reset()}>重置</Button>
              </Space>
            </Form.Item>
          </Form.Item>
        </Form>
        <Space>
          <Sort refreshCurrentList={refreshCurrentList}></Sort>
          <UploadDialog resetList={resetList}></UploadDialog>
        </Space>
      </div>

      <Table rowKey="id" columns={columns} {...tableProps}></Table>

      <EditDialog
        visible={editDialogVisible}
        setVisible={setEditDialogVisible}
        refreshCurrentList={refreshCurrentList}
        data={editData}
      ></EditDialog>
    </div>
  );
}
