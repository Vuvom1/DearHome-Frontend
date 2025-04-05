import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ShoppingOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import AdminMenu from './AdminMenu';
const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider 
        style={{
          background: '#fff',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        trigger={null} 
        collapsible 
        collapsed={collapsed}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <AdminMenu />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 70 : 190 }}>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            position: 'fixed',
            zIndex: 1,
            width: '100%',
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined
              className="trigger"
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '18px', padding: '0 24px', cursor: 'pointer' }}
            />
          ) : (
            <MenuFoldOutlined
              className="trigger"
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '18px', padding: '0 24px', cursor: 'pointer' }}
            />
          )}
        </Header>
        <Content
          style={{
            margin: '80px 12px 24px',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
