import React, { useState, useEffect } from 'react';
import { Card, Typography, Tabs, Table, Button, Space, Input, Form, Modal, Select, Tag, Flex, App, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import apiInstance from '../../../api/ApiInstance';
import { CategoryApiRequest, AttributeApiRequest, UploadApiRequest, PlacementApiRequest } from '../../../api/ApiRequests';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const CategoryAndPlacement = () => {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState('1');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [placementModalVisible, setPlacementModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [attributesLoading, setAttributesLoading] = useState(false);
  const [placementsLoading, setPlacementsLoading] = useState(false);

  // State for data
  const [categories, setCategories] = useState([]);

  // State for placements
  const [placements, setPlacements] = useState([]);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await CategoryApiRequest.getAllWithParentAndAttributes();
      const categoriesData = response.data.$values || [];

      setCategories(categoriesData);
      setParentCategories(
        categoriesData.filter(cat => !cat.parentCategoryId)
      );
    } catch (error) {
      message.error('Failed to fetch categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch placements
  const fetchPlacements = async () => {
    setPlacementsLoading(true);
    try {
      const response = await PlacementApiRequest.getAllPlacements();
      setPlacements(response.data.$values || []);
    } catch (error) {
      message.error('Failed to fetch placements');
      console.error(error);
    } finally {
      setPlacementsLoading(false);
    }
  };

  // Fetch attributes
  const fetchAttributes = async () => {
    setAttributesLoading(true);
    try {
      const response = await AttributeApiRequest.getAllAttributes();
      setAttributes(response.data.$values || []);
    } catch (error) {
      message.error('Failed to fetch attributes');
      console.error(error);
    } finally {
      setAttributesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAttributes();
    fetchPlacements();
  }, []);

  // Filter categories based on search text
  const filteredCategories = Array.isArray(categories)
    ? categories.filter(cat =>
      cat.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];

  // Category columns
  const categoryColumns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => imageUrl ? <Image src={imageUrl} width={50} /> : 'No image',
    },
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
      title: '',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
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

    // Extract attribute IDs from the categoryAttributes array
    const attributes = record.categoryAttributes?.$values?.map(ca => ca.attribute?.id) || [];

    form.setFieldsValue({
      ...record,
      categoryAttributes: attributes
    });

    setCategoryModalVisible(true);
  };

  const handleDeleteCategory = (id) => {
    setDeleteCategoryId(id);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteCategoryConfirm = async () => {
    setDeleting(true);
    try {
      await CategoryApiRequest.deleteCategory(deleteCategoryId);
      fetchCategories();
      message.success('Category deleted successfully');
    } catch (error) {
      message.error('Failed to delete category');
      console.error(error);
    } finally {
      setDeleteConfirmVisible(false);
      setDeleting(false);
    }
  };


  const handleCategorySubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Transform the selected attributes into the required format
      const categoryAttributes = values.categoryAttributes?.map(attributeId => ({
        attributeId,
        id: editingRecord ? editingRecord.categoryAttributes?.$values?.find(ca => ca.attribute.id === attributeId)?.id : undefined
      })) || [];

      // Handle image upload
      let imageUrl = editingRecord?.imageUrl;

      if (values.image && values.image.fileList && values.image.fileList.length > 0) {
        const file = values.image.fileList[0].originFileObj;

        if (editingRecord && editingRecord.imageUrl) {
          // Create form data for image update
          const formData = new FormData();
          formData.append('file', file);
          // Update existing image
          const response = await UploadApiRequest.updateImage(formData, editingRecord.imageUrl);
          imageUrl = response.data;
        } else {
          // Create form data for new image upload
          const formData = new FormData();
          formData.append('file', file);
          // Upload new image
          const response = await UploadApiRequest.uploadImage(formData);
          imageUrl = response.data;

        }
      }

      const categoryData = {
        ...values,
        categoryAttributes,
        imageUrl: imageUrl
      };

      // Remove the file object before sending to API
      delete categoryData.image;

      if (editingRecord) {
        // Update existing category
        await CategoryApiRequest.updateCategory(categoryData);
        message.success('Category updated successfully');
      } else {
        // Add new category
        await CategoryApiRequest.createCategory(categoryData);
        message.success('Category added successfully');
      }

      setCategoryModalVisible(false);
      fetchCategories();
    } catch (error) {
      if (!error.errorFields) {
        message.error('Failed to save category');
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
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
      onOk: async () => {
        try {
          await PlacementApiRequest.deletePlacement(id);
          fetchPlacements();
          message.success('Placement deleted successfully');
        } catch (error) {
          message.error('Failed to delete placement');
          console.error(error);
        }
      },
    });
  };

  const handlePlacementSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      if (editingRecord) {
        // Update existing placement
        await PlacementApiRequest.updatePlacement(values);
        message.success('Placement updated successfully');
      } else {
        // Add new placement
        await PlacementApiRequest.createPlacement(values);
        message.success('Placement added successfully');8
      }
      
      setPlacementModalVisible(false);
      fetchPlacements();
    } catch (error) {
      if (!error.errorFields) {
        message.error('Failed to save placement');
        console.error(error);
      }
    } finally {
      setSubmitting(false);
    }
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

      return newItems;
    });

    message.success('Placement order updated');
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchText(e.target.value);
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
                value={searchText}
                onChange={handleSearch}
              />
              <Flex gap={8}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddCategory}
                >
                  Add Category
                </Button>

                <Button
                  variant="outlined"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    fetchCategories();
                  }}
                  loading={loading}
                >
                </Button>
              </Flex>

            </Flex>
            <Table
              columns={categoryColumns}
              dataSource={filteredCategories}
              pagination={{ pageSize: 10 }}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      showHeader={false}
                      columns={categoryColumns}
                      dataSource={record.subCategories?.$values || []}
                      rowKey="id"
                      pagination={false}
                      style={{ margin: 0 }}
                    />
                  );
                },
                expandRowByClick: true,
                rowExpandable: (record) =>
                  record.subCategories?.$values &&
                  record.subCategories.$values.length > 0
              }}
            />
          </TabPane>

          <TabPane tab="Placements" key="2">
            <Flex justify="space-between" style={{ marginBottom: 16 }}>
              <Input
                placeholder="Search placements"
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
              />
              <Flex gap={8}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                onClick={handleAddPlacement}
              >
                  Add Placement
                </Button>
                <Button
                  variant="outlined"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    fetchPlacements();
                  }}
                  loading={placementsLoading}
                >
                </Button>
              </Flex>
            </Flex>
            <Table
              columns={placementColumns}
              dataSource={placements}
              pagination={{ pageSize: 10 }}
              rowKey="id"
              loading={placementsLoading}
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
        confirmLoading={submitting}
        destroyOnClose
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="id"
            label="Category ID"
            hidden
          >
            <Input placeholder="Category ID" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Category Image"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={(file) => false}
              onChange={(fileList) => {
                if (fileList.length > 0) {
                  form.setFieldsValue({
                    image: fileList[0],
                  });
                }
              }}
            >
              {editingRecord?.imageUrl && (
                <div style={{ position: 'relative' }}>
                  <Image src={editingRecord.imageUrl} width={100} />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.5)',
                      padding: '4px',
                      borderRadius: '0 0 0 4px'
                    }}
                  >
                    <EditOutlined style={{ color: 'white' }} />
                  </div>
                </div>
              )}
              {(!editingRecord?.imageUrl || (editingRecord?.imageUrl?.fileList?.length === 0)) && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

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
            name="parentCategoryId"
            label="Parent Category"
          >
            <Select placeholder="Select parent category" allowClear loading={loading}>
              {Array.isArray(parentCategories) ? parentCategories.map(category => (
                // Don't allow a category to select itself as parent
                editingRecord && category.id === editingRecord.id ? null :
                  <Option key={category.id} value={category.id}>{category.name}</Option>
              )).filter(Boolean) : null}
            </Select>
          </Form.Item>
          <Form.Item
            name="categoryAttributes"
            label="Attributes"
          >
            <Select
              mode="multiple"
              placeholder="Select attributes"
              allowClear
              style={{ width: '100%' }}
              loading={attributesLoading}
            >
              {attributes.map(attr => (
                <Option key={attr.id} value={attr.id}>{attr.name}</Option>
              ))}
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
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Category"
        open={deleteConfirmVisible}
        onCancel={() => setDeleteConfirmVisible(false)}
        onOk={() => handleDeleteCategoryConfirm(deleteCategoryId)}
        confirmLoading={deleting}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </div>
  );
};

export default CategoryAndPlacement;
