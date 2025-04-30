import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Dropdown, Menu, message, Modal, Descriptions, Badge, Input, Image } from 'antd';
import { DownOutlined, EyeOutlined, CheckOutlined, CloseOutlined, PrinterOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { orderApiRequest } from '../../../api/ApiRequests';

const { Title } = Typography;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [offSet, setOffSet] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [offSet, limit]);

  const fetchOrders = async () => {
    setLoading(true);
    await orderApiRequest.getAllOrders(offSet, limit)
      .then((response) => {
        setOrders(response.data.$values);
        // Assuming the API returns total count somewhere, adjust as needed
        setTotal(response.data.$values.length > 0 ? response.data.$values.length : 0);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        message.error('Failed to fetch orders');
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApiRequest.updateOrderStatus(orderId, newStatus);

      message.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    console.log('Selected Order:', order);
    setViewModalVisible(true);
  };

  const printOrder = (orderId) => {
    message.info(`Printing order #${orderId}`);
    // Implement print functionality
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'waitforpayment':
        return 'gold';
      case 'paid':
        return 'purple';
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

  const getFormattedStatus = (status) => {
    return status.replace(/([A-Z])/g, ' $1').trim();
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <a>#{id?.substring(0, 8)}...</a>,
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user) => user?.name || '',
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      render: (finalPrice) => (
        <span>{(finalPrice).toLocaleString('vi-VN')} ₫</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getFormattedStatus(status).toUpperCase()}
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
                  onClick={() => handleStatusChange(record.id, 'Processing')}
                >
                  Mark as Processing
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<CheckOutlined />}
                  onClick={() => handleStatusChange(record.id, 'Shipped')}
                >
                  Mark as Shipped
                </Menu.Item>
                <Menu.Item
                  key="3"
                  icon={<CheckOutlined />}
                  onClick={() => handleStatusChange(record.id, 'Delivered')}
                >
                  Mark as Delivered
                </Menu.Item>
                <Menu.Item
                  key="4"
                  icon={<CloseOutlined />}
                  onClick={() => handleStatusChange(record.id, 'Cancelled')}
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

  const handleTableChange = (pagination) => {
    setOffSet((pagination.current - 1) * limit);
  };

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
                <Menu.Item key="waitforpayment">Wait for Payment</Menu.Item>
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
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: limit,
            total: total,
            onChange: (page) => setOffSet((page - 1) * limit),
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={`Order Details #${selectedOrder?.id ? selectedOrder.id : ''}`}
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
                  text={getFormattedStatus(selectedOrder.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {selectedOrder.user.name}
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {new Date(selectedOrder.orderDate).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedOrder.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                {(selectedOrder.finalPrice).toLocaleString('vi-VN')} VND
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 20 }}>Shipping Address</Title>
            <Descriptions bordered>
              <Descriptions.Item label="Address" span={3}>
                {selectedOrder.address.street}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {selectedOrder.address.city}
              </Descriptions.Item>
              <Descriptions.Item label="District">
                {selectedOrder.address.district}
              </Descriptions.Item>
              <Descriptions.Item label="Postal Code">
                {selectedOrder.address.postalCode}
              </Descriptions.Item>
              <Descriptions.Item label="Country" span={3}>
                {selectedOrder.address.country}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4} style={{ marginTop: 20 }}>Order Items</Title>
            <Table
              dataSource={selectedOrder.orderDetails.$values}
              rowKey="variantId"
              pagination={false}
              columns={[
                {

                  dataIndex: ['variant', 'imageUrls', '$values'],
                  key: 'imageUrls',
                  render: (imageUrls) => (
                    <Image
                      width={50}
                      height={50}
                      src={imageUrls[0]}
                      alt="Product Image"
                      style={{ borderRadius: '5px' }}
                    />
                  ),
                },
                {
                  title: 'Product Name',
                  dataIndex: ['variant', 'product', 'name'],
                  key: 'productName',
                },
                {
                  title: 'SKU',
                  dataIndex: ['variant', 'sku'],
                  key: 'sku',
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Price',
                  dataIndex: 'unitPrice',
                  key: 'unitPrice',
                  render: (price) => `${(price).toLocaleString('vi-VN')} VND`,
                },
                {
                  title: 'Subtotal',
                  key: 'totalPrice',
                  dataIndex: 'totalPrice',
                  render: (totalPrice) => `${totalPrice?.toLocaleString('vi-VN')} VND`,
                },
              ]}
              summary={(pageData) => {
                const total = pageData.reduce((sum, item) => sum + item.totalPrice, 0);
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell index={1} justifyContent='flex-end'>
                      <strong>{(total).toLocaleString('vi-VN')} VND</strong>
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
