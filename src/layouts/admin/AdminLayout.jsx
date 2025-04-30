import { useState } from 'react';
import { Layout, Menu, Avatar, Space, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import AdminMenu from './AdminMenu';
import { useSelector } from 'react-redux';
import { URLS } from '../../constants/urls';


const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const avatar = user.certthumbprint ? user.certthumbprint : "https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png";

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
            width: `calc(100% - ${collapsed ? 70 : 190}px)`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
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
          </div>
            <Space style={{ marginRight: 20 }} onClick={() => navigate(URLS.ADMIN.PROFILE)}>
              <Avatar 
                size={32}
                src={avatar}
                style={{ backgroundColor: avatar ? 'transparent' : '#1890ff' }}
              />
              <Text strong>{user.unique_name}</Text>
            </Space>
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
