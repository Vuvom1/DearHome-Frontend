import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Switch, Upload, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CategoryApiRequest, PlacementApiRequest, AttributeApiRequest, UploadApiRequest, ProductApiRequest } from '../../../api/ApiRequests';

const { Option } = Select;

const AddProduct = ({ open, onCancel, onSubmit }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [categories, setCategories] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchPlacements();
        fetchAttributes();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await CategoryApiRequest.getAllWithParentAndAttributes();
            setCategories(response.data.$values || []);
        } catch (error) {
            message.error('Failed to fetch categories');
            console.error(error);
        }
    };

    const fetchPlacements = async () => {
        try {
            const response = await PlacementApiRequest.getAllPlacements();
            setPlacements(response.data.$values || []);
        } catch (error) {
            message.error('Failed to fetch placements');
            console.error(error);
        }
    };

    const fetchAttributes = async () => {
        try {
            const response = await AttributeApiRequest.getAllAttributes();
            setAttributes(response.data.$values || []);
        } catch (error) {
            message.error('Failed to fetch attributes');
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            
            let imageUrl = '';
            if (fileList.length > 0) {
                const formData = new FormData();
                formData.append('file', fileList[0].originFileObj);
                const uploadResponse = await UploadApiRequest.uploadImage(formData);
                imageUrl = uploadResponse.data;
            }

            // Prepare attribute values
            const attributeValues = [];
            if (selectedCategory) {
                const categoryAttributes = categories.find(c => c.id === selectedCategory)?.attributes?.$values || [];
                
                categoryAttributes.forEach(attr => {
                    const value = values[`attribute_${attr.id}`];
                    if (value) {
                        attributeValues.push({
                            value,
                            attributeId: attr.id
                        });
                    }
                });
            }

            const productData = {
                imageUrl,
                name: values.name,
                price: values.price,
                description: values.description,
                isActive: values.isActive !== false, // Default to true if undefined
                categoryId: values.categoryId,
                placementId: values.placementId,
                status: values.isActive !== false ? 'Active' : 'Inactive',
                attributeValues
            };

            await ProductApiRequest.createProduct(productData).then(
                (response) => {
                    message.success('Product created successfully');
                    onSubmit(productData);
                    form.resetFields();
                    setFileList([]);
                    setSelectedCategory(null);
                },
                (error) => {
                    message.error('Failed to create product');
                    console.error(error);
                }
            );
        } catch (error) {
            console.error('Validation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        form.resetFields(['attributeValues']);
    };

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const getCategoryAttributes = () => {
        if (!selectedCategory) return [];
        const category = categories.find(c => c.id === selectedCategory);
        return category?.attributes?.$values || [];
    };

    return (
        <Modal
            open={open}
            title="Add New Product"
            okText="Add"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={handleSubmit}
            width={800}
            confirmLoading={loading}
        >
            <Form
                form={form}
                layout="vertical"
                name="add_product_form"
                initialValues={{ isActive: true }}
            >
                <Form.Item
                    name="image"
                    label="Product Image"
                    rules={[{ required: true, message: 'Please upload product image!' }]}
                >
                    <Upload
                        listType="picture-card"
                        maxCount={1}
                        fileList={fileList}
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                        
                    >
                        <UploadOutlined />
                    </Upload>
                </Form.Item>
                
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: 'Please input product name!' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input product description!' }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter product description" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please input price!' }]}
                >
                    <InputNumber
                        prefix="$"
                        min={0}
                        step={0.01}
                        style={{ width: '100%' }}
                        placeholder="Enter price"
                    />
                </Form.Item>

                <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category!' }]}
                >
                    <Select 
                        placeholder="Select category"
                        onChange={handleCategoryChange}
                    >
                        {categories.map(category => (
                            <Option key={category.id} value={category.id}>{category.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="placementId"
                    label="Placement"
                    rules={[{ required: true, message: 'Please select placement!' }]}
                >
                    <Select placeholder="Select placement">
                        {placements.map(placement => (
                            <Option key={placement.id} value={placement.id}>{placement.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="isActive"
                    label="Status"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                </Form.Item>

                {getCategoryAttributes().length > 0 && (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <h3>Attributes</h3>
                        </div>
                        {getCategoryAttributes().map(attribuste => (
                            <Form.Item
                                key={attribute.id}
                                name={`attribute_${attribute.id}`}
                                label={attribute.name}
                                rules={[{ required: true, message: `Please select ${attribute.name}!` }]}
                            >
                                <Select placeholder={`Select ${attribute.name}`}>
                                    {attribute.values?.$values?.map(value => (
                                        <Option key={value} value={value}>{value}</Option>
                                    )) || []}
                                </Select>
                            </Form.Item>
                        ))}
                    </>
                )}
            </Form>
        </Modal>
    );
};

export default AddProduct;
