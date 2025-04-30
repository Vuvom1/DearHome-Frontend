import React, { useState, useEffect } from 'react';
import { Card, Typography, Tabs, Table, Button, Space, Input, Form, Modal, Select, Tag, Flex, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { AttributeApiRequest } from '../../../api/ApiRequests';
import AttributeTypes from '../../../constants/attributeTypes';
const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ProductAttribute = () => {
  const { message } = App.useApp();

  const [attributeModalVisible, setAttributeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAttributeId, setSelectedAttributeId] = useState(null);

  // State for data
  const [attributes, setAttributes] = useState([]);
  const [searchText, setSearchText] = useState('');

  // Fetch attributes
  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await AttributeApiRequest.getAllWithAttributeValues();
      setAttributes(response.data.$values);
    } catch (error) {
      message.error('Failed to fetch attributes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      title: 'Values',
      dataIndex: 'attributeValues',
      key: 'attributeValues',
      render: (attributeValues, record) => {
        if (!attributeValues || !attributeValues.$values || attributeValues.$values.length === 0) {
          return <span>No values</span>;
        }
        
        // If there are many values, show only the first few with a count
        const maxDisplayValues = 3;
        const totalValues = attributeValues.$values.length;
        const displayValues = attributeValues.$values.slice(0, maxDisplayValues);
        
        return (
          <Space wrap>
            {displayValues.map(val => (
              record.type === AttributeTypes.Color ? 
              <Tag 
                key={val.id} 
                color={val.value} 
                style={{ 
                  color: isLightColor(val.value) ? '#000' : '#fff',
                  border: '1px solid #d9d9d9'
                }}
              >
                {val.value}
              </Tag> :
              <Tag key={val.id}>{val.value}</Tag>
            ))}
            {totalValues > maxDisplayValues && (
              <Tag>+{totalValues - maxDisplayValues} more</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            variant='outlined'
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditAttribute(record)}
          />
          <Button 
            variant='outlined'
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => {
              setSelectedAttributeId(record.id);
              setDeleteModalVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

  // Helper function to determine if a color is light or dark
  const isLightColor = (color) => {
    // Convert hex to RGB
    let hex = color.replace('#', '');
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate brightness (using YIQ formula)
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  // Handle add attribute
  const handleAddAttribute = () => {
    setEditingRecord(null);
    form.resetFields();
    setAttributeModalVisible(true);
  };

  // Handle edit attribute
  const handleEditAttribute = (record) => {
    setEditingRecord(record);
    
    // Convert attribute values to form field list format
    const attributeValuesList = record.attributeValues?.$values?.map(v => ({ value: v.value })) || [];
    
    form.setFieldsValue({
      ...record,
      attributeValuesList: attributeValuesList.length > 0 ? attributeValuesList : [{ value: '' }]
    });
    
    setAttributeModalVisible(true);
  };

  // Handle delete attribute
  const handleDeleteAttribute = async (id) => {
    try {
      await AttributeApiRequest.deleteAttribute(id);
      message.success('Attribute deleted successfully');
      fetchAttributes(); // Refresh the list
    } catch (error) {
      message.error('Failed to delete attribute');
      console.error(error);
    }
  };

  // Handle attribute form submit
  const handleAttributeSubmit = async () => {
    try {
      setSubmitLoading(true);
      const values = await form.validateFields();
      
      // Prepare attribute values from the list
      let attributeData = {
        id: values.id,
        name: values.name,
        type: values.type,
      };
      
      if (values.attributeValuesList && values.attributeValuesList.length > 0) {
         attributeData = {
          ...attributeData,
          attributeValues: values.attributeValuesList
         }
          
          
      }
      
      if (editingRecord) {
        await AttributeApiRequest.updateAttribute(attributeData);
        message.success('Attribute updated successfully');
      } else {
        await AttributeApiRequest.createAttribute(attributeData);
        message.success('Attribute added successfully');
      }
      
      setAttributeModalVisible(false);
      fetchAttributes(); // Refresh the list
    } catch (error) {
      if (!error.errorFields) {
        message.error('Failed to save attribute');
        console.error(error);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter attributes based on search text
  const filteredAttributes = attributes.filter(attr => 
    attr.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle type change to reset attribute values
  const handleTypeChange = (value) => {
    // Reset attribute values when type changes
    form.setFieldsValue({
      attributeValuesList: [{ value: '' }]
    });
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

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
            value={searchText}
            onChange={handleSearch}
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
          dataSource={filteredAttributes} 
          pagination={{ pageSize: 10 }}
          rowKey="id"
          loading={loading}
        />
      </Card>

      {/* Attribute Modal */}
      <Modal
        title={editingRecord ? "Edit Attribute" : "Add Attribute"}
        open={attributeModalVisible}
        onCancel={() => setAttributeModalVisible(false)}
        onOk={handleAttributeSubmit}
        confirmLoading={submitLoading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="id"
            label="Attribute ID"
            hidden
          >
          </Form.Item>
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
            <Select 
              placeholder="Select type"
              onChange={handleTypeChange}
            >
              {Object.values(AttributeTypes).map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.List name="attributeValuesList" initialValue={[{ value: '' }]}>
            {(fields, { add, remove }) => (
              <>
                <Form.Item label="Attribute Values">
                  {fields.map((field, index) => (
                    <Flex key={field.key} align="center" style={{ marginBottom: 8 }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'value']}
                        noStyle
                        rules={[
                          { 
                            required: form.getFieldValue('type') === AttributeTypes.Select || 
                                      form.getFieldValue('type') === AttributeTypes.MultiSelect || 
                                      form.getFieldValue('type') === AttributeTypes.Color, 
                            message: 'Please enter a value',
                            validator: (_, value) => {
                              // For color inputs, the default value '#000000' should be considered valid
                              if (form.getFieldValue('type') === AttributeTypes.Color && value) {
                                return Promise.resolve();
                              }
                              
                              // For other types that require values
                              if ((form.getFieldValue('type') === AttributeTypes.Select || 
                                  form.getFieldValue('type') === AttributeTypes.MultiSelect) && 
                                  (!value || value.trim() === '')) {
                                return Promise.reject('Please enter a value');
                              }
                              
                              return Promise.resolve();
                            }
                          }
                        ]}
                      >
                        {form.getFieldValue('type') === AttributeTypes.Color ? (
                          <Input 
                            type="color" 
                            placeholder="Select color" 
                            style={{ width: '100%', height: '32px', padding: '0 5px' }} 
                            defaultValue="#000000"
                          />
                        ) : (
                          <Input placeholder="Enter attribute value" style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          style={{ marginLeft: 8 }}
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Flex>
                  ))}
                </Form.Item>
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                  >
                    Add Value
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      <Modal
        title="Delete Attribute"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={() => handleDeleteAttribute(selectedAttributeId)}
      > 
        <p>Are you sure you want to delete this attribute?</p>
      </Modal>
    </div>
  );
};

export default ProductAttribute;
