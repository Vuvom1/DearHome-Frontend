import { Form, Input, Button, Card, Typography, Row, Col, Image, Flex, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, MailOutlined, KeyOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../store/actions/AuthAction';
import { App } from 'antd';
import apiInstance from '../../api/ApiInstance';
import { authApiRequest } from '../../api/ApiRequests';
import { useState } from 'react';
const { Title } = Typography;

const Signup = ({ onSuccess }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    

    const onFinish = async (values) => {
        setIsSubmitting(true);
        try {
            const result = await dispatch(registerUser(values)).unwrap();
            message.success('Signup successful!');
            console.log(result);    
            onSuccess();
        } catch (error) {
            message.error(error.message || 'Signup failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendVerificationCode = async (email) => {
        if (!email) {
            message.error('Please enter your email first');
            return;
        }
        
        setIsSendingCode(true);
        try {
            await authApiRequest.sendVerificationCode(email);
            message.success('Verification code sent successfully!');
        } catch (error) {
            message.error(error.message || 'Failed to send verification code. Please try again.');
            console.log(error);
        } finally {
            setIsSendingCode(false);
        }
    };

    return (
        <Form
            name="signup"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            form={form}
        >
            <Form.Item  
                name="name"
                rules={[{ required: true, message: 'Please input your Name!' }]}
            >
                <Input
                    prefix={<UserOutlined />}
                    placeholder="Name"
                    size="large"
                />
            </Form.Item>
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
                name="phoneNumber"
                rules={[{ required: true, message: 'Please input your Phone Number!' }]}
            >
                <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Phone Number"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                name="userName"
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
                    <Button 
                        onClick={()=>handleSendVerificationCode(form.getFieldValue('email'))} 
                        size="large"
                        loading={isSendingCode}
                        disabled={isSendingCode}
                    >
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
                <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting} disabled={isSubmitting}>
                    Sign Up
                </Button>
            </Form.Item>

            <Flex vertical justify='center' align='center' gap={10}>
                <Typography.Text style={{ textAlign: 'center' }}>
                    or Sign up with
                </Typography.Text>
                <Button variant='outlined' htmlType="submit" block size="large" disabled={isSubmitting}>
                    <GoogleOutlined /> Google
                </Button>
            </Flex>
        </Form>
    );
};

export default Signup;
