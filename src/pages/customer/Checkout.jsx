import { useState } from 'react';
import { Typography, Row, Col, Button, Form, Input, Radio, Card, Flex, Divider, Avatar, Select, Space } from 'antd';

const { TextArea } = Input;

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    
    const cartItems = [
        {
            id: 1,
            name: 'Modern Sofa',
            price: 799.99,
            quantity: 1,
            description: 'This is a description',
            image: 'https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg'
        }
    ];

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal();
    };

    const onFinish = (values) => {
        console.log('Form values:', values);
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Flex vertical>
                <Typography.Title style={{ textAlign: 'center' }} level={2}>CHECKOUT</Typography.Title>
                
                <Row gutter={[32, 32]}>
                    <Col xs={24} lg={14}>
                        <Typography.Title level={3}>Shipping Information</Typography.Title>
                            <Row>
                                <Col xs={24} style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16}}>
                                    <Flex gap={8}>
                                        <Avatar 
                                            size={60}
                                        src="https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg" />
                                        <Flex vertical gap={4}>
                                            <Typography.Text strong>John Doe</Typography.Text>
                                            <Typography.Text type="secondary">john.doe@example.com</Typography.Text>
                                        </Flex>
                                        <Button type="link" style={{marginLeft: 'auto'}}>
                                            Sign out
                                        </Button>
                                    </Flex>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        name="name"
                                        label="Full Name"
                                        rules={[{ required: true, message: 'Please enter your full name' }]}
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
                                        <Input rows={4} />
                                    </Form.Item>
                                </Col>
                                <Col xs={7}>
                                    <Form.Item
                                        name="city"
                                        label="City"
                                        rules={[{ required: true, message: 'Please enter your city' }]}
                                    >
                                        <Select>
                                            <Select.Option value="HCM">Ho Chi Minh</Select.Option>
                                            <Select.Option value="HN">Ha Noi</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={7} offset={1}>
                                    <Form.Item
                                        name="district"
                                        label="District"
                                        rules={[{ required: true, message: 'Please enter your district' }]}
                                    >
                                        <Select>
                                            <Select.Option value="HCM">Ho Chi Minh</Select.Option>
                                            <Select.Option value="HN">Ha Noi</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={8} offset={1}>
                                    <Form.Item
                                        name="ward"
                                        label="Ward"
                                        rules={[{ required: true, message: 'Please enter your ward' }]}
                                    >
                                        <Select>
                                            <Select.Option value="HCM">Ho Chi Minh</Select.Option>
                                            <Select.Option value="HN">Ha Noi</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                        <Divider />

                        <Card title="Shipping Method">
                            <Form.Item name="shippingMethod">
                                <Radio.Group
                                    onChange={(e) => setShippingMethod(e.target.value)}
                                    value={shippingMethod}
                                    style={{ width: '100%' }}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Card>
                                            <Radio value="standard">Standard Shipping</Radio>
                                        </Card>
                                        <Card>
                                            <Radio value="express">Express Shipping</Radio>
                                        </Card>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                     

                        <Card title="Payment Method" style={{ marginTop: 24 }}>
                            <Form.Item name="paymentMethod">
                                <Radio.Group 
                                    onChange={(e) => setPaymentMethod(e.target.value)} 
                                    value={paymentMethod}
                                    style={{ width: '100%' }}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Card onClick={() => setPaymentMethod('cod')}>
                                            <Radio value="cod">Cash on Delivery</Radio>
                                        </Card>
                                        <Card onClick={() => setPaymentMethod('bank')}>
                                            <Radio value="bank">Bank Transfer</Radio>
                                        </Card>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} lg={10}>
                        <Card title="Order Summary">
                            <Flex vertical gap={16}>
                                {cartItems.map(item => (
                                    <Flex key={item.id} justify="space-between">
                                        <Flex gap={8} align="center">
                                            <Avatar src={item.image} size={60} shape="square" />
                                            <Flex vertical gap={4}>
                                                <Typography.Text>{item.name}</Typography.Text>
                                                <Typography.Text type="secondary">Quantity: {item.quantity}</Typography.Text>
                                            </Flex>
                                        </Flex>
                                        <Typography.Text strong>
                                            {(item.price * item.quantity * 24000).toLocaleString('vi-VN')}₫
                                        </Typography.Text>
                                    </Flex>
                                ))}
                                
                                <Divider />
                                <Flex gap={8} justify="space-between">
                                    <Input placeholder="Enter coupon code" />
                                    <Button type="primary">Apply</Button>
                                </Flex>

                                <Divider />
                                
                                <Flex justify="space-between">
                                    <Typography.Text>Subtotal</Typography.Text>
                                    <Typography.Text strong>
                                        {(calculateSubtotal() * 24000).toLocaleString('vi-VN')}₫
                                    </Typography.Text>
                                </Flex>
                                <Flex justify='space-between'>
                                    <Typography.Text>Discount</Typography.Text>
                                    <Typography.Text strong>
                                        {(calculateSubtotal() * 24000).toLocaleString('vi-VN')}₫
                                    </Typography.Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Typography.Text>Shipping</Typography.Text>
                                    <Typography.Text strong>
                                        {(calculateSubtotal() * 24000).toLocaleString('vi-VN')}₫
                                    </Typography.Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Typography.Text>Total</Typography.Text>
                                    <Typography.Text strong style={{ fontSize: 18 }}>
                                        {(calculateTotal() * 24000).toLocaleString('vi-VN')}₫
                                    </Typography.Text>
                                </Flex>

                                <Button type="primary" htmlType="submit" block size="large">
                                    Place Order
                                </Button>
                            </Flex>
                        </Card>
                    </Col>
                </Row>
            </Flex>
        </Form>
    );
};

export default Checkout;
