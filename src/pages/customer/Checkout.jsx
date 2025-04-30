import { useState, useEffect, use } from 'react';
import { Typography, Row, Col, Button, Form, Input, Radio, Card, Flex, Divider, Avatar, Select, Space, Breadcrumb, Skeleton, Modal, App } from 'antd';
import { URLS } from '../../constants/urls';
import { useSelector } from 'react-redux';
import { authApiRequest } from '../../api/ApiRequests';
import { shippingApiRequest } from '../../api/ApiRequests';
import { PaymentMethods } from '../../constants/PaymentMethods';
import { orderApiRequest } from '../../api/ApiRequests';
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
    const [paymentMethod, setPaymentMethod] = useState();
    const [shippingMethod, setShippingMethod] = useState();
    const [shippingMethods, setShippingMethods] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectAddressVisible, setSelectAddressVisible] = useState(false);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([])
    const [isCheckout, setIsCheckout] = useState(false);

    const cartItems = useSelector(state => state.cart.items);

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

    const fetchCities = async () => {
        try {
            const response = await shippingApiRequest.getCities();
            return response.data;
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const onSuccessPayOS = (event) => {
        console.log('Payment successful:', event);  
        message.success('Payment successful');
        navigate(URLS.CUSTOMER.HOME);
    };

    const onExitPayOS = (event) => {
        console.log('Payment exited:', event);
        message.error('Payment exited');
    };

    const onCancelPayOS = (event) => {
        console.log('Payment cancelled:', event);
        message.error('Payment cancelled');
    };

    const getCityName = (cityId) => {
        const city = cities?.find(city => city.id === cityId);
        return city ? city.name : '';
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (user && user.addresses && user.addresses.$values.length > 0) {
            setAddress(user.addresses.$values.find(addr => addr.isDefault));
        }
    }, [user]);

    useEffect(() => {
        if (address) {
            calculateShippingCost(address).then(response => {
                setShippingMethods(response);
            });
        }
    }, [address]);

    useEffect(() => {
        fetchCities().then(response => {
            setCities(response);
        });
    }, []);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + ((item.item.product.price + item.item.priceAdjustment) * item.quantity), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal();
    };

    const onFinish = async (values) => {

        setIsCheckout(true);

        const orderData = {
            ...values,
            userId: userId,
            addressId: address.id,
            shippingMethod: shippingMethod,
            paymentMethod: paymentMethod,
            shippingRate: shippingMethod.id,
            orderDetails: cartItems.map(item => ({
                variantId: item.item.id,
                quantity: item.quantity
            }))
        };

        // console.log(URLS.CUSTOMER.VERIFY_PAYMENT_NAV);

        await orderApiRequest.createOrder(orderData, URLS.APP_URL)
            .then(response => {
                message.success('Order created successfully');

                if (paymentMethod === PaymentMethods.BANK_TRANSFER) {
                    //Ridirect to payos link
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

    if (user === null && cities.length === 0 && districts.length === 0 && wards.length === 0) {
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
                                                <Flex justify='space-between' gap={8}>
                                                    <Typography.Text>{address?.street}, {address?.ward}, {address?.district}, {address?.city}, {getCityName(address?.city)}</Typography.Text>
                                                    <Typography type='link'>Change address</Typography>
                                                </Flex>
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
                                            {shippingMethods?.map((method, index) => (
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
                                            ))}
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
                                        <Input placeholder="Enter coupon code" />
                                        <Button type="primary">Apply</Button>
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
                                            {(calculateSubtotal()).toLocaleString('vi-VN')}₫
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
                    {user?.addresses?.$values.map((address, index) => (
                        <Card
                            key={index}
                            hoverable
                            onClick={() => { setAddress(address); setSelectAddressVisible(false); }}
                        >
                            <Flex vertical>
                                <Typography.Text>{address.street}, {address.ward}, {address.district}, {address.city}</Typography.Text>
                            </Flex>
                        </Card>
                    ))}
                </Space>
            </Modal>
        </>
    );
};

export default Checkout;
