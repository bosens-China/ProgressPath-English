import { createFileRoute } from '@tanstack/react-router';
import {
  App,
  Button,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  TableProps,
} from 'antd';
import { getList } from '@/api/question-types';
import { useAntdTable, useRequest } from 'ahooks';
import { useList } from '@/hooks/use-list';
import { QuestionType } from 'backend-services/common/prisma.type.ts';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { AddEdit } from './-components/add-edit';
import { deleteQuestionType } from '@/api/question-types';

export const Route = createFileRoute('/_manage/question-types/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { message } = App.useApp();

  const { run: deleteRun, loading: deleteLoading } = useRequest(
    deleteQuestionType,
    {
      manual: true,
      onSuccess() {
        message.success('删除成功');
        refreshCurrentList();
      },
      onError(e) {
        message.error(e.message);
      },
    },
  );

  const columns: TableProps<QuestionType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => {
        return (
          <Space>
            <Button
              type="link"
              className="p-0!"
              onClick={() => {
                setOpen(true);
                setFormData(record);
              }}
            >
              编辑
            </Button>

            <Popconfirm
              title="确定删除吗？"
              description="删除后将无法恢复，请谨慎操作。"
              onConfirm={() => {
                deleteRun(record.id);
              }}
            >
              <Button
                type="link"
                danger
                className="p-0!"
                loading={deleteLoading}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const [form] = Form.useForm<QuestionType>();
  const { tableProps, search, resetList, refreshCurrentList } = useList(
    useAntdTable(getList, {
      onError(e) {
        message.error(e.message);
      },
      form,
    }),
  );
  const { submit, reset } = search;

  const [formData, setFormData] = useState<QuestionType | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex mb-4">
        <Form className="flex-1" layout="inline" form={form}>
          <Form.Item<QuestionType> name="name">
            <Input className="w-80" placeholder="请输入名称"></Input>
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
        <div>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            新建
          </Button>
        </div>
      </div>
      <Table rowKey="id" columns={columns} {...tableProps}></Table>
      <AddEdit
        resetList={resetList}
        refreshCurrentList={refreshCurrentList}
        open={open}
        setOpen={setOpen}
        formData={formData}
      ></AddEdit>
    </div>
  );
}
