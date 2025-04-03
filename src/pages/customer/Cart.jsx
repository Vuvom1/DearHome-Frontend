import { useState } from 'react';
import { Typography, Row, Col, Button, Card, InputNumber, Empty, Flex } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

const Cart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Modern Sofa',
            price: 799.99,
            quantity: 1,
            image: 'https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg'
        }
    ]);

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
            <Typography.Title level={2}>Shopping Cart</Typography.Title>
            
            <Row gutter={[32, 32]}>
                <Col xs={24} lg={16}>
                    {cartItems.map(item => (
                        <Card key={item.id} style={{ marginBottom: 16 }}>
                            <Flex gap={16} align="center">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                                />
                                <Flex vertical flex={1} gap={8}>
                                    <Typography.Title level={5}>{item.name}</Typography.Title>
                                    <Typography.Text strong>${item.price}</Typography.Text>
                                    <Flex gap={16} align="center">
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            onChange={(value) => handleQuantityChange(item.id, value)}
                                            addonBefore={<MinusOutlined />}
                                            addonAfter={<PlusOutlined />}
                                        />
                                        <Button 
                                            type="text" 
                                            danger 
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Card>
                    ))}
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Order Summary">
                        <Flex vertical gap={16}>
                            <Flex justify="space-between">
                                <Typography.Text>Subtotal</Typography.Text>
                                <Typography.Text strong>${calculateTotal().toFixed(2)}</Typography.Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Typography.Text>Shipping</Typography.Text>
                                <Typography.Text strong>Free</Typography.Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Typography.Text>Total</Typography.Text>
                                <Typography.Text strong>${calculateTotal().toFixed(2)}</Typography.Text>
                            </Flex>
                            <Button type="primary" block size="large">
                                Proceed to Checkout
                            </Button>
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </Flex>
    );
};

export default Cart;
