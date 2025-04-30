import { Form, Input, Button, Card, Typography, Row, Col, Image, Flex, Checkbox, App } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';
import apiInstance from '../../api/ApiInstance.jsx';
import { authApiRequest } from '../../api/ApiRequests.jsx';
import { useDispatch } from 'react-redux';
import { loginUser, googleLogin } from '../../store/actions/AuthAction';
import { URLS } from '../../constants/urls';
import { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const result = await dispatch(loginUser(values)).unwrap();
            message.success('Login successful!');
            // Decode the JWT token to get user information including role
            const token = result;
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userRole = decodedToken.role; 
            
            // Navigate based on user role
            if (userRole === "Admin") {
                navigate(URLS.ADMIN.DASHBOARD);
            } else {
                navigate(URLS.CUSTOMER.HOME);
            }
        } catch (error) {
            message.error(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            const result = await dispatch(googleLogin(credentialResponse.access_token)).unwrap();
            message.success('Google login successful!');
            const token = result;
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userRole = decodedToken.role; 

            if (userRole === "Admin") {
                navigate(URLS.ADMIN.DASHBOARD);
            } else {
                navigate(URLS.CUSTOMER.HOME);
            }
        },
        onError: (error) => {
            console.log(error);
            message.error(error.message || 'Google login failed. Please try again.');
        }
    });


    return (
        <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder="Username"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    size="large"
                />
            </Form.Item>

            <Flex justify='space-between' align='center' style={{ marginBottom: '20px' }}>
                <Checkbox>Remember me</Checkbox>
                <Link onClick={() => navigate('/auth/signup')}>
                    Forgot your password?
                </Link>
            </Flex>

            <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                    Log in
                </Button>
            </Form.Item>

            <Flex vertical justify='center' align='center' gap={10}>
                <Typography.Text style={{ textAlign: 'center' }}>
                    or Login with
                </Typography.Text>
                <Button onClick={handleGoogleLogin} variant='outlined' block size="large" disabled={loading}>
                    <GoogleOutlined/> Google
                </Button>
                
            </Flex>
        </Form>
    );
};

export default Login;
