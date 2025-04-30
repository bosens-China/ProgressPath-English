import { createFileRoute } from '@tanstack/react-router';
import { Table, Button, Space } from 'antd';
import type { TableProps } from 'antd';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  phone: string;
  nickname?: string;
  registrationDate: string;
}

export const Route = createFileRoute('/_manage/users')({
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with actual API call
  useEffect(() => {
    setLoading(true);
    // Placeholder data
    const mockUsers: User[] = [
      {
        id: 1,
        phone: '13800138000',
        nickname: '张三',
        registrationDate: new Date().toISOString(),
      },
      {
        id: 2,
        phone: '13900139000',
        registrationDate: new Date().toISOString(),
      },
    ];
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const columns: TableProps<User>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    {
      title: '注册时间',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
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
      <h1 className="text-2xl font-semibold mb-4">用户管理</h1>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        bordered
      />
    </div>
  );
}
