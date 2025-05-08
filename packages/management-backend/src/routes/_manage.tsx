import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Layout, Menu, Button, MenuProps } from 'antd';
import {
  BookOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useUserStore } from '@/stores/user';
import { useMemo } from 'react';

const { Header, Content, Sider } = Layout;

export const Route = createFileRoute('/_manage')({
  component: ManageLayout,
  beforeLoad: async ({ location }) => {
    const isAuthenticated = !!useUserStore.getState().user?.access_token;
    if (!isAuthenticated) {
      return {
        redirect: {
          to: '/login',
          search: {
            redirect: location.href,
          },
        },
      };
    }
    return {};
  },
});

function ManageLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    navigate({ to: '/login' });
  };

  const items: MenuProps['items'] = useMemo(() => {
    return [
      {
        key: 'courses-manage',
        icon: <BookOutlined />,
        label: '课程管理',
        children: [
          {
            label: '课程管理',
            key: 'courses',
          },
          {
            label: '小节管理',
            key: 'sections',
          },
          {
            label: '问题管理',
            key: 'questions',
          },
          {
            label: '问题类型管理',
            key: 'question-types',
          },
        ],
      },
      {
        label: '系统管理',
        key: 'system-manage',
        icon: <SettingOutlined />,
        children: [
          {
            label: '用户管理',
            key: 'user-manage',
          },
        ],
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

  console.log(openKeys, selectedKeys);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="h-8 m-4 bg-gray-700 text-white flex items-center justify-center">
          Logo
        </div>
        <Menu
          theme="dark"
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
      <Layout>
        <Header className="bg-white p-0 flex justify-end items-center pr-6">
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div className="p-6 bg-white min-h-[calc(100vh-130px)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
