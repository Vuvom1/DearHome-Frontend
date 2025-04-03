import { Form, Input, Button, Card, Typography, Row, Col, Image, Flex, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Received values:', values);
        // Add your login logic here
    };

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
                <Button type="primary" htmlType="submit" block size="large">
                    Log in
                </Button>
            </Form.Item>

            <Flex vertical justify='center' align='center' gap={10}>
                <Typography.Text style={{ textAlign: 'center' }}>
                    or Login with
                </Typography.Text>
                <Button variant='outlined' htmlType="submit" block size="large">
                    <GoogleOutlined /> Google
                </Button>
            </Flex>
        </Form>

    );
};

export default Login;
