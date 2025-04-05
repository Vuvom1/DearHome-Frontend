import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Upload, Breadcrumb, Row, Col, Switch, Card, Flex, Typography, Divider } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
const { Option } = Select;

const EditProduct = ({ open, onCancel, onSubmit }) => {
    const [form] = Form.useForm();
    const [attributes, setAttributes] = useState([]);

    const { id } = useParams();

    const initialValues = {
        name: 'Product Name',
        description: 'Product Description',
        basePrice: 100,
        category: 'Electronics',
        placement: 'Kitchen',
        isAvailable: true,

    }

    const variants = [
        {
            name: 'Variant 1',
            price: 100,
            stock: 100,
            images: ['image1.jpg', 'image2.jpg'],
            attributes: {
                Color: 'Black',
                Size: 'M',
                Material: 'Cotton'
            },
            priceAdjustment: 10
        },
        {
            name: 'Variant 2',
            price: 100,
            stock: 100,
            images: ['image1.jpg', 'image2.jpg'],
            attributes: {
                Color: 'White',
                Size: 'L',
                Material: 'Polyester'
            },
            priceAdjustment: 10
        }
    ]

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

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            if (initialValues.category) {
                handleCategoryChange(initialValues.category);
            }
        }
    }, [initialValues, form]);

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
    };

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/admin/products">Products</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to={`/admin/products/edit/${id}`}>Edit Product</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Form
                form={form}
                layout="vertical"
                name="edit_product_form"
                onFinish={handleSubmit}
            >
                <Flex justify='space-between' align='center'>
                    <Typography>Edit Product</Typography>
                    <Flex gap={16}>
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Flex>
                </Flex>
                <Row gutter={[8, 8]} style={{ marginTop: '10px' }}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Card title="Product Infomation" style={{ height: '100%' }}>
                            <Form.Item
                                name="image"
                                label="Product Image"
                                rules={[{ required: true, message: 'Please upload product image!' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    onChange={() => { }}
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
                                layout='horizontal'
                                name="isAvailable"
                                label="Available"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Card title="Product Specification" style={{ height: '100%' }}>
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



                            {attributes.length > 0 && attributes.map((attribute) => (
                                <Form.Item
                                    key={attribute.label}
                                    name={attribute.label}
                                    label={attribute.label}
                                    rules={[{ required: true, message: 'Please select attribute!' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select attribute values"
                                        style={{ width: '100%' }}
                                    >
                                        {attribute.values.map((value) => (
                                            <Option key={value} value={value}>{value}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ))}
                        </Card>
                    </Col>

                </Row>


                <Card
                    extra={<Button variant='text' htmlType="submit"><PlusOutlined /> Add Variant</Button>}
                    title="Product Variants" style={{ marginTop: '10px' }}>
                    <Flex vertical align='start'>
                        {
                            variants.map((variant) => (
                                <>
                                    <Row key={variant.name} gutter={[16, 16]} style={{ width: '100%' }}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Upload
                                                listType="picture-card"
                                                maxCount={1}
                                                beforeUpload={() => false}
                                                onChange={() => { }}
                                            >
                                                <Button variant='text' icon={<UploadOutlined />}></Button>
                                            </Upload>
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                                            <Row gutter={[16, 16]}>
                                                {
                                                    Object.entries(variant.attributes).map(([key, value]) => (
                                                        <>
                                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                <Form.Item
                                                                    key={key}
                                                                    name={`variant.${variant.name}.${key}`}
                                                                    label={key}
                                                                    rules={[{ required: true, message: 'Please input price!' }]}
                                                                >
                                                                    <Input placeholder="Enter attribute value" />
                                                                </Form.Item>
                                                            </Col>

                                                        </>
                                                    ))}

                                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                    <Form.Item
                                                        name={`variant.${variant.name}.price`}
                                                        label="Price Adjustment"
                                                        rules={[{ required: true, message: 'Please input price!' }]}
                                                    >
                                                        <InputNumber
                                                            prefix="$"
                                                            min={0}
                                                            step={0.01}
                                                            style={{ width: '100%' }}
                                                            placeholder="Enter price adjustment"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Divider />
                                </>
                            ))
                        }
                    </Flex>
                </Card>

            </Form>
        </>
    );
};

export default EditProduct;
