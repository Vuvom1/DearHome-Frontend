import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Typography, message, Modal, Form, Input, DatePicker, InputNumber, Select, Popconfirm, Switch, Row, Col, App, Flex, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { promotionApiRequest, ProductApiRequest } from '../../../api/ApiRequests';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const Promotions = () => {
  const {message} = App.useApp();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  useEffect(() => {
    fetchPromotions();
  }, [pagination.current, searchText]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await promotionApiRequest.getAllPromotions({
        page: pagination.current,
        pageSize: pagination.pageSize,
        search: searchText,
      });
      setPromotions(response.data.$values);
      setPagination({
        ...pagination,
        total: response.data.totalCount || response.data.$values.length,
      });
    } catch (error) {
      console.error('Error fetching promotions:', error);
      message.error('Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await ProductApiRequest.getAllProducts(0, 100); // Fetch up to 100 products
      setProducts(response.data.$values || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleAddPromotion = () => {
    setModalType('add');
    form.resetFields();
    setSelectedProductIds([]);
    setModalVisible(true);
    // Fetch products when adding a new promotion
    fetchProducts();
  };

  const handleEditPromotion = (promotion) => {
    setModalType('edit');
    setSelectedPromotion(promotion);
    setSelectedProductIds(promotion.products.$values.map(product => product.id) || []);
    form.setFieldsValue({
      ...promotion,
      dateRange: [moment(promotion.startDate), moment(promotion.endDate)],
    });
    setModalVisible(true);
    // Fetch products when editing a promotion
    fetchProducts();
  };

  const handleViewPromotion = (promotion) => {
    setModalType('view');
    setSelectedPromotion(promotion);
    setSelectedProductIds(promotion.productIds || []);
    form.setFieldsValue({
      ...promotion,
      dateRange: [moment(promotion.startDate), moment(promotion.endDate)],
    });
    setModalVisible(true);
  };

  const handleDeletePromotion = async (promotionId) => {
    try {
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

      console.log('Promotion Data:', promotionData);

      // Add product IDs if type is Product
      if (values.type === 'Product' && selectedProductIds.length > 0) {
        promotionData.productIds = selectedProductIds;
      }

      if (modalType === 'add') {
        await promotionApiRequest.createPromotion(promotionData);
        message.success('Promotion added successfully');
      } else if (modalType === 'edit') {
        await promotionApiRequest.updatePromotion(selectedPromotion.id, promotionData);
        fetchPromotions();
        message.success('Promotion updated successfully');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving promotion:', error);
      message.error('Failed to save promotion');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
    });
  };

  const handleProductSelection = (selectedIds) => {
    setSelectedProductIds(selectedIds);
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
   
    {
      title: 'Discount',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (value) => `${value}%`,
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
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Ussage',
      dataIndex: 'ussage',
      key: 'usage',
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
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Search
              placeholder="Search promotions"
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={promotions}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
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
            label="Promotion Type"
            rules={[{ required: true, message: 'Please select promotion type' }]}
          >
            <Select 
              placeholder="Select promotion type"
              onChange={(value) => {
                if (value === 'Product' && products.length === 0) {
                  fetchProducts();
                }
              }}
            >
              <Option value="Product">Product</Option>
              <Option value="Order">Order</Option>
            </Select>
          </Form.Item>

          {/* Product selection when type is Product */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => 
              getFieldValue('type') === 'Product' ? (
                <Form.Item
                  label="Select Products"
                  rules={[{ required: true, message: 'Please select at least one product' }]}
                >
                  <Select
                    showSearch
                    mode="multiple"
                    allowClear
                    placeholder="Select products"
                    loading={productsLoading}
                    value={selectedProductIds}
                    onChange={handleProductSelection}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    optionLabelProp="label"
                    virtual={false} // Disable virtual scrolling to prevent display issues
                    maxTagCount={3} // Show only first 3 tags and "+X" for the rest
                    listHeight={300} // Increase the dropdown height
                  >
                    {products.map(product => (
                      <Option 
                        key={product.id} 
                        value={product.id}
                        label={product.name} // Add label for showing in selection
                      >
                        <Flex justifyContent="space-between" gap={8} align='center' style={{ height: 50 }}>
                          <Image src={product.imageUrl} width={50} height={50} preview={false} />
                          <Typography.Text>{product.name}</Typography.Text>
                        </Flex>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="discountPercentage"
            label="Discount Percentage"
            rules={[{ required: true, message: 'Please enter discount percentage' }]}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="Enter discount percentage"
              style={{ width: '100%' }}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
            />
          </Form.Item>

          <Form.Item
            name="customerLevel"
            label="Customer Level"
            rules={[{ required: true, message: 'Please select customer level' }]}
          >
            <Select placeholder="Select customer level">
              <Option value="Bronze">Bronze</Option>
              <Option value="Silver">Silver</Option>
              <Option value="Gold">Gold</Option>
              <Option value="Platinum">Platinum</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Promotion Period"
            rules={[{ required: true, message: 'Please select promotion period' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="ussage"
            label="Usage Limit"
            rules={[{ required: true, message: 'Please enter usage limit' }]}
          >
            <InputNumber
              min={1}
              placeholder="Enter usage limit"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Enter promotion description" />
          </Form.Item>

          <Form.Item
            name="isActive"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
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
