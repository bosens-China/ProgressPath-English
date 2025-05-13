import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import {
  Layout,
  Menu,
  MenuProps,
  Space,
  Typography,
  Avatar,
  Dropdown,
} from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import '@unocss/reset/tailwind-compat.css';
import Logo from '@/assets/img/logo.svg?react';
import { useUserStore } from '@/stores/user';
import { Setup } from './-main/setup.dialog';

const { Header, Content, Sider } = Layout;

export const Route = createFileRoute('/_main')({
  component: ManageLayout,
});

function ManageLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  const user = useUserStore((state) => state.user);

  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        label: '仪表盘',
        key: 'dashboard',
      },
      {
        label: '我的课程',
        key: 'my-courses',
      },
      {
        label: '全部课程',
        key: 'all-courses',
      },
    ];
  }, []);

  const [selectedKeys, openKeys] = useMemo(() => {
    const k = pathname.slice(1);
    return [
      [k],
      [
        items.find((f) => {
          if (f && 'children' in f && f.children?.find((c) => c?.key === k)) {
            return true;
          }
          return false;
        })?.key as string,
      ],
    ];
  }, [items, pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="flex items-center justify-between border-b border-#F0F0F0">
        <Link to="/dashboard" className="h-16">
          <Space align="center">
            <Logo className="text-size-4xl"></Logo>
            <Typography.Text className="color-#927AF4 text-size-5 font-600">
              Progresspath English
            </Typography.Text>
          </Space>
        </Link>

        <Dropdown
          menu={{
            items: [
              {
                label: <Setup>设置</Setup>,
                key: 'settings',
              },
              {
                label: '退出登录',
                key: 'logout',
                onClick: handleLogout,
                icon: <LogoutOutlined />,
              },
            ],
          }}
        >
          <Typography.Link>
            <Space>
              <Avatar src={user?.avatarUrl}>
                {user?.nickname?.slice(0, 1)}
              </Avatar>
              <Typography.Text>{user?.nickname}</Typography.Text>
            </Space>
          </Typography.Link>
        </Dropdown>
      </Header>

      <Layout>
        <Sider className="border-r border-[rgba(5,5,5,0.06)]" width={255}>
          <Menu
            theme="light"
            mode="inline"
            defaultOpenKeys={openKeys}
            defaultSelectedKeys={selectedKeys}
            onClick={(e) => {
              navigate({
                to: `/${e.key}`,
              });
            }}
            items={items}
          ></Menu>
        </Sider>
        <Content style={{ margin: '16px' }}>
          <div className="p-6 bg-white min-h-[calc(100vh-130px)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
