import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button, Space, Typography, Upload } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';


const { Option } = Select;

const AddProduct = ({ open, onCancel, onSubmit }) => {
    const [form] = Form.useForm();
    const [attributes, setAttributes] = useState([]);

    const attributeOptions = [
        {
            category: 'Electronics',
            attributes: [
                { label: 'Brand', values: ['Apple', 'Samsung', 'Sony', 'LG'] },
                { label: 'Color', values: ['Black', 'White', 'Silver', 'Gold'] },
                { label: 'Storage', values: ['64GB', '128GB', '256GB', '512GB'] },
                { label: 'Warranty', values: ['1 Year', '2 Years', '3 Years'] }
            ]
        },
        {
            category: 'Clothing',
            attributes: [
                { label: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
                { label: 'Color', values: ['Black', 'White', 'Red', 'Blue'] },
                { label: 'Material', values: ['Cotton', 'Polyester', 'Wool', 'Silk'] },
                { label: 'Style', values: ['Casual', 'Formal', 'Sports'] }
            ]
        },
        {
            category: 'Furniture',
            attributes: [
                { label: 'Material', values: ['Wood', 'Metal', 'Glass', 'Plastic'] },
                { label: 'Color', values: ['Brown', 'Black', 'White', 'Grey'] },
                { label: 'Style', values: ['Modern', 'Classic', 'Rustic'] },
                { label: 'Assembly', values: ['Required', 'Pre-assembled'] }
            ]
        },
        {
            category: 'Books',
            attributes: [
                { label: 'Format', values: ['Hardcover', 'Paperback', 'E-book'] },
                { label: 'Language', values: ['English', 'Spanish', 'French'] },
                { label: 'Genre', values: ['Fiction', 'Non-fiction', 'Academic'] },
                { label: 'Condition', values: ['New', 'Used'] }
            ]
        }
    ];

    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                onSubmit(values);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCategoryChange = (value) => {
        const categoryAttributes = attributeOptions.find(option => option.category === value)?.attributes || [];
        setAttributes(categoryAttributes);
        
        // Clear previous attribute values when category changes
        const previousAttributes = form.getFieldValue('attributes');
        if (previousAttributes) {
            form.setFieldsValue({
                ...Object.fromEntries(categoryAttributes.map(attr => [attr.label, undefined]))
            });
        }
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
        >
            <Form
                form={form}
                layout="vertical"
                name="add_product_form"
            >
                <Form.Item
                    name="image"
                    label="Product Image"
                    rules={[{ required: true, message: 'Please upload product image!' }]}
                >
                    <Upload
                        listType="picture-card"
                        maxCount={1}
                        beforeUpload={() => false}
                        onChange={() => {}}
                    >
                        <Button variant="text" icon={<UploadOutlined />}></Button>
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
                    name="basePrice"
                    label="Base Price"
                    rules={[{ required: true, message: 'Please input base price!' }]}
                >
                    <InputNumber
                        prefix="$"
                        min={0}
                        step={0.01}
                        style={{ width: '100%' }}
                        placeholder="Enter base price"
                    />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category!' }]}
                >
                    <Select 
                        placeholder="Select category"
                        onChange={handleCategoryChange}
                    >
                        <Option value="Electronics">Electronics</Option>
                        <Option value="Clothing">Clothing</Option>
                        <Option value="Furniture">Furniture</Option>
                        <Option value="Books">Books</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="placement"
                    label="Placement"
                    rules={[{ required: true, message: 'Please select placement!' }]}
                >
                    <Select placeholder="Select placement">
                        <Option value="Kitchen">Kitchen</Option>
                        <Option value="Living Room">Living Room</Option>
                        <Option value="Bedroom">Bedroom</Option>
                        <Option value="Bathroom">Bathroom</Option>
                        <Option value="Office">Office</Option>
                    </Select>
                </Form.Item>

                <Typography.Text strong>Attributes</Typography.Text>
                { attributes.length > 0 && attributes.map((attribute) => (
                    <Form.Item
                        key={attribute.label}
                        name={attribute.label}
                        label={attribute.label}
                        rules={[{ required: true, message: 'Please select attribute!' }]}
                    >
                        <Select placeholder="Select attribute">
                            {attribute.values.map((value) => (
                                <Option key={value} value={value}>{value}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    );
};

export default AddProduct;
