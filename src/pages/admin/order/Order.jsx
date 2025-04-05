import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Dropdown, Menu, message, Modal, Descriptions, Badge, Input } from 'antd';
import { DownOutlined, EyeOutlined, CheckOutlined, CloseOutlined, PrinterOutlined, PlusOutlined, ReloadOutlined, SettingOutlined   } from '@ant-design/icons';

const { Title } = Typography;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    // try {
    //   setLoading(true);
    //   // Replace with your actual API endpoint
    //   const response = await axios.get('/api/admin/orders');
    //   setOrders(response.data);
    //   setLoading(false);
    // } catch (error) {
    //   console.error('Error fetching orders:', error);
    //   message.error('Failed to load orders');
    //   setLoading(false);
    // }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // try {
    //   // Replace with your actual API endpoint
    //   await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
    //   message.success(`Order status updated to ${newStatus}`);
    //   fetchOrders();
    // } catch (error) {
    //   console.error('Error updating order status:', error);
    //   message.error('Failed to update order status');
    // }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setViewModalVisible(true);
  };

  const printOrder = (orderId) => {
    message.info(`Printing order #${orderId}`);
    // Implement print functionality
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'gold';
      case 'processing':
        return 'blue';
      case 'shipped':
        return 'cyan';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <a>#{id}</a>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => `${customer.firstName} ${customer.lastName}`,
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => viewOrderDetails(record)}
            type="text"
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item 
                  key="1" 
                  icon={<CheckOutlined />}
                  onClick={() => handleStatusChange(record.id, 'processing')}
                >
                  Mark as Processing
                </Menu.Item>
                <Menu.Item 
                  key="2" 
                  icon={<CheckOutlined />}
                  onClick={() => handleStatusChange(record.id, 'shipped')}
                >
                  Mark as Shipped
                </Menu.Item>
                <Menu.Item 
                  key="3" 
                  icon={<CheckOutlined />}
                  onClick={() => handleStatusChange(record.id, 'delivered')}
                >
                  Mark as Delivered
                </Menu.Item>
                <Menu.Item 
                  key="4" 
                  icon={<CloseOutlined />}
                  onClick={() => handleStatusChange(record.id, 'cancelled')}
                  danger
                >
                  Cancel Order
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  key="5" 
                  icon={<PrinterOutlined />}
                  onClick={() => printOrder(record.id)}
                >
                  Print Order
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="link">
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Mock data for development - remove in production
  const mockOrders = [
    {
      id: '1001',
      customer: { firstName: 'John', lastName: 'Doe' },
      orderDate: '2023-05-15T10:30:00',
      total: 129.99,
      status: 'pending',
      items: [
        { id: 1, name: 'Product A', quantity: 2, price: 49.99 },
        { id: 2, name: 'Product B', quantity: 1, price: 30.01 },
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA',
      },
      paymentMethod: 'Credit Card',
    },
    {
      id: '1002',
      customer: { firstName: 'Jane', lastName: 'Smith' },
      orderDate: '2023-05-14T14:45:00',
      total: 89.95,
      status: 'processing',
      items: [
        { id: 3, name: 'Product C', quantity: 1, price: 89.95 },
      ],
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Somewhere',
        state: 'NY',
        zip: '67890',
        country: 'USA',
      },
      paymentMethod: 'PayPal',
    },
    {
      id: '1003',
      customer: { firstName: 'Robert', lastName: 'Johnson' },
      orderDate: '2023-05-13T09:15:00',
      total: 245.50,
      status: 'shipped',
      items: [
        { id: 4, name: 'Product D', quantity: 3, price: 45.50 },
        { id: 5, name: 'Product E', quantity: 2, price: 54.50 },
      ],
      shippingAddress: {
        street: '789 Pine Blvd',
        city: 'Elsewhere',
        state: 'TX',
        zip: '54321',
        country: 'USA',
      },
      paymentMethod: 'Credit Card',
    },
  ];

  return (
    <div className="order-management">
        <Title level={2} style={{ marginBottom: 20 }}>Order Management</Title>
      <Card extra={
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ marginRight: 8 }}
          >
            Add Order
          </Button>
          <Input.Search 
            placeholder="Search orders" 
            style={{ width: 250, marginRight: 8 }} 
            allowClear
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="all">All Status</Menu.Item>
                <Menu.Item key="pending">Pending</Menu.Item>
                <Menu.Item key="processing">Processing</Menu.Item>
                <Menu.Item key="shipped">Shipped</Menu.Item>
                <Menu.Item key="delivered">Delivered</Menu.Item>
                <Menu.Item key="cancelled">Cancelled</Menu.Item>
              </Menu>
            }
          >
            <Button>
              Status Filter <DownOutlined />
            </Button>
          </Dropdown>
          <Button 
            icon={<ReloadOutlined />} 
            style={{ marginLeft: 8 }}
            onClick={() => fetchOrders()}
          >
          </Button>
          <Button 
            icon={<PrinterOutlined />} 
            style={{ marginLeft: 8 }}
            onClick={() => message.info('Exporting orders...')}
          >
          </Button>
          <Button 
            icon={<SettingOutlined />} 
            style={{ marginLeft: 8 }}
            onClick={() => message.info('Settings opened')}
          >
          </Button>
        </Space>
        }>
        <Table 
         
          columns={columns} 
          dataSource={loading ? [] : (orders.length ? orders : mockOrders)} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Order Details #${selectedOrder?.id || ''}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => printOrder(selectedOrder?.id)}>
            Print Order
          </Button>,
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Order Status" span={2}>
                <Badge 
                  status={getStatusColor(selectedOrder.status) === 'gold' ? 'warning' : 
                         getStatusColor(selectedOrder.status) === 'green' ? 'success' : 
                         getStatusColor(selectedOrder.status) === 'red' ? 'error' : 'processing'} 
                  text={selectedOrder.status.toUpperCase()} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {`${selectedOrder.customer.firstName} ${selectedOrder.customer.lastName}`}
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {new Date(selectedOrder.orderDate).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedOrder.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                ${selectedOrder.total.toFixed(2)}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 20 }}>Shipping Address</Title>
            <Descriptions bordered>
              <Descriptions.Item label="Address" span={3}>
                {selectedOrder.shippingAddress.street}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {selectedOrder.shippingAddress.city}
              </Descriptions.Item>
              <Descriptions.Item label="State">
                {selectedOrder.shippingAddress.state}
              </Descriptions.Item>
              <Descriptions.Item label="Zip Code">
                {selectedOrder.shippingAddress.zip}
              </Descriptions.Item>
              <Descriptions.Item label="Country" span={3}>
                {selectedOrder.shippingAddress.country}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 20 }}>Order Items</Title>
            <Table 
              dataSource={selectedOrder.items}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: 'Product',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `$${price.toFixed(2)}`,
                },
                {
                  title: 'Subtotal',
                  key: 'subtotal',
                  render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
                },
              ]}
              summary={(pageData) => {
                const total = pageData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>${total.toFixed(2)}</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default Order;
