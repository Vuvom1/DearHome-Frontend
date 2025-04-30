import { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, InputNumber, Empty, Flex, Image, Table, Form, Input, Breadcrumb } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { URLS } from '../../constants/urls';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../store/actions/CartAction';
import { remove } from 'three/examples/jsm/libs/tween.module.js';
import { useNavigate } from 'react-router-dom';
const { TextArea } = Input;

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector(state => state.cart.items);
    
    const formatPrice = (price) => {
        return (price).toLocaleString('vi-VN');
    };

    const navigateCheckout = () => {
        if (cartItems.length) {
            navigate(URLS.CUSTOMER.CHECKOUT);
        }
    }
    
    const renderVariantAttributes = (item) => {
        if (!item.item.variantAttributes?.$values?.length) return null;
        
        return (
            <Flex gap={8} wrap="wrap">
                {item.item.variantAttributes.$values.map((attr, index, array) => {
                    const value = attr.attributeValue.value;
                    const isLastItem = index === array.length - 1;
                    
                    // If it's a color attribute, display color swatch
                    if (value.startsWith('#')) {
                        return (
                            <Flex key={attr.id} align="center" gap={4}>
                                <div 
                                    style={{ 
                                        width: 20, 
                                        height: 20, 
                                        backgroundColor: value, 
                                        borderRadius: '50%',
                                        border: '1px solid #ddd'
                                    }} 
                                />
                                {!isLastItem && <Typography.Text>,</Typography.Text>}
                            </Flex>
                        );
                    }
                    
                    return (
                        <Flex key={attr.id} align="center" gap={4}>
                            <Typography.Text>{value}</Typography.Text>
                            {!isLastItem && <Typography.Text>,</Typography.Text>}
                        </Flex>
                    );
                })}
            </Flex>
        );
    };
        
    const columns = [
        {
            title: 'Product',
            dataIndex: ['item', 'product', 'name'],
            key: 'product.name',
            render: (text, record) => {
                const imageUrl = record.item.imageUrls?.$values?.[0] || record.item.product.imageUrl;
                return (
                    <Flex gap={16} align="start" wrap="wrap">
                        <Image src={imageUrl} width={100} height={100} style={{objectFit: 'cover'}} />
                        <Flex vertical justify="start" gap={8} style={{flex: 1, minWidth: 200}}>
                            <Typography.Text style={{fontSize: 16, fontWeight: 500}}>{text?.toUpperCase()}</Typography.Text>
                            <Typography.Text type="secondary">{record.item.product.description}</Typography.Text>
                            {renderVariantAttributes(record)}
                            <Typography.Text type="secondary">SKU: {record.item.sku}</Typography.Text>
                        </Flex>
                    </Flex>
                );
            },
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
        {
            title: 'Price',
            dataIndex: ['item', 'price'],
            key: 'price',
            render: (text, record) => {
                const price = record.item.product.price + record.item.priceAdjustment;
                return <Typography.Text strong>{formatPrice(price)}₫</Typography.Text>;
            },
            responsive: ['sm', 'md', 'lg', 'xl']
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <Flex gap={2} align="center">
                    <Button 
                        icon={<MinusOutlined />} 
                        onClick={() => handleQuantityChange(record.item, Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                    />
                    <InputNumber 
                        value={quantity}
                        min={1}
                        max={record.item.stock}
                        style={{width: 60}}
                        onChange={(value) => handleQuantityChange(record.item.id, value)}
                    />
                    <Button 
                        icon={<PlusOutlined />} 
                        onClick={() => handleQuantityChange(record.item.id, quantity + 1)}
                        disabled={quantity >= record.item.stock}
                    />
                </Flex>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (text, record) => {
                const unitPrice = record.item.product.price + record.item.priceAdjustment;
                const total = unitPrice * record.quantity;
                return <Typography.Text strong>{formatPrice(total)}₫</Typography.Text>;
            },
            responsive: ['sm', 'md', 'lg', 'xl']
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    danger
                    icon={<DeleteOutlined />} 
                    onClick={() => handleRemoveItem(record.item.id)}
                />
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        }
    ];

    const handleQuantityChange = (item, value) => {
        if (value && value > 0) {
            dispatch(updateQuantity({ item, quantity: value }));
        }
    };

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const unitPrice = item.item.product.price + item.item.priceAdjustment;
            return total + (unitPrice * item.quantity);
        }, 0);
    };
    
    const calculateTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <Flex vertical align="center" justify="center" style={{ minHeight: '60vh' }}>
                <Empty description="Your cart is empty" />
                <Button type="primary" style={{ marginTop: 16 }} href={URLS.CUSTOMER.HOME}>
                    Continue Shopping
                </Button>
            </Flex>
        );
    }

    return (
        <Flex vertical gap={32}>
            <Breadcrumb>
                <Breadcrumb.Item href={URLS.CUSTOMER.HOME}>Home</Breadcrumb.Item>
                <Breadcrumb.Item href={URLS.CUSTOMER.CART}>Cart</Breadcrumb.Item>
            </Breadcrumb>
            <Typography.Title style={{ textAlign: 'center' }} level={2}>CART</Typography.Title>
            
            <Row gutter={[32, 32]}>
                <Col xs={24} lg={24}>
                    <Table 
                        dataSource={cartItems}
                        pagination={false}
                        columns={columns}
                        scroll={{ x: 'max-content' }}
                        style={{ overflowX: 'auto' }}
                        rowKey={record => record.item.id}
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
                                <Typography.Text strong>{calculateTotalQuantity()} items</Typography.Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Typography.Text>Total</Typography.Text>
                                <Typography.Text strong>{formatPrice(calculateTotal())} ₫</Typography.Text>
                            </Flex>
                        </Flex>
                        <Button disabled={cartItems.length <= 0} onClick={navigateCheckout} type="primary" block size="large">
                            Proceed to Checkout
                        </Button>
                    </Flex>
                </Col>
            </Row>
        </Flex>
    );
};

export default Cart;
