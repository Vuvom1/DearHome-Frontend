import React, { useState } from 'react';
import { Card, Typography, Tabs, Table, Button, Space, Input, Form, Modal, Select, Tag, Flex, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const CategoryAndPlacement = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [placementModalVisible, setPlacementModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  // Mock data for categories
  const [categories, setCategories] = useState([
    { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', status: 'Active', products: 24, priority: 1 },
    { id: '2', name: 'Clothing', slug: 'clothing', description: 'Apparel and fashion items', status: 'Active', products: 36, priority: 2 },
    { id: '3', name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Home decor and kitchen appliances', status: 'Active', products: 18, priority: 3 },
    { id: '4', name: 'Books', slug: 'books', description: 'Books and publications', status: 'Inactive', products: 12, priority: 4 },
  ]);

  // Mock data for placements
  const [placements, setPlacements] = useState([
    { id: '1', name: 'Homepage Featured', location: 'Homepage', priority: 1, status: 'Active', items: 8 },
    { id: '2', name: 'New Arrivals', location: 'Homepage', priority: 2, status: 'Active', items: 12 },
    { id: '3', name: 'Seasonal Offers', location: 'Category Page', priority: 1, status: 'Active', items: 6 },
    { id: '4', name: 'Clearance Sale', location: 'Product Page', priority: 3, status: 'Inactive', items: 15 },
  ]);

  // Category columns
  const categoryColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Active' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<ArrowUpOutlined />} 
            size="small"
            disabled={record.priority === 1}
            onClick={() => handleMoveCategory(record.id, 'up')}
          />
          <Button 
            icon={<ArrowDownOutlined />} 
            size="small"
            disabled={record.priority === categories.length}
            onClick={() => handleMoveCategory(record.id, 'down')}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditCategory(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger 
            onClick={() => handleDeleteCategory(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Placement columns
  const placementColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Active' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<ArrowUpOutlined />} 
            size="small"
            disabled={record.priority === 1}
            onClick={() => handleMovePlacement(record.id, 'up')}
          />
          <Button 
            icon={<ArrowDownOutlined />} 
            size="small"
            disabled={record.priority === placements.length}
            onClick={() => handleMovePlacement(record.id, 'down')}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditPlacement(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger 
            onClick={() => handleDeletePlacement(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Handle category operations
  const handleAddCategory = () => {
    setEditingRecord(null);
    form.resetFields();
    setCategoryModalVisible(true);
  };

  const handleEditCategory = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setCategories(categories.filter(category => category.id !== id));
        message.success('Category deleted successfully');
      },
    });
  };

  const handleCategorySubmit = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        // Update existing category
        setCategories(categories.map(category => 
          category.id === editingRecord.id ? { ...category, ...values } : category
        ));
        message.success('Category updated successfully');
      } else {
        // Add new category
        const newCategory = {
          id: Date.now().toString(),
          ...values,
          products: 0,
          priority: categories.length + 1,
        };
        setCategories([...categories, newCategory]);
        message.success('Category added successfully');
      }
      setCategoryModalVisible(false);
    });
  };

  // Handle moving categories up and down
  const handleMoveCategory = (id, direction) => {
    setCategories((items) => {
      const itemIndex = items.findIndex(item => item.id === id);
      const newItems = [...items];
      
      if (direction === 'up' && itemIndex > 0) {
        // Swap with the item above
        [newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];
      } else if (direction === 'down' && itemIndex < items.length - 1) {
        // Swap with the item below
        [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
      }
      
      // Update priorities
      return newItems.map((item, index) => ({
        ...item,
        priority: index + 1
      }));
    });
    
    message.success('Category order updated');
  };

  // Handle placement operations
  const handleAddPlacement = () => {
    setEditingRecord(null);
    form.resetFields();
    setPlacementModalVisible(true);
  };

  const handleEditPlacement = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setPlacementModalVisible(true);
  };

  const handleDeletePlacement = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this placement?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setPlacements(placements.filter(placement => placement.id !== id));
        message.success('Placement deleted successfully');
      },
    });
  };

  const handlePlacementSubmit = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        // Update existing placement
        setPlacements(placements.map(placement => 
          placement.id === editingRecord.id ? { ...placement, ...values } : placement
        ));
        message.success('Placement updated successfully');
      } else {
        // Add new placement
        const newPlacement = {
          id: Date.now().toString(),
          ...values,
          items: 0,
        };
        setPlacements([...placements, newPlacement]);
        message.success('Placement added successfully');
      }
      setPlacementModalVisible(false);
    });
  };

  // Handle moving placements up and down
  const handleMovePlacement = (id, direction) => {
    setPlacements((items) => {
      const itemIndex = items.findIndex(item => item.id === id);
      const newItems = [...items];
      
      if (direction === 'up' && itemIndex > 0) {
        // Swap with the item above
        [newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];
      } else if (direction === 'down' && itemIndex < items.length - 1) {
        // Swap with the item below
        [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
      }
      
      // Update priorities
      return newItems.map((item, index) => ({
        ...item,
        priority: index + 1
      }));
    });
    
    message.success('Placement order updated');
  };

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Categories & Placement</Title>
      </Flex>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Categories" key="1">
            <Flex justify="space-between" style={{ marginBottom: 16 }}>
              <Input 
                placeholder="Search categories" 
                prefix={<SearchOutlined />} 
                style={{ width: 300 }}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </Flex>
            <Table 
              columns={categoryColumns} 
              dataSource={categories.sort((a, b) => a.priority - b.priority)} 
              pagination={{ pageSize: 10 }}
              rowKey="id"
            />
          </TabPane>
          
          <TabPane tab="Placements" key="2">
            <Flex justify="space-between" style={{ marginBottom: 16 }}>
              <Input 
                placeholder="Search placements" 
                prefix={<SearchOutlined />} 
                style={{ width: 300 }}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddPlacement}
              >
                Add Placement
              </Button>
            </Flex>
            <Table 
              columns={placementColumns} 
              dataSource={placements.sort((a, b) => a.priority - b.priority)} 
              pagination={{ pageSize: 10 }}
              rowKey="id"
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Category Modal */}
      <Modal
        title={editingRecord ? "Edit Category" : "Add Category"}
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        onOk={handleCategorySubmit}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Please enter slug' }]}
          >
            <Input placeholder="Enter slug" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please enter priority' }]}
          >
            <Input type="number" min={1} placeholder="Enter priority" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Placement Modal */}
      <Modal
        title={editingRecord ? "Edit Placement" : "Add Placement"}
        open={placementModalVisible}
        onCancel={() => setPlacementModalVisible(false)}
        onOk={handlePlacementSubmit}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Placement Name"
            rules={[{ required: true, message: 'Please enter placement name' }]}
          >
            <Input placeholder="Enter placement name" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please select location' }]}
          >
            <Select placeholder="Select location">
              <Option value="Homepage">Homepage</Option>
              <Option value="Category Page">Category Page</Option>
              <Option value="Product Page">Product Page</Option>
              <Option value="Checkout Page">Checkout Page</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please enter priority' }]}
          >
            <Input type="number" min={1} placeholder="Enter priority" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryAndPlacement;
