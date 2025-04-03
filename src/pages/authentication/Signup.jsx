import { Form, Input, Button, Card, Typography, Row, Col, Image, Flex, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';

const { Title } = Typography;

const Signup = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Received values:', values);
        // Add your signup logic here
    };

    return (
        <Form
            name="signup"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Please input your Email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                ]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    size="large"
                />
            </Form.Item>

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
                rules={[
                    { required: true, message: 'Please input your Password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm Password"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                name="verificationCode"
                rules={[{ required: true, message: 'Please input verification code!' }]}
            >
                <Flex gap={10}>
                    <Input
                        prefix={<KeyOutlined />}
                        placeholder="Verification Code"
                        size="large"
                    />
                    <Button size="large">
                        Get Code
                    </Button>
                </Flex>
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    { required: true, message: 'Please accept the terms and conditions' }
                ]}
            >
                <Checkbox>I agree to the Terms and Conditions</Checkbox>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                    Sign Up
                </Button>
            </Form.Item>

            <Flex vertical justify='center' align='center' gap={10}>
                <Typography.Text style={{ textAlign: 'center' }}>
                    or Sign up with
                </Typography.Text>
                <Button variant='outlined' htmlType="submit" block size="large">
                    <GoogleOutlined /> Google
                </Button>
            </Flex>
        </Form>
    );
};

export default Signup;
