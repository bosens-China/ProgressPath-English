import { createFileRoute } from '@tanstack/react-router';
import { EditQuestionDialog } from './-components/edit-question-dialog';
import {
  App,
  Button,
  Form,
  Image,
  Input,
  Popconfirm,
  Space,
  Table,
  TableProps,
} from 'antd';
import { FindUsersQueryDto } from 'backend-services/users/dto/find-users-query.dto.ts';
import { useList } from '@/hooks/use-list';
import { useAntdTable, useRequest } from 'ahooks';
import { getUserList, deleteUser } from '@/api/users';
import { User } from 'backend-services/common/prisma.type.ts';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export const Route = createFileRoute('/_main/users/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FindUsersQueryDto>();

  const { tableProps, search, refreshCurrentList, resetList } = useList(
    useAntdTable(getUserList, {
      form,
      onError(e) {
        message.error(e.message);
      },
    }),
  );
  const { submit, reset } = search;

  const { run: removeRun } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      refreshCurrentList();
    },
    onError: (e) => message.error(e.message),
  });

  const columns: TableProps<User>['columns'] = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (d) => d?.avatarUrl && <Image src={d.avatarUrl} width={48} />,
    },

    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',

      render: (d) => dayjs(d).format('YYYY-MM-DD HH:mm:ss'),
    },

    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            className="p-0!"
            type="link"
            onClick={() => {
              setData(record);
              setOpenDialog(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除此问题吗？"
            onConfirm={() => removeRun(record.id)}
          >
            <Button className="p-0!" type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [data, setData] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div>
      <div className="flex mb-4">
        <Form className="flex-1" layout="inline" form={form}>
          <Form.Item<FindUsersQueryDto> name="nickname">
            <Input className="w-40!" placeholder="请输入筛选的昵称"></Input>
          </Form.Item>
          <Form.Item<FindUsersQueryDto> name="phone">
            <Input className="w-40!" placeholder="请输入筛选的手机号"></Input>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={submit}>
                搜索
              </Button>
              <Button onClick={reset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setData(null);
              setOpenDialog(true);
            }}
          >
            新建用户
          </Button>
        </Space>
      </div>

      <Table rowKey={'id'} {...tableProps} columns={columns}></Table>

      <EditQuestionDialog
        data={data}
        open={openDialog}
        setOpen={setOpenDialog}
        refreshCurrentList={refreshCurrentList}
        resetList={resetList}
      ></EditQuestionDialog>
    </div>
  );
}
