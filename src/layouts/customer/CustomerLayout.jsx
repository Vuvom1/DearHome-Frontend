import { Layout, Menu, Button, Flex, Image, Typography, Grid } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import CustomerMenu from './CustomerMenu';
const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const CustomerLayout = ({ children }) => {
    const navigate = useNavigate();
    const screens = useBreakpoint();

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
                    justify='space-between' 
                    align='center' 
                    style={{ 
                        padding: screens.md ? '0' : '10px 0',
                        gap: screens.md ? 0 : '10px'
                    }}
                >
                    <Flex 
                        vertical={!screens.md}
                        gap={screens.md ? 10 : 5} 
                        align='center'
                        style={{ width: screens.md ? 'auto' : '100%' }}
                    >
                        <Flex 
                            justify='space-between' 
                            align='center' 
                            gap={10}
                            style={{ width: screens.md ? 'auto' : '100%' }}
                        >
                            <Flex align='center' gap={10}>
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
                                <Button 
                                    type="primary" 
                                    onClick={() => navigate('/auth')}
                                    style={{ width: '100px' }}
                                >
                                    Login
                                </Button>
                            )}
                        </Flex>

                        <CustomerMenu />
                    </Flex>
                    {screens.md && (
                        <Button 
                            type="primary" 
                            onClick={() => navigate('/auth')}
                            style={{ width: 'auto' }}
                        >
                            Login
                        </Button>
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
                Dear Home ©{new Date().getFullYear()} Created with ❤️
            </Footer>
        </Layout>
    );
};

export default CustomerLayout;
