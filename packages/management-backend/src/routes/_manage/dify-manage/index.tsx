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
  Tag,
} from 'antd';
import { useList } from '@/hooks/use-list';
import { useAntdTable, useRequest } from 'ahooks';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { deleteDifyManage, getDifyManageList } from '@/api/dify-manage';
import { EditDifyDialog } from './-components/edit-dify-dialog';
import { TestDifyDialog } from './-components/test-dify-dialog';
import { DifyManage } from 'backend-services/common/prisma.type.ts';
import { FindDifyManageQueryDto } from 'backend-services/dify-manage/dto/find-dify-manage-query.dto.js';

export const Route = createFileRoute('/_manage/dify-manage/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { message } = App.useApp();
  const [form] = Form.useForm<FindDifyManageQueryDto>();

  const { tableProps, search, refreshCurrentList, resetList } = useList(
    useAntdTable(getDifyManageList, {
      form,
      onError(e) {
        message.error(e.message);
      },
    }),
  );
  const { submit, reset } = search;

  const { run: removeRun } = useRequest(deleteDifyManage, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      refreshCurrentList();
    },
    onError: (e) => message.error(e.message),
  });

  const columns: TableProps<DifyManage>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'API地址',
      dataIndex: 'apiUrl',
      key: 'apiUrl',
      ellipsis: true,
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      ellipsis: true,
      render: (text) => (
        <Tag color="geekblue">
          {text ? text.slice(0, 10) + '...' : '未设置'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (d) => dayjs(d).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (d) => dayjs(d).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            className="p-0!"
            type="link"
            onClick={() => {
              setEditData(record);
              setOpenEditDialog(true);
            }}
          >
            编辑
          </Button>
          <Button
            className="p-0!"
            type="link"
            onClick={() => {
              setTestData(record);
              setOpenTestDialog(true);
            }}
          >
            测试
          </Button>
          <Popconfirm
            title="确定删除此配置吗？"
            description="删除后将无法恢复"
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

  const [editData, setEditData] = useState<DifyManage | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [testData, setTestData] = useState<DifyManage | null>(null);
  const [openTestDialog, setOpenTestDialog] = useState(false);

  return (
    <div>
      <div className="flex mb-4">
        <Form className="flex-1" layout="inline" form={form}>
          <Form.Item<FindDifyManageQueryDto> name="description">
            <Input className="w-40!" placeholder="请输入筛选的描述"></Input>
          </Form.Item>
          <Form.Item<FindDifyManageQueryDto> name="apiUrl">
            <Input className="w-40!" placeholder="请输入筛选的API地址"></Input>
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
              setEditData(null);
              setOpenEditDialog(true);
            }}
          >
            新建配置
          </Button>
        </Space>
      </div>

      <Table
        rowKey={'id'}
        {...tableProps}
        columns={columns}
        scroll={{ x: 1000 }}
      ></Table>

      <EditDifyDialog
        data={editData}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        refreshCurrentList={refreshCurrentList}
        resetList={resetList}
      />

      <TestDifyDialog
        data={testData}
        open={openTestDialog}
        setOpen={setOpenTestDialog}
      />
    </div>
  );
}
