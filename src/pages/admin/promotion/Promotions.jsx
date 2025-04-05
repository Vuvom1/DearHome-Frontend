import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, message, Modal, Form, Input, DatePicker, InputNumber, Select, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPromotions(mockPromotions);
      setLoading(false);
    }, 500);
  };

  const handleAddPromotion = () => {
    setModalType('add');
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditPromotion = (promotion) => {
    setModalType('edit');
    setSelectedPromotion(promotion);
    form.setFieldsValue({
      ...promotion,
      dateRange: [moment(promotion.startDate), moment(promotion.endDate)],
    });
    setModalVisible(true);
  };

  const handleViewPromotion = (promotion) => {
    setModalType('view');
    setSelectedPromotion(promotion);
    form.setFieldsValue({
      ...promotion,
      dateRange: [moment(promotion.startDate), moment(promotion.endDate)],
    });
    setModalVisible(true);
  };

  const handleDeletePromotion = async (promotionId) => {
    try {
      // Replace with actual API call
      // await axios.delete(`/api/admin/promotions/${promotionId}`);
      setPromotions(promotions.filter(item => item.id !== promotionId));
      message.success('Promotion deleted successfully');
    } catch (error) {
      console.error('Error deleting promotion:', error);
      message.error('Failed to delete promotion');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const promotionData = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
      };
      delete promotionData.dateRange;

      if (modalType === 'add') {
        // Replace with actual API call
        // await axios.post('/api/admin/promotions', promotionData);
        const newPromotion = {
          id: Math.floor(Math.random() * 1000),
          ...promotionData,
          status: 'active',
        };
        setPromotions([...promotions, newPromotion]);
        message.success('Promotion added successfully');
      } else if (modalType === 'edit') {
        // Replace with actual API call
        // await axios.put(`/api/admin/promotions/${selectedPromotion.id}`, promotionData);
        const updatedPromotions = promotions.map(item => 
          item.id === selectedPromotion.id ? { ...item, ...promotionData } : item
        );
        setPromotions(updatedPromotions);
        message.success('Promotion updated successfully');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving promotion:', error);
      message.error('Failed to save promotion');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'upcoming':
        return 'blue';
      case 'expired':
        return 'red';
      case 'inactive':
        return 'gray';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => record.type === 'percentage' ? `${value}%` : `$${value}`,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => moment(date).format('YYYY-MM-DD'),
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
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => handleViewPromotion(record)}
            type="text"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditPromotion(record)}
            type="text"
          />
          <Popconfirm
            title="Are you sure you want to delete this promotion?"
            onConfirm={() => handleDeletePromotion(record.id)}
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

  const renderModalTitle = () => {
    switch (modalType) {
      case 'add':
        return 'Add New Promotion';
      case 'edit':
        return 'Edit Promotion';
      case 'view':
        return 'Promotion Details';
      default:
        return 'Promotion';
    }
  };

  // Mock data
  const mockPromotions = [
    {
      id: 1,
      name: 'Summer Sale',
      code: 'SUMMER2023',
      type: 'percentage',
      value: 20,
      minPurchase: 50,
      maxDiscount: 100,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      status: 'active',
      description: 'Summer season discount for all products',
    },
    {
      id: 2,
      name: 'New Customer',
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minPurchase: 0,
      maxDiscount: 50,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      status: 'active',
      description: 'Discount for new customers',
    },
    {
      id: 3,
      name: 'Holiday Special',
      code: 'HOLIDAY25',
      type: 'percentage',
      value: 25,
      minPurchase: 100,
      maxDiscount: 200,
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      status: 'upcoming',
      description: 'Special discount for holiday season',
    },
    {
      id: 4,
      name: 'Free Shipping',
      code: 'FREESHIP',
      type: 'fixed',
      value: 15,
      minPurchase: 75,
      maxDiscount: 15,
      startDate: '2023-05-01',
      endDate: '2023-05-31',
      status: 'expired',
      description: 'Free shipping on orders over $75',
    },
  ];

  return (
    <div>
      <Card
        title={<Title level={4}>Promotions</Title>}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddPromotion}
            >
              Add Promotion
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchPromotions}
            >
              Refresh
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={promotions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={renderModalTitle()}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={modalType === 'view' ? [
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>
        ] : null}
        destroyOnClose
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={modalType === 'view'}
        >
          <Form.Item
            name="name"
            label="Promotion Name"
            rules={[{ required: true, message: 'Please enter promotion name' }]}
          >
            <Input placeholder="Enter promotion name" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Promotion Code"
            rules={[{ required: true, message: 'Please enter promotion code' }]}
          >
            <Input placeholder="Enter promotion code" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Discount Type"
            rules={[{ required: true, message: 'Please select discount type' }]}
          >
            <Select placeholder="Select discount type">
              <Option value="percentage">Percentage (%)</Option>
              <Option value="fixed">Fixed Amount ($)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Discount Value"
            rules={[{ required: true, message: 'Please enter discount value' }]}
          >
            <InputNumber
              min={0}
              placeholder="Enter discount value"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="minPurchase"
            label="Minimum Purchase Amount"
            rules={[{ required: true, message: 'Please enter minimum purchase amount' }]}
          >
            <InputNumber
              min={0}
              placeholder="Enter minimum purchase amount"
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="maxDiscount"
            label="Maximum Discount Amount"
          >
            <InputNumber
              min={0}
              placeholder="Enter maximum discount amount"
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Promotion Period"
            rules={[{ required: true, message: 'Please select promotion period' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Enter promotion description" />
          </Form.Item>

          {modalType !== 'view' && (
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {modalType === 'add' ? 'Add Promotion' : 'Save Changes'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Promotions;
