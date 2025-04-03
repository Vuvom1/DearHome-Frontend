import { useState } from 'react';
import { Typography, Row, Col, Button, Form, Input, Card, Flex, Avatar, Breadcrumb, Tabs } from 'antd';
import { URLS } from '../../constants/urls';
import { PlusOutlined, LockOutlined } from '@ant-design/icons';
const CustomerProfile = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Form values:', values);
    };

    const items = [
        {
            key: '1',
            label: 'Profile Information',
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: 'John Doe',
                        email: 'john.doe@example.com',
                        phone: '+1234567890',
                        address: '123 Main St, City, Country'
                    }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24}>
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please enter your name' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please enter your phone number' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[{ required: true, message: 'Please enter your address' }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Button type="primary" htmlType="submit">
                                Save Changes
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )
        },
        {
            key: '2',
            label: 'Order History',
            children: (
                <Flex vertical gap={16}>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Typography.Text strong>Order #12345</Typography.Text>
                                <Typography.Paragraph type="secondary">Placed on: 01/01/2024</Typography.Paragraph>
                            </div>
                            <Typography.Text strong>$799.99</Typography.Text>
                        </Flex>
                        <Typography.Text type="success">Status: Delivered</Typography.Text>
                    </Card>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <div>
                                <Typography.Text strong>Order #12346</Typography.Text>
                                <Typography.Paragraph type="secondary">Placed on: 02/01/2024</Typography.Paragraph>
                            </div>
                            <Typography.Text strong>$299.99</Typography.Text>
                        </Flex>
                        <Typography.Text type="warning">Status: In Transit</Typography.Text>
                    </Card>
                </Flex>
            )
        },
        {
            key: '3',
            label: 'Payment Methods',
            children: (
                <Flex vertical gap={16}>
                    <Card>
                        <Flex justify="space-between" align="center">
                            <Typography.Text strong>Credit Card</Typography.Text>
                            <Typography.Text type="secondary">**** **** **** **** 1234</Typography.Text>
                        </Flex>
                    </Card>

                    <Button type='dashed'><PlusOutlined /> Add New Card</Button>
                </Flex>
            )
        },
        {
            key: '4',
            label: 'Security',
            children: (
                <Flex vertical gap={16}>
                    <Typography.Title level={3}>Change Password</Typography.Title>
                    <Form layout='vertical' onFinish={onFinish}>
                        <Form.Item name='password' label='Current Password'>
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item name='newPassword' label='New Password'>
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item name='confirmPassword' label='Confirm Password'>
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' htmlType='submit'>Change Password</Button>
                        </Form.Item>
                    </Form>
                </Flex>
            )
        }
    ];

    return (
        <Flex vertical gap={32}>
            <Breadcrumb>
                <Breadcrumb.Item href={URLS.CUSTOMER.HOME}>Home</Breadcrumb.Item>
                <Breadcrumb.Item href={URLS.CUSTOMER.PROFILE}>Profile</Breadcrumb.Item>
            </Breadcrumb>

            <Flex vertical align="center" gap={16}>
                <Avatar size={100} src="https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg" />
                <Typography.Title level={2}>John Doe</Typography.Title>
                <Typography.Text type="secondary">Member since January 2024</Typography.Text>
            </Flex>

            <Card>
                <Tabs defaultActiveKey="1" items={items} />
            </Card>
        </Flex>
    );
};

export default CustomerProfile;
