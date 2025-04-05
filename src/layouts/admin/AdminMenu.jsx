import { DashboardOutlined, ShoppingOutlined, ShoppingCartOutlined, UserOutlined, StockOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'antd';




const AdminMenu = () => {
    const navigate = useNavigate();
    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/admin/dashboard'),
        },
        {
            key: 'products',
            icon: <ShoppingOutlined />,
            label: 'Products',
            onClick: () => navigate('/admin/products'),
        },
        {
            key: 'inventory',
            icon: <StockOutlined />,    
            label: 'Inventory',
            onClick: () => navigate('/admin/inventory'),
        },
        {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: 'Orders',
            onClick: () => navigate('/admin/orders'),
        },
        {
            key: 'application',
            icon: <AppstoreOutlined />,
            label: 'Application',
            children: [
                {
                    key: 'applications-categories',
                    label: 'Categories & Placement',
                    onClick: () => navigate('/admin/application/categories'),
                },
                {
                    key: 'applications-attributes',
                    label: 'Product Attributes',
                    onClick: () => navigate('/admin/application/attributes'),
                },
                {
                    key: 'applications-banners',
                    label: 'Banner Settings',
                    onClick: () => navigate('/admin/application/banners'),
                }
            ]
        },
        {
            key: 'customers',
            icon: <UserOutlined />,
            label: 'Customers',
            onClick: () => navigate('/admin/customers'),
        },
        {
            key: 'promotions',
            icon: <UserOutlined />,
            label: 'Promotions',
            onClick: () => navigate('/admin/promotions'),
        },

    ];


    return (
        <Menu mode="inline">
            {menuItems.map(item => {
                if (item.children) {
                    return (
                        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                            {item.children.map(child => (
                                <Menu.Item key={child.key} onClick={child.onClick}>
                                    {child.label}
                                </Menu.Item>
                            ))}
                        </Menu.SubMenu>
                    );
                }
                return (
                    <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
                        {item.label}
                    </Menu.Item>
                );
            })}
        </Menu>
    );
};

export default AdminMenu;