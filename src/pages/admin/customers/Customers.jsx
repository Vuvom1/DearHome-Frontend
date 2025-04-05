import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Dropdown, Menu, message, Modal, Descriptions, Input, Form, Popconfirm } from 'antd';
import { DownOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import EditCustomer from './EditCustomer';
const { Title } = Typography;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    // try {
    //   setLoading(true);
    //   // Replace with your actual API endpoint
    //   const response = await axios.get('/api/admin/customers');
    //   setCustomers(response.data);
    //   setLoading(false);
    // } catch (error) {
    //   console.error('Error fetching customers:', error);
    //   message.error('Failed to load customers');
    //   setLoading(false);
    // }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleDelete = async (customerId) => {
    // try {
    //   // Replace with your actual API endpoint
    //   await axios.delete(`/api/admin/customers/${customerId}`);
    //   message.success('Customer deleted successfully');
    //   fetchCustomers();
    // } catch (error) {
    //   console.error('Error deleting customer:', error);
    //   message.error('Failed to delete customer');
    // }
    message.success('Customer deleted successfully');
  };

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setViewModalVisible(true);
  };

  const editCustomer = (customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    // try {
    //   // Replace with your actual API endpoint
    //   await axios.put(`/api/admin/customers/${selectedCustomer.id}`, values);
    //   message.success('Customer updated successfully');
    //   setEditModalVisible(false);
    //   fetchCustomers();
    // } catch (error) {
    //   console.error('Error updating customer:', error);
    //   message.error('Failed to update customer');
    // }
    message.success('Customer updated successfully');
    setEditModalVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Orders',
      dataIndex: 'orderCount',
      key: 'orderCount',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => viewCustomerDetails(record)}
            type="text"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => editCustomer(record)}
            type="text"
          />
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              type="text"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Mock data for demonstration
  const mockCustomers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      status: 'active',
      orderCount: 5,
      address: '123 Main St, Anytown, CA 12345',
      registrationDate: '2023-01-15',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '(234) 567-8901',
      status: 'active',
      orderCount: 3,
      address: '456 Oak Ave, Somewhere, NY 67890',
      registrationDate: '2023-02-20',
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.johnson@example.com',
      phone: '(345) 678-9012',
      status: 'inactive',
      orderCount: 0,
      address: '789 Pine Blvd, Elsewhere, TX 54321',
      registrationDate: '2023-03-10',
    },
  ];

  return (
    <div className="customer-management">
      <Title level={2} style={{ marginBottom: 20 }}>Customer Management</Title>
      <Card extra={
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ marginRight: 8 }}
          >
            Add Customer
          </Button>
          <Input.Search 
            placeholder="Search customers" 
            style={{ width: 250, marginRight: 8 }} 
            allowClear
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="all">All Status</Menu.Item>
                <Menu.Item key="active">Active</Menu.Item>
                <Menu.Item key="inactive">Inactive</Menu.Item>
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
            onClick={() => fetchCustomers()}
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
          dataSource={loading ? [] : (customers.length ? customers : mockCustomers)} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* View Customer Modal */}
      <Modal
        title={`Customer Details`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedCustomer && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Customer ID">{selectedCustomer.id}</Descriptions.Item>
            <Descriptions.Item label="Name">{`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedCustomer.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedCustomer.phone}</Descriptions.Item>
            <Descriptions.Item label="Address">{selectedCustomer.address}</Descriptions.Item>
            <Descriptions.Item label="Registration Date">
              {new Date(selectedCustomer.registrationDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedCustomer.status === 'active' ? 'green' : 'red'}>
                {selectedCustomer.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Total Orders">{selectedCustomer.orderCount}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Edit Customer Modal */}
      <EditCustomer 
        editModalVisible={editModalVisible}
        setEditModalVisible={setEditModalVisible}
        form={form}
        handleEditSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default Customers;
