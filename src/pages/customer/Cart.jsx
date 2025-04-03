import { useState } from 'react';
import { Typography, Row, Col, Button, Card, InputNumber, Empty, Flex, Image, Table, Form, Input } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ButtonGroup from 'antd/es/button/button-group';

const { TextArea } = Input;

const Cart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Modern Sofa',
            price: 799.99,
            quantity: 1,
            description: 'This is a description',
            image: 'https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg'
        },
        {
            id: 1,
            name: 'Modern Sofa',
            price: 799.99,
            quantity: 1,
            description: 'This is a description',
            image: 'https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg'
        }
    ]);

    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Flex gap={16} align="start" wrap="wrap">
                    <Image src={record.image} width={100} height={100} style={{objectFit: 'cover'}} />
                    <Flex vertical justify="start" gap={8} style={{flex: 1, minWidth: 200}}>
                        <Typography.Text style={{fontSize: 16, fontWeight: 500}}>{text.toUpperCase()}</Typography.Text>
                        <Typography.Text type="secondary">{record.description}</Typography.Text>
                    </Flex>
                </Flex>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => (
                <Typography.Text strong>{(record.price * 24000).toLocaleString('vi-VN')}₫</Typography.Text>
            ),
            responsive: ['sm', 'md', 'lg', 'xl']
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <Flex gap={2} align="center">
                    <Button icon={<MinusOutlined />} />
                    <InputNumber 
                        value={record.quantity}
                        min={1}
                        style={{width: 60}}
                    />
                    <Button icon={<PlusOutlined />} />
                </Flex>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (text, record) => (
                <Typography.Text strong>{(record.price * record.quantity * 24000).toLocaleString('vi-VN')}₫</Typography.Text>
            ),
            responsive: ['sm', 'md', 'lg', 'xl']
        }
    ];

    const handleQuantityChange = (id, value) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: value } : item
            )
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    if (cartItems.length === 0) {
        return (
            <Flex vertical align="center" justify="center" style={{ minHeight: '60vh' }}>
                <Empty description="Your cart is empty" />
                <Button type="primary" style={{ marginTop: 16 }}>
                    Continue Shopping
                </Button>
            </Flex>
        );
    }

    return (
        <Flex vertical gap={32}>
            <Typography.Title style={{ textAlign: 'center' }} level={2}>CART</Typography.Title>
            
            <Row gutter={[32, 32]}>
                <Col xs={24} lg={24}>
                    <Table 
                        dataSource={cartItems}
                        pagination={false}
                        columns={columns}
                        scroll={{ x: 'max-content' }}
                        style={{ overflowX: 'auto' }}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <Form.Item layout='vertical' label="Order Note">
                        <TextArea rows={4} placeholder='Enter your order note' />
                    </Form.Item>
                </Col>
                    
                <Col xs={24} lg={12}>
                    <Flex vertical gap={16} style={{ height: '100%', justifyContent: 'space-between' }}>
                        <Flex vertical gap={16}>
                            <Flex justify="space-between">
                                <Typography.Text>Total Quantity</Typography.Text>
                                <Typography.Text strong>{calculateTotal().toLocaleString('vi-VN')} ₫</Typography.Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Typography.Text>Total</Typography.Text>
                                <Typography.Text strong>{calculateTotal().toLocaleString('vi-VN')} ₫</Typography.Text>
                            </Flex>
                        </Flex>
                        <Button type="primary" block size="large">
                            Proceed to Checkout
                        </Button>
                    </Flex>
                </Col>
            </Row>
        </Flex>
    );
};

export default Cart;
