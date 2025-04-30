import { useNavigate } from 'react-router-dom';
import Login from './Login';
import { Typography, Row, Col, Image, Flex, Tabs } from 'antd';
import logo from '../../assets/images/logo.png';
import Signup from './Signup';
import { useState } from 'react';
const { Title } = Typography;

const Auth = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');

    const onFinish = (values) => {
        console.log('Received values:', values);
        // Add your login logic here
    };

    return (
        <Row
            style={{
                minHeight: '100vh',
                padding: '20px',
                alignItems: 'center',
            }}
        >
            <Col xs={0} md={0} lg={12} xl={12} xxl={12}>
                <div style={{ position: 'relative' }}>
                    <Image
                        width={350}
                        height={350}
                        preview={false}
                        src="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Backgrounds%2FtempImagemoS0cL%201.png?alt=media&token=52c0c12b-6317-46bb-9c3a-1fa34c607321"
                    />
                    <Image
                        width={400}
                        height={400}
                        preview={false}
                        src="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Backgrounds%2FtempImagerHIP4d%201.png?alt=media&token=3fbe0e6c-4d4f-4780-95cb-4b09d930cee2"
                        style={{
                            position: 'absolute',
                            right: -160,
                            top: -50
                        }}
                    />
                </div>
            </Col>
            <Col xs={24} md={24} lg={12} xl={12} xxl={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Flex vertical style={{ maxWidth: '400px', width: '100%' }}>
                    <Flex justify='center' align='center' gap={10}>
                        <Image
                            preview={false}
                            src={logo} width={60} height={60} />
                        <Typography.Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            Dear Home
                        </Typography.Text>
                    </Flex>

                    <Typography.Text style={{ fontSize: '16px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>
                        Hack your home with ease
                    </Typography.Text>
                    <Tabs
                        items={[
                            {
                                label: 'LOGIN',
                                key: 'login',
                                children: <Login />
                            },
                            {
                                label: 'SIGNUP',
                                key: 'signup',
                                children: <Signup onSuccess={() => setActiveTab('login')} />
                            }
                        ]}
                        defaultActiveKey="login"
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                    />
                </Flex>
            </Col>
        </Row>
    );
};

export default Auth;
