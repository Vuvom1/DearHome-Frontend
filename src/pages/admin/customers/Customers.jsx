import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, Dropdown, Menu, message, Modal, Descriptions, Input, Form, Popconfirm, Switch } from 'antd';
import { DownOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import EditCustomer from './EditCustomer';
import { userApiRequest } from '../../../api/ApiRequests';
import { data } from 'react-router-dom';
const { Title } = Typography;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [form] = Form.useForm();

  const fetchCustomers = async (page = pagination.current, pageSize = pagination.pageSize) => {
      setLoading(true);

      // Calculate skip for pagination (0-based index for the API)
      const skip = (page - 1) * pageSize;

      await userApiRequest.getAllCustomers(skip, pageSize)
        .then((response) => {
          setCustomers(response.data.$values);
          // Update pagination with total count if available from API response
          setPagination({
            ...pagination,
            current: page,
            pageSize: pageSize,
            total: response.data.totalCount || response.data.$values.length
          });
        })
        .catch((error) => {
          console.error('Error fetching customers:', error);
          message.error('Failed to fetch customers');
        }).finally(() => {
          setLoading(false);
        }
      );
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search text and status
  useEffect(() => {
    if (customers.length > 0) {
      let filtered = [...customers];
      
      // Apply search filter if searchText is not empty
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        filtered = filtered.filter(customer => 
          customer.name?.toLowerCase().includes(searchLower) ||
          customer.email?.toLowerCase().includes(searchLower) ||
          customer.phoneNumber?.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply status filter if not 'all'
      if (statusFilter !== 'all') {
        filtered = filtered.filter(customer => 
          statusFilter === 'active' ? customer.isActive === true : customer.isActive === false
        );
      }
      
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [customers, searchText, statusFilter]);

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
      title: 'Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Switch 
          checked={isActive === true}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => {
            // Handle status change
            message.success(`Customer status changed to ${checked ? 'active' : 'inactive'}`);
          }}
        />
      ),
    },
    {
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchText(value)}
          />
          <Dropdown
            overlay={
              <Menu onClick={(e) => setStatusFilter(e.key)}>
                <Menu.Item key="all">All Status</Menu.Item>
                <Menu.Item key="active">Active</Menu.Item>
                <Menu.Item key="inactive">Inactive</Menu.Item>
              </Menu>
            }
          >
            <Button>
              Status Filter: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} <DownOutlined />
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
          dataSource={filteredData} 
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => fetchCustomers(page, pageSize),
            onShowSizeChange: (current, size) => fetchCustomers(current, size)
          }}
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
            <Descriptions.Item label="Name">{`${selectedCustomer.name}`}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedCustomer.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedCustomer.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Address">{selectedCustomer.address}</Descriptions.Item>
            <Descriptions.Item label="Registration Date">
              {new Date(selectedCustomer.registrationDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedCustomer.isActive === true ? 'green' : 'red'}>
                {selectedCustomer.status === 'isActive' ? 'Active' : 'Inactive'}
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
