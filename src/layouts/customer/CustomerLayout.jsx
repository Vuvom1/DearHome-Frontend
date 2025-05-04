import { Layout, Menu, Button, Flex, Image, Typography, Grid, Avatar } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import CustomerMenu from './CustomerMenu';
const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;
import { useSelector } from 'react-redux';
import { URLS } from '../../constants/urls';

const CustomerLayout = ({ children }) => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const user = useSelector(state => state.auth.user);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header 
                style={{ 
                    background: '#fff', 
                    padding: screens.md ? '10px 50px' : '10px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    height: 'auto',
                    lineHeight: '1.5'
                }}
            >
                <Flex 
                    vertical={!screens.md}
                    justify="space-between" 
                    align="center" 
                    style={{ 
                        padding: screens.md ? 0 : '10px 0',
                        gap: screens.md ? 0 : '10px'
                    }}
                >
                    {/* Left: Logo, Title, Mobile User/Login, Menu */}
                    <Flex 
                        vertical={!screens.md}
                        gap={screens.md ? 10 : 5} 
                        align="center"
                        style={{ width: screens.md ? 'auto' : '100%' }}
                    >
                        <Flex 
                            justify="space-between" 
                            align="center" 
                            gap={10}
                            style={{ width: screens.md ? 'auto' : '100%' }}
                        >
                            <Flex align="center" gap={10}>
                                <Image
                                    preview={false}
                                    src={logo}
                                    width={screens.md ? 40 : 30}
                                    height={screens.md ? 40 : 30}
                                    style={{ 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => navigate('/')}
                                />
                                <Typography.Title level={screens.md ? 4 : 5} style={{ margin: 0 }}>
                                    Dear Home
                                </Typography.Title>
                            </Flex>
                            {!screens.md && (
                                user ? (
                                    <Flex align="center" gap={10}>
                                        <Button 
                                            type="text" 
                                            icon={<ShoppingCartOutlined />} 
                                            onClick={() => navigate(URLS.CUSTOMER.CART)} 
                                        />
                                        <Flex 
                                            align="center" 
                                            gap={10} 
                                            onClick={() => navigate(URLS.CUSTOMER.PROFILE)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Avatar src={user.imageUrl} />
                                            <Typography.Text>{user.unique_name}</Typography.Text>
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <Button 
                                        variant="outlined"
                                        onClick={() => navigate(URLS.AUTH.LOGIN)}
                                        style={{ width: '100px' }}
                                    >
                                        Login
                                    </Button>
                                )
                            )}
                        </Flex>

                        <CustomerMenu />
                    </Flex>

                    {/* Right: Desktop Login or User + Cart */}
                    {screens.md && (
                        !user ? (
                            <Button 
                                type="primary" 
                                onClick={() => navigate(URLS.AUTH.LOGIN)}
                                style={{ width: 'auto' }}
                            >
                                Login
                            </Button>
                        ) : (
                            <Flex align="center" gap={10}>
                                <Button 
                                    type="text" 
                                    icon={<ShoppingCartOutlined />} 
                                    onClick={() => navigate(URLS.CUSTOMER.CART)} 
                                />
                                <Flex 
                                    align="center" 
                                    gap={10} 
                                    onClick={() => navigate(URLS.CUSTOMER.PROFILE)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Avatar src={user.certthumbprint} />
                                    <Typography.Text>{user.unique_name}</Typography.Text>
                                </Flex>
                            </Flex>
                        )
                    )}
                </Flex>
            </Header>

            <Content style={{ 
                padding: screens.md ? '20px' : '10px', 
                background: '#fff' 
            }}>
                <Outlet />
            </Content>

            <Footer style={{ 
                textAlign: 'center', 
                background: '#f0f0f0',
                padding: screens.md ? '24px 50px' : '12px 20px'
            }}>
                Dear Home ©{new Date().getFullYear()} Created with by Dear Home
            </Footer>
        </Layout>
    );
};

export default CustomerLayout;
