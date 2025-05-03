import { useState, useEffect, use } from 'react';
import { Typography, Row, Col, Button, Form, Input, Radio, Card, Flex, Divider, Avatar, Select, Space, Breadcrumb, Skeleton, Modal, App, Tag } from 'antd';
import { URLS } from '../../constants/urls';
import { useSelector } from 'react-redux';
import { authApiRequest } from '../../api/ApiRequests';
import { shippingApiRequest } from '../../api/ApiRequests';
import { PaymentMethods } from '../../constants/PaymentMethods';
import { orderApiRequest, promotionApiRequest } from '../../api/ApiRequests';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/actions/CartAction';
import { useNavigate } from 'react-router-dom';
// import { usePayOS, PayOSConfig } from "payos-checkout";
const { TextArea } = Input;

const Checkout = () => {
    const { message } = App.useApp();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = useSelector(state => state.auth.user.nameid);
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [formattedAddress, setFormattedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState();
    const [shippingMethod, setShippingMethod] = useState();
    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectAddressVisible, setSelectAddressVisible] = useState(false);
    const [isCheckout, setIsCheckout] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [promotionModalVisible, setPromotionModalVisible] = useState(false);
    const [addressCache, setAddressCache] = useState({});

    const cartItems = useSelector(state => state.cart.items);

    const formatDisplayAddress = (addressData) => {
        if (!addressData) return 'Please select an address';
        
        if (addressData.city?.name && addressData.district?.name && addressData.ward?.name) {
            return `${addressData.street}, ${addressData.ward.name}, ${addressData.district.name}, ${addressData.city.name}`;
        }
        
        return `${addressData.street}, ${addressData.ward || ''}, ${addressData.district || ''}, ${addressData.city || ''}`;
    };

    const getFormattedAddress = async (addressId) => {
        if (addressCache[addressId]) {
            return addressCache[addressId];
        }
        
        try {
            const response = await shippingApiRequest.getFormattedAddress(addressId);
            const formattedAddr = response.data;
            
            setAddressCache(prev => ({
                ...prev,
                [addressId]: formattedAddr
            }));
            
            return formattedAddr;
        } catch (error) {
            console.error('Error fetching formatted address:', error);
            message.error('Failed to load address details');
            return null;
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response = await authApiRequest.getUser(userId);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const calculateShippingCost = async (address) => {
        const shippingData = {
            addressToId: address.id,
            items: cartItems.map(item => ({
                variantId: item.item.id,
                quantity: item.quantity
            }))
        };

        try {
            const response = await shippingApiRequest.calculateShippingCost(shippingData);
            return response.data.$values;
        } catch (error) {
            console.error('Error calculating shipping cost:', error);
        }
    };

    const handleAddressSelect = async (selectedAddress) => {
        setAddress(selectedAddress);
        setSelectAddressVisible(false);
        
        const formatted = await getFormattedAddress(selectedAddress.id);
        if (formatted) {
            setFormattedAddress(formatted);
        }
    };

    const fetchUsablePromotions = async () => {
        try {
            const response = await promotionApiRequest.getUsablePromotionsByUserId(userId);
            setPromotions(response.data.$values);
        } catch (error) {
            console.error('Error fetching promotions:', error);
            message.error('Failed to load promotions');
        }
    }
    
    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (user && user.addresses && user.addresses.$values.length > 0) {
            const defaultAddress = user.addresses.$values.find(addr => addr.isDefault);
            setAddress(defaultAddress);
            
            if (defaultAddress) {
                getFormattedAddress(defaultAddress.id).then(formattedAddr => {
                    if (formattedAddr) {
                        setFormattedAddress(formattedAddr);
                    }
                });
            }
        }
        fetchUsablePromotions();
    }, [user]);

    useEffect(() => {
        if (address) {
            calculateShippingCost(address).then(response => {
                setShippingMethods(response);
            });
            
            getFormattedAddress(address.id).then(formattedAddr => {
                if (formattedAddr) {
                    setFormattedAddress(formattedAddr);
                }
            });
        }
    }, [address]);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + ((item.item.product.price + item.item.priceAdjustment) * item.quantity), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount();
    };

    const handleApplyPromotion = async () => {
           promotionModalVisible ? setPromotionModalVisible(false) : setPromotionModalVisible(true);
    }

    const handlePromotionSelect = async (promotion) => {
        setSelectedPromotion(promotion);
        setPromotionModalVisible(false);
        message.success(`Promotion ${promotion.name} applied successfully`);
    }

    const calculateDiscount = () => {
        if (selectedPromotion) {
            return (calculateSubtotal() * selectedPromotion.discountPercentage) / 100;
        }
        return 0;
    }

    const onFinish = async (values) => {
        setIsCheckout(true);

        const orderData = {
            ...values,
            userId: userId,
            addressId: address.id,
            shippingMethod: shippingMethod,
            paymentMethod: paymentMethod,
            shippingRate: shippingMethod.id,
            promotionId: selectedPromotion?.id,
            orderDetails: cartItems.map(item => ({
                variantId: item.item.id,
                quantity: item.quantity
            }))
        };

        await orderApiRequest.createOrder(orderData, URLS.APP_URL)
            .then(response => {
                message.success('Order created successfully');

                if (paymentMethod === PaymentMethods.BANK_TRANSFER) {
                    window.location.href = response.data.checkoutUrl;
                } else {
                    navigate(URLS.CUSTOMER.HOME);
                }
                dispatch(clearCart());
            })
            .catch(error => {
                console.error('Error creating order:', error);
                message.error('Error creating order', error.message);
            }).finally(() => {
                setIsCheckout(false);
            }
            );
    };

    if (user === null) {
        return (
            <Skeleton active paragraph={{ rows: 10 }} />
        );
    }

    return (
        <>
            <Form
                layout="vertical"
                initialValues={user}
                onFinish={onFinish} >
                <Flex vertical>
                    <Breadcrumb>
                        <Breadcrumb.Item href={URLS.CUSTOMER.HOME}>Home</Breadcrumb.Item>
                        <Breadcrumb.Item href={URLS.CUSTOMER.CHECKOUT}>Checkout</Breadcrumb.Item>
                    </Breadcrumb>
                    <Typography.Title style={{ textAlign: 'center' }} level={2}>CHECKOUT</Typography.Title>

                    <Row gutter={[32, 32]}>
                        <Col xs={24} lg={14}>
                            <Typography.Title level={3}>Shipping Information</Typography.Title>
                            <Row>
                                <Col xs={24} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                                    <Flex gap={8}>
                                        <Avatar
                                            size={60}
                                            src="https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg" />
                                        <Flex vertical gap={4}>
                                            <Typography.Text strong>{user.name}</Typography.Text>
                                            <Typography.Text type="secondary">{user.email}</Typography.Text>
                                        </Flex>
                                        <Button type="link" style={{ marginLeft: 'auto' }}>
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
                                        name="phoneNumber"
                                        label="Phone Number"
                                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        name="address"
                                        label="Shipping Address"
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Card
                                                onClick={() => setSelectAddressVisible(true)}
                                                hoverable
                                            >
                                                {
                                                    address === null ? (
                                                        <Typography.Text type="secondary">Please select an address</Typography.Text>
                                                    ) : (
                                                        <Flex vertical gap={4}>
                                                            <Typography.Text>
                                                                {formatDisplayAddress(formattedAddress || address)}
                                                            </Typography.Text>
                                                        </Flex>
                                                    )
                                                }
                                            </Card>

                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Card title="Shipping Method" className="shipping-method-card">
                                <Form.Item name="shippingMethod">
                                    <Radio.Group
                                        onChange={(e) => setShippingMethod(e.target.value)}
                                        value={shippingMethod}
                                        style={{ width: '100%' }}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {
                                                address === null ? (
                                                    <Card style={{ textAlign: 'center' }}>
                                                        <Typography.Text type="secondary">Please select an address to see available shipping methods</Typography.Text>
                                                    </Card>
                                                ) : (
                                                    shippingMethods?.map((method, index) => (
                                                        <Card
                                                            key={index}
                                                            onClick={() => setShippingMethod(method)}
                                                            style={{
                                                                borderColor: shippingMethod === method ? '#1890ff' : '#f0f0f0',
                                                                transition: 'all 0.3s',
                                                                marginBottom: 8,
                                                                boxShadow: shippingMethod === method ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none'
                                                            }}
                                                            hoverable
                                                        >
                                                            <Radio value={method} style={{ width: '100%' }} >
                                                                <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                                                                    <Flex align="center" gap={16}>
                                                                        <Avatar
                                                                            src={method.carrier_logo}
                                                                            alt={method.carrier_name}
                                                                            size={50}
                                                                            shape="square"
                                                                            style={{ padding: 4, border: '1px solid #f0f0f0' }}
                                                                        />
                                                                        <Flex vertical gap={4}>
                                                                            <Typography.Text strong style={{ fontSize: 16 }}>
                                                                                {method.carrier_name}
                                                                            </Typography.Text>
                                                                            <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                                                                                {method.expected}
                                                                            </Typography.Text>
                                                                        </Flex>
                                                                    </Flex>
                                                                    <Typography.Text strong style={{ fontSize: 16 }}>
                                                                        {method.total_fee.toLocaleString('vi-VN')}₫
                                                                    </Typography.Text>
                                                                </Flex>
                                                            </Radio>
                                                        </Card>
                                                    ))
                                                )
                                            }
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
                                            <Card
                                                onClick={() => setPaymentMethod(PaymentMethods.CASH)}
                                                style={{
                                                    borderColor: paymentMethod === PaymentMethods.CASH ? '#1890ff' : '#f0f0f0',
                                                    transition: 'all 0.3s',
                                                    marginBottom: 8,
                                                    boxShadow: paymentMethod === PaymentMethods.CASH ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none'
                                                }}
                                                hoverable
                                            >
                                                <Radio value={PaymentMethods.CASH}>
                                                    <Flex align="center" gap={8}>
                                                        <Typography.Text strong>Cash on Delivery</Typography.Text>
                                                    </Flex>
                                                </Radio>
                                            </Card>
                                            <Card
                                                onClick={() => setPaymentMethod(PaymentMethods.BANK_TRANSFER)}
                                                style={{
                                                    borderColor: paymentMethod === PaymentMethods.BANK_TRANSFER ? '#1890ff' : '#f0f0f0',
                                                    transition: 'all 0.3s',
                                                    boxShadow: paymentMethod === PaymentMethods.BANK_TRANSFER ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none'
                                                }}
                                                hoverable
                                            >
                                                <Radio value={PaymentMethods.BANK_TRANSFER}>
                                                    <Flex align="center" gap={8}>
                                                        <Typography.Text strong>Bank Transfer</Typography.Text>
                                                    </Flex>
                                                </Radio>
                                            </Card>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Card>
                        </Col>

                        <Col xs={24} lg={10}>
                            <Card title="Order Summary">
                                <Flex vertical gap={16}>
                                    {cartItems.map(item => {
                                        const price = item.item.product.price + item.item.priceAdjustment;

                                        return (
                                            <Flex key={item.id} justify="space-between">
                                                <Flex gap={8} align="center">
                                                    <Avatar src={item.item.imageUrls.$values[0]} size={60} shape="square" />
                                                    <Flex vertical gap={4}>
                                                        <Typography.Text>{item.item.product.name}</Typography.Text>
                                                        <Typography.Text type="secondary">Quantity: {item.quantity}</Typography.Text>
                                                    </Flex>
                                                </Flex>
                                                <Typography.Text strong>
                                                    {(price * item.quantity).toLocaleString('vi-VN')}₫
                                                </Typography.Text>
                                            </Flex>
                                        );
                                    })}

                                    <Divider />
                                    <Flex gap={8} justify="space-between">
                                        <Input value={selectedPromotion?.code} placeholder="Enter coupon code" />
                                        <Button type="primary" onClick={handleApplyPromotion}>Select</Button>
                                    </Flex>

                                    <Divider />

                                    <Flex justify="space-between">
                                        <Typography.Text>Subtotal</Typography.Text>
                                        <Typography.Text strong>
                                            {(calculateSubtotal()).toLocaleString('vi-VN')}₫
                                        </Typography.Text>
                                    </Flex>
                                    <Flex justify='space-between'>
                                        <Typography.Text>Discount</Typography.Text>
                                        <Typography.Text strong>
                                            {calculateDiscount().toLocaleString('vi-VN')}₫
                                        </Typography.Text>
                                    </Flex>
                                    <Flex justify="space-between">
                                        <Typography.Text>Shipping</Typography.Text>
                                        <Typography.Text strong>
                                            {(calculateSubtotal()).toLocaleString('vi-VN')}₫
                                        </Typography.Text>
                                    </Flex>
                                    <Flex justify="space-between">
                                        <Typography.Text>Total</Typography.Text>
                                        <Typography.Text strong style={{ fontSize: 18 }}>
                                            {(calculateTotal()).toLocaleString('vi-VN')}₫
                                        </Typography.Text>
                                    </Flex>

                                    <Button loading={isCheckout} type="primary" htmlType="submit" size="large">
                                        Place Order
                                    </Button>
                                </Flex>
                            </Card>
                        </Col>
                    </Row>
                </Flex>
            </Form>

            <Modal
                title="Select Address"
                open={selectAddressVisible}
                onCancel={() => setSelectAddressVisible(false)}
                footer={null}
                width={800}
            >
                <Space direction="vertical" style={{ width: '100%' }}>

                    {user?.addresses?.$values.length === 0 ? (
                        <Card style={{ textAlign: 'center' }}>
                            <Typography.Text type="secondary">No addresses found. Please</Typography.Text>
                            <Button type="link" onClick={() => navigate(URLS.CUSTOMER.PROFILE)}>add an address</Button>
                        </Card>
                    ) : (
                    user?.addresses?.$values.map((addr, index) => (
                        <Card
                            key={index}
                            hoverable
                            onClick={() => handleAddressSelect(addr)}
                        >
                            <Flex vertical>
                                <Typography.Text>
                                    {formatDisplayAddress(addressCache[addr.id] || addr)}
                                </Typography.Text>
                            </Flex>
                        </Card>
                    ))
                )}
                </Space>
            </Modal>

            <Modal
                title="Select Promotion"
                open={promotionModalVisible}
                onCancel={() => setPromotionModalVisible(false)}
                footer={null}
                width={800}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    {promotions.map((promotion, index) => (
                        <Card
                            key={index}
                            hoverable
                            onClick={() => handlePromotionSelect(promotion)}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={4}>
                                <Tag color={promotion.discountType === 'Percentage' ? 'green' : 'blue'}>
                                   {promotion.discountPercentage}%
                                </Tag>
                                </Col>
                                <Col xs={24} sm={20}>
                                    <Flex vertical gap={4}>
                                    <Typography.Text strong>{promotion.code}</Typography.Text>
                                    <Typography.Text strong>{promotion.name}</Typography.Text>
                                    <Typography.Text type="secondary">{promotion.description}</Typography.Text>
                                    </Flex>
                                </Col>
                                
                                <Button type="link" onClick={() => handlePromotionSelect(promotion)}>Apply</Button>
                            </Row>
                        </Card>
                    ))}
                </Space>
            </Modal>
        </>
    );
};

export default Checkout;
