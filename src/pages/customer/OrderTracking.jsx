import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { orderApiRequest, shippingApiRequest } from "../../api/ApiRequests";
import {
    Typography,
    Card,
    Steps,
    Divider,
    Row,
    Col,
    Tag,
    Button,
    Flex,
    Table,
    Avatar,
    Pagination,
    Skeleton,
    Empty,
    App,
    Modal,
    Tabs,
    Badge,
    Grid
} from 'antd';
import {
    ShoppingOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CarOutlined,
    GiftOutlined,
    SyncOutlined,
    ExclamationCircleOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { URLS } from '../../constants/urls';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const OrderTracking = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const userId = useSelector(state => state.auth.user?.nameid);
    const screens = useBreakpoint();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [formattedAddresses, setFormattedAddresses] = useState({});
    const [activeTab, setActiveTab] = useState('all');

    // Map order status to steps index
    const orderStatusMap = {
        'Placed': 0,
        'Processing': 1,
        'Shipping': 2,
        'Delivered': 3,
        'Completed': 4,
        'Cancelled': -1
    };

    // Status color mapping
    const statusColors = {
        'Placed': 'orange',
        'Processing': 'blue',
        'Shipping': 'cyan',
        'Delivered': 'green',
        'Completed': 'green',
        'Cancelled': 'red'
    };

    // Format status names for display
    const formatStatusName = (status) => {
        switch (status) {
            case 'WaitForPayment': return 'Waiting for Payment';
            case 'Processing': return 'Processing';
            case 'Shipping': return 'Shipping';
            case 'Delivered': return 'Delivered';
            case 'Completed': return 'Completed';
            case 'Cancelled': return 'Cancelled';
            default: return status;
        }
    };

    // Fetch formatted address data for an address ID
    const fetchFormattedAddress = async (addressId) => {
        if (formattedAddresses[addressId]) {
            return formattedAddresses[addressId];
        }

        try {
            const response = await shippingApiRequest.getFormattedAddress(addressId);
            const formattedAddr = response.data;

            // Update the cache
            setFormattedAddresses(prev => ({
                ...prev,
                [addressId]: formattedAddr
            }));

            return formattedAddr;
        } catch (error) {
            console.error('Error fetching formatted address:', error);
            return null;
        }
    };

    // Format address for display
    const formatAddress = (address) => {
        if (!address) return 'N/A';

        // Check if we have the formatted address with nested objects
        if (formattedAddresses[address.id]) {
            const formatted = formattedAddresses[address.id];
            return `${formatted.street}, ${formatted.ward.name}, ${formatted.district.name}, ${formatted.city.name}`;
        }

        // Fallback to basic address format
        return `${address.street}, ${address.ward || ''}, ${address.district || ''}, ${address.city || ''}`;
    };

    const fetchOrders = async (page = 1, pageSize = 5, status = '') => {
        if (!userId) return;

        setLoading(true);
        try {
            let ordersData;

            if (status === 'all') {
                const response = await orderApiRequest.getOrdersByUserId(userId, (page - 1) * pageSize, pageSize);
                ordersData = response.data;
                setOrders(ordersData.$values || []);
                setPagination({
                    current: page,
                    pageSize: pageSize,
                    total: ordersData.totalCount
                });
            } else {
                const response = await orderApiRequest.getOrdersByUserIdAndStatus(userId, status, (page - 1) * pageSize, pageSize);
                ordersData = response.data;
                setOrders(ordersData.$values || []);
                setPagination({
                    current: page,
                    pageSize: pageSize,
                    total: ordersData.totalCount
                });

                // Fetch formatted addresses for all orders
                const addressPromises = (ordersData.$values || []).map(order =>
                    fetchFormattedAddress(order.addressId)
                );

                await Promise.all(addressPromises);
            }

        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    // Change pagination
    const handlePageChange = (page, pageSize) => {
        setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize
        });
        fetchOrders(page, pageSize, activeTab);
    };

    // View order details
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setDetailModalVisible(true);
    };

    // Handle tab change
    const handleTabChange = (key) => {
        setActiveTab(key);
        fetchOrders(1, pagination.pageSize, key);
    };

    // Cancel an order
    const handleCancelOrder = async (orderId) => {
        try {
            await orderApiRequest.cancelOrder(orderId);
            message.success('Order cancelled successfully');
            fetchOrders(pagination.current, pagination.pageSize, activeTab);
            setDetailModalVisible(false);
        } catch (error) {
            console.error('Error cancelling order:', error);
            message.error('Failed to cancel order');
        }
    };

    // Complete an order
    const handleCompleteOrder = async (orderId) => {
        try {
            await orderApiRequest.updateOrderStatus(orderId, 'Completed');
            message.success('Order marked as completed');
            fetchOrders(pagination.current, pagination.pageSize, activeTab);
            if (detailModalVisible) {
                setDetailModalVisible(false);
            }
        } catch (error) {
            console.error('Error completing order:', error);
            message.error('Failed to complete order');
        }
    };

    // Columns for the orders table
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: id => <Text style={{ fontFamily: 'monospace' }}>{id.substring(0, 8)}...</Text>,
            responsive: ['md']
        },
        {
            title: 'Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            responsive: ['sm']
        },
        {
            title: 'Products',
            dataIndex: 'orderDetails',
            key: 'products',
            render: (orderDetails) => (
                <Avatar.Group max={3}>
                    {orderDetails.$values.map((detail, index) => (
                        <Avatar
                            key={index}
                            src={detail.variant.imageUrls.$values[0]}
                            size={screens.xs ? 'small' : 'large'}
                            shape="square"
                        />
                    ))}
                </Avatar.Group>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'finalPrice',
            key: 'finalPrice',
            render: price => <Text strong>{price.toLocaleString('vi-VN')}₫</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                const color = statusColors[status] || 'default';
                return (
                    <Tag color={color}>
                        {formatStatusName(status)}
                    </Tag>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Flex gap={8} wrap="wrap">
                    <Button type="outlined" size={screens.xs ? "small" : "middle"} onClick={() => handleViewDetails(record)}>
                        <EyeOutlined />
                    </Button>
                    {record.status === 'WaitForPayment' && (
                        <Button
                            danger
                            size={screens.xs ? "small" : "middle"}
                            onClick={() => Modal.confirm({
                                title: 'Cancel Order',
                                icon: <ExclamationCircleOutlined />,
                                content: 'Are you sure you want to cancel this order?',
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk: () => handleCancelOrder(record.id)
                            })}
                        >
                            {screens.sm ? "Cancel" : "X"}
                        </Button>
                    )}
                    
                    {record.status === 'Delivered' && (
                        <Button
                            type="primary"
                            size={screens.xs ? "small" : "middle"}
                            onClick={() => {setConfirmationModalVisible(true), setSelectedOrder(record)}}
                        >
                            {screens.sm ? "Complete" : "✓"}
                        </Button>
                    )}
                    
                    {record.status === 'Completed' && (
                        <Button
                            type="primary"
                            size={screens.xs ? "small" : "middle"}
                            onClick={() => navigate(`${URLS.CUSTOMER.REVIEW_ORDER(record.id)}`)}
                        >
                            Review
                        </Button>
                    )}
                </Flex>
            ),
        },
    ];

    // Detail modal content
    const renderOrderDetailModal = () => {
        if (!selectedOrder) return null;

        const order = selectedOrder;
        const currentStep = orderStatusMap[order.status];

        // Determine if steps should be shown as error state (cancelled)
        const isOrderCancelled = order.status === 'Cancelled';

        return (
            <Modal
                title={<Title level={4}>Order Details</Title>}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={screens.md ? 900 : '95%'}
                style={{ top: 20 }}
            >
                <Card>
                    <Flex justify="space-between" align="center" style={{ marginBottom: 24 }} wrap={screens.xs ? "wrap" : "nowrap"}>
                        <div style={{ marginBottom: screens.xs ? 16 : 0 }}>
                            <Text>Order ID: <Text strong style={{ fontFamily: 'monospace' }}>{order.id}</Text></Text>
                            <br />
                            <Text>Date: <Text strong>{new Date(order.orderDate).toLocaleDateString()}</Text></Text>
                        </div>
                        <Tag color={statusColors[order.status]} style={{ fontSize: 16, padding: '4px 12px' }}>
                            {formatStatusName(order.status)}
                        </Tag>
                    </Flex>

                    {!isOrderCancelled ? (
                        <Steps
                            current={currentStep}
                            direction={screens.sm ? "horizontal" : "vertical"}
                            size={screens.xs ? "small" : "default"}
                            items={[
                                {
                                    title: 'Placed',
                                    icon: <ShoppingOutlined />,
                                },
                                {
                                    title: 'Processing',
                                    icon: <SyncOutlined />
                                },
                                {
                                    title: 'Shipping',
                                    icon: <CarOutlined />
                                },
                                {
                                    title: 'Delivered',
                                    icon: <GiftOutlined />
                                },
                                {
                                    title: 'Completed',
                                    icon: <CheckCircleOutlined />
                                },
                            ]}
                        />
                    ) : (
                        <Steps
                            current={0}
                            status="error"
                            direction={screens.sm ? "horizontal" : "vertical"}
                            items={[
                                {
                                    title: 'Cancelled',
                                    icon: <ExclamationCircleOutlined />
                                }
                            ]}
                        />
                    )}

                    <Divider />

                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={24} md={12}>
                            <Card title="Shipping Information" border={false} style={{ marginBottom: 16 }}>
                                <Text strong>{order.user.name}</Text>
                                <br />
                                <Text>{order.user.phoneNumber}</Text>
                                <Divider plain>Address</Divider>
                                <Text>{formatAddress(order.address)}</Text>

                                {order.shippingCode && (
                                    <>
                                        <Divider plain>Tracking Code</Divider>
                                        <Badge.Ribbon text="Track" color="blue">
                                            <Card size="small">
                                                <Text strong style={{ fontFamily: 'monospace', wordBreak: 'break-word' }}>{order.shippingCode}</Text>
                                            </Card>
                                        </Badge.Ribbon>
                                    </>
                                )}
                            </Card>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Card title="Payment Information" bordered={false} style={{ marginBottom: 16 }}>
                                <Flex justify="space-between">
                                    <Text>Payment Method:</Text>
                                    <Text strong>{order.paymentMethod}</Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text>Subtotal:</Text>
                                    <Text>{order.totalPrice.toLocaleString('vi-VN')}₫</Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text>Discount:</Text>
                                    <Text>{order.discount.toLocaleString('vi-VN')}₫</Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text>Shipping:</Text>
                                    <Text>{(order.finalPrice - order.totalPrice + order.discount).toLocaleString('vi-VN')}₫</Text>
                                </Flex>
                                <Divider style={{ margin: '12px 0' }} />
                                <Flex justify="space-between">
                                    <Text>Total:</Text>
                                    <Text strong style={{ fontSize: 16 }}>{order.finalPrice.toLocaleString('vi-VN')}₫</Text>
                                </Flex>

                                {order.status === 'WaitForPayment' && order.paymentLinkUrl && (
                                    <Button
                                        type="primary"
                                        style={{ marginTop: 16, width: '100%' }}
                                        onClick={() => window.open(order.paymentLinkUrl, '_blank')}
                                    >
                                        Pay Now
                                    </Button>
                                )}
                            </Card>
                        </Col>
                    </Row>

                    <Divider orientation="left">Order Items</Divider>

                    {order.orderDetails.$values.map((detail, index) => (
                        <Card key={index} style={{ marginBottom: 16 }}>
                            <Flex align="center" gap={16} wrap={screens.xs ? "wrap" : "nowrap"}>
                                <Avatar
                                    src={detail.variant.imageUrls.$values[0]}
                                    size={80}
                                    shape="square"
                                    style={{ objectFit: 'cover' }}
                                />
                                <Flex vertical flex={1} style={{ width: screens.xs ? '100%' : 'auto', marginTop: screens.xs ? 16 : 0 }}>
                                    <Text strong style={{ fontSize: 16 }}>{detail.variant.product.name}</Text>
                                    <Text type="secondary">SKU: {detail.variant.sku}</Text>

                                    {detail.variant.variantAttributes.$values.length > 0 && (
                                        <Flex gap={8} style={{ marginTop: 8 }} wrap="wrap">
                                            {detail.variant.variantAttributes.$values.map((attr, i) => (
                                                <Tag key={i}>{attr.attributeValue.value}</Tag>
                                            ))}
                                        </Flex>
                                    )}
                                </Flex>
                                <Flex vertical align={screens.xs ? "start" : "end"} style={{ width: screens.xs ? '100%' : 'auto', marginTop: screens.xs ? 8 : 0 }}>
                                    <Text>{detail.unitPrice.toLocaleString('vi-VN')}₫</Text>
                                    <Text type="secondary">Quantity: {detail.quantity}</Text>
                                    <Text strong>{detail.totalPrice.toLocaleString('vi-VN')}₫</Text>
                                </Flex>
                            </Flex>
                        </Card>
                    ))}

                    <Flex justify="space-between" style={{ marginTop: 24 }} wrap={screens.xs ? "wrap" : "nowrap"}>
                        {order.status === 'WaitForPayment' && (
                            <Button
                                danger
                                style={{ marginBottom: screens.xs ? 16 : 0, width: screens.xs ? '100%' : 'auto' }}
                                onClick={() => Modal.confirm({
                                    title: 'Cancel Order',
                                    icon: <ExclamationCircleOutlined />,
                                    content: 'Are you sure you want to cancel this order?',
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk: () => handleCancelOrder(order.id)
                                })}
                            >
                                Cancel Order
                            </Button>
                        )}
                        
                        {order.status === 'Delivered' && (
                            <Button
                                type="primary"
                                style={{ marginBottom: screens.xs ? 16 : 0, width: screens.xs ? '100%' : 'auto' }}
                                onClick={() => {setConfirmationModalVisible(true), setSelectedOrder(order)}}
                            >
                                Complete Order
                            </Button>
                        )}
                        <Button 
                            style={{ width: screens.xs ? '100%' : 'auto' }}
                            onClick={() => setDetailModalVisible(false)}
                        >
                            Close
                        </Button>
                    </Flex>
                </Card>
            </Modal>
        );
    };

    // Confirmation modal for cancelling an order
    const renderConfirmationModal = () => {
        return (
            <Modal
                title="Complete Order"
                open={confirmationModalVisible}
                onCancel={() => setConfirmationModalVisible(false)}
                footer={null}
                width={screens.md ? 600 : '95%'}
                style={{ top: 20 }}
            >
                <Card>
                    <Text>Are you sure you want to mark this order as completed?</Text>
                    <Flex justify="end" style={{ marginTop: 16 }}>
                        <Button type="primary" onClick={() => handleCompleteOrder(selectedOrder.id)}>
                            Confirm
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => setConfirmationModalVisible(false)}>
                            Cancel
                        </Button>
                    </Flex>
                </Card>
            </Modal>

        );
    }

    useEffect(() => {
        if (userId) {
            fetchOrders(1, pagination.pageSize, 'all');
        }
    }, [userId]);

    if (!userId) {
        return (
            <Card>
                <Empty
                    description="Please log in to view your orders"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button type="primary" onClick={() => navigate(URLS.AUTHENTICATION.LOGIN)}>
                        Login
                    </Button>
                </Empty>
            </Card>
        );
    }

    return (
        <div style={{ padding: '24px 0' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>My Orders</Title>

            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    
                    items={[
                        {
                            key: 'all',
                            label: 'All Orders',
                        },
                        {
                            key: 'WaitForPayment',
                            label: screens.md ? 'Awaiting Payment' : 'To Pay',
                        },
                        {
                            key: 'Processing',
                            label: 'Processing',
                        },
                        {
                            key: 'Shipping',
                            label: 'Shipping',
                        },
                        {
                            key: 'Delivered',
                            label: 'Delivered',
                        },
                        {
                            key: 'Completed',
                            label: 'Completed',
                        },
                        {
                            key: 'Cancelled',
                            label: 'Cancelled',
                        },
                    ]}
                />

                {loading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                ) : orders.length === 0 ? (
                    <Empty description="No orders found" />
                ) : (
                    <>
                        <Table
                            columns={columns}
                            dataSource={orders}
                            showHeader={false}
                            rowKey="id"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                            size={screens.md ? "middle" : "small"}
                        />

                        <Flex justify="end" style={{ marginTop: 16 }} wrap={screens.xs ? "wrap" : "nowrap"}>
                            <Pagination
                                current={pagination.current}
                                pageSize={pagination.pageSize}
                                total={pagination.total}
                                onChange={handlePageChange}
                                showSizeChanger={screens.sm}
                                pageSizeOptions={['5', '10', '20']}
                                size={screens.xs ? "small" : "default"}
                                style={{ width: screens.xs ? '100%' : 'auto', textAlign: screens.xs ? 'center' : 'right' }}
                            />
                        </Flex>
                    </>
                )}
            </Card>

            {renderOrderDetailModal()}
            {renderConfirmationModal()}
        </div>
    );
};

export default OrderTracking;

