import React, { useState } from 'react';
import { Card, Typography, Tabs, Table, Button, Space, Input, Form, Modal, Select, Tag, Flex, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ProductAttribute = () => {
  const [attributeModalVisible, setAttributeModalVisible] = useState(false);
  const [attributeValueModalVisible, setAttributeValueModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  // Mock data for attributes
  const [attributes, setAttributes] = useState([
    { id: '1', name: 'Color', type: 'Select', required: true, categories: ['Electronics', 'Clothing'], status: 'Active' },
    { id: '2', name: 'Size', type: 'Select', required: true, categories: ['Clothing'], status: 'Active' },
    { id: '3', name: 'Material', type: 'Select', required: false, categories: ['Home & Kitchen', 'Clothing'], status: 'Active' },
    { id: '4', name: 'Weight', type: 'Number', required: false, categories: ['Electronics', 'Home & Kitchen'], status: 'Active' },
  ]);

  // Mock data for attribute values
  const [attributeValues, setAttributeValues] = useState([
    { id: '1', attributeId: '1', value: 'Red', status: 'Active' },
    { id: '2', attributeId: '1', value: 'Blue', status: 'Active' },
    { id: '3', attributeId: '1', value: 'Green', status: 'Active' },
    { id: '4', attributeId: '1', value: 'Black', status: 'Active' },
    { id: '5', attributeId: '2', value: 'S', status: 'Active' },
    { id: '6', attributeId: '2', value: 'M', status: 'Active' },
    { id: '7', attributeId: '2', value: 'L', status: 'Active' },
    { id: '8', attributeId: '2', value: 'XL', status: 'Active' },
    { id: '9', attributeId: '3', value: 'Cotton', status: 'Active' },
    { id: '10', attributeId: '3', value: 'Polyester', status: 'Active' },
    { id: '11', attributeId: '3', value: 'Wood', status: 'Active' },
    { id: '12', attributeId: '3', value: 'Metal', status: 'Active' },
  ]);

  // Mock data for categories
  const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Home & Kitchen' },
    { id: '4', name: 'Books' },
  ];

  // Attribute columns
  const attributeColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Required',
      dataIndex: 'required',
      key: 'required',
      render: (required) => (required ? 'Yes' : 'No'),
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories) => (
        <>
          {categories.map(category => (
            <Tag color="blue" key={category}>
              {category}
            </Tag>
          ))}
        </>
      ),
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
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditAttribute(record)}
          />
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDeleteAttribute(record.id)}
          />
          <Button 
            type="default" 
            size="small"
            onClick={() => handleManageValues(record)}
          >
            Manage Values
          </Button>
        </Space>
      ),
    },
  ];

  // Attribute value columns
  const attributeValueColumns = [
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
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
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditAttributeValue(record)}
          />
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDeleteAttributeValue(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Handle add attribute
  const handleAddAttribute = () => {
    setEditingRecord(null);
    form.resetFields();
    setAttributeModalVisible(true);
  };

  // Handle edit attribute
  const handleEditAttribute = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      categories: record.categories,
    });
    setAttributeModalVisible(true);
  };

  // Handle delete attribute
  const handleDeleteAttribute = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this attribute?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setAttributes(attributes.filter(item => item.id !== id));
        // Also delete related attribute values
        setAttributeValues(attributeValues.filter(item => item.attributeId !== id));
        message.success('Attribute deleted successfully');
      },
    });
  };

  // Handle attribute form submit
  const handleAttributeSubmit = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        setAttributes(attributes.map(item => 
          item.id === editingRecord.id ? { ...item, ...values } : item
        ));
        message.success('Attribute updated successfully');
      } else {
        const newAttribute = {
          id: Date.now().toString(),
          ...values,
        };
        setAttributes([...attributes, newAttribute]);
        message.success('Attribute added successfully');
      }
      setAttributeModalVisible(false);
    });
  };

  // Handle manage attribute values
  const handleManageValues = (attribute) => {
    setEditingRecord(attribute);
    setAttributeValueModalVisible(true);
  };

  // Handle add attribute value
  const handleAddAttributeValue = () => {
    form.resetFields();
    form.setFieldsValue({
      attributeId: editingRecord.id,
      status: 'Active',
    });
    Modal.confirm({
      title: 'Add Attribute Value',
      content: (
        <Form form={form} layout="vertical">
          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true, message: 'Please enter value' }]}
          >
            <Input placeholder="Enter value" />
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
          <Form.Item name="attributeId" hidden>
            <Input />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        form.validateFields().then(values => {
          const newValue = {
            id: Date.now().toString(),
            ...values,
          };
          setAttributeValues([...attributeValues, newValue]);
          message.success('Attribute value added successfully');
        });
      },
    });
  };

  // Handle edit attribute value
  const handleEditAttributeValue = (record) => {
    form.resetFields();
    form.setFieldsValue({
      ...record,
    });
    Modal.confirm({
      title: 'Edit Attribute Value',
      content: (
        <Form form={form} layout="vertical">
          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true, message: 'Please enter value' }]}
          >
            <Input placeholder="Enter value" />
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
      ),
      onOk: () => {
        form.validateFields().then(values => {
          setAttributeValues(attributeValues.map(item => 
            item.id === record.id ? { ...item, ...values } : item
          ));
          message.success('Attribute value updated successfully');
        });
      },
    });
  };

  // Handle delete attribute value
  const handleDeleteAttributeValue = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this attribute value?',
      content: 'This action cannot be undone.',
      onOk: () => {
        setAttributeValues(attributeValues.filter(item => item.id !== id));
        message.success('Attribute value deleted successfully');
      },
    });
  };

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Product Attributes</Title>
      </Flex>

      <Card>
        <Flex justify="space-between" style={{ marginBottom: 16 }}>
          <Input 
            placeholder="Search attributes" 
            prefix={<SearchOutlined />} 
            style={{ width: 300 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddAttribute}
          >
            Add Attribute
          </Button>
        </Flex>
        <Table 
          columns={attributeColumns} 
          dataSource={attributes} 
          pagination={{ pageSize: 10 }}
          rowKey="id"
        />
      </Card>

      {/* Attribute Modal */}
      <Modal
        title={editingRecord ? "Edit Attribute" : "Add Attribute"}
        open={attributeModalVisible}
        onCancel={() => setAttributeModalVisible(false)}
        onOk={handleAttributeSubmit}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Attribute Name"
            rules={[{ required: true, message: 'Please enter attribute name' }]}
          >
            <Input placeholder="Enter attribute name" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select type">
              <Option value="Text">Text</Option>
              <Option value="Number">Number</Option>
              <Option value="Select">Select</Option>
              <Option value="Boolean">Boolean</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="required"
            label="Required"
            valuePropName="checked"
          >
            <Select placeholder="Select if required">
              <Option value={true}>Yes</Option>
              <Option value={false}>No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="categories"
            label="Categories"
            rules={[{ required: true, message: 'Please select at least one category' }]}
          >
            <Select 
              mode="multiple" 
              placeholder="Select categories"
              optionFilterProp="children"
            >
              {categories.map(category => (
                <Option key={category.id} value={category.name}>{category.name}</Option>
              ))}
            </Select>
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

      {/* Attribute Values Modal */}
      <Modal
        title={`Manage Values for ${editingRecord?.name || ''}`}
        open={attributeValueModalVisible}
        onCancel={() => setAttributeValueModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAttributeValueModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddAttributeValue}
          >
            Add Value
          </Button>
        ]}
        width={700}
      >
        <Table 
          columns={attributeValueColumns} 
          dataSource={attributeValues.filter(item => item.attributeId === editingRecord?.id)} 
          pagination={{ pageSize: 5 }}
          rowKey="id"
        />
      </Modal>
    </div>
  );
};

export default ProductAttribute;
