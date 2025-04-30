import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Upload, Breadcrumb, Row, Col, Switch, Card, Flex, Typography, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ProductApiRequest, CategoryApiRequest, PlacementApiRequest, AttributeApiRequest, UploadApiRequest } from '../../../api/ApiRequests';
import ProductVariants from './ProductVariants';

const { Option } = Select;

const EditProduct = () => {
    const [productForm] = Form.useForm();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const params = useParams();
    const { id } = params;

    const [attributes, setAttributes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [product, setProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchProduct();
        fetchCategories();
        fetchPlacements();
    }, [id]);

    useEffect(() => {
        if (product) {
            productForm.setFieldsValue({
                name: product.name,
                description: product.description,
                basePrice: product.price,
                category: product.categoryId,
                placement: product.placementId,
                isAvailable: product.isActive,
            });
            
            if (product.imageUrl) {
                setFileList([{
                    uid: '-1',
                    name: 'product-image.jpg',
                    status: 'done',
                    url: product.imageUrl,
                }]);
            }
            
            if (product.categoryId) {
                setSelectedCategory(product.categoryId);
                // Fetch category-specific attributes when product loads
                fetchAttributesByCategoryId(product.categoryId);
            }
        }
    }, [product, productForm]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await ProductApiRequest.getProductById(id);
            setProduct(response.data);
        } catch (error) {
            message.error('Failed to fetch product');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await CategoryApiRequest.getAllCategories();
            const categoriesData = response.data.$values || [];
            setCategories(categoriesData);
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

    const fetchAttributesByCategoryId = async (categoryId) => {
        try {
            const response = await AttributeApiRequest.getWithAttributeValuesByCategoryId(categoryId);
            setAttributes(response.data.$values || []);
        } catch (error) {
            message.error('Failed to fetch attributes for this category');
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await productForm.validateFields();
            
            let imageUrl = product?.imageUrl || '';
            if (fileList.length > 0 && fileList[0].originFileObj) {
                const formData = new FormData();
                formData.append('file', fileList[0].originFileObj);
                
                if (product?.imageUrl) {
                    // Update existing image
                    const uploadResponse = await UploadApiRequest.updateImage(formData, product.imageUrl);
                    imageUrl = uploadResponse.data;
                } else {
                    // Upload new image
                    const uploadResponse = await UploadApiRequest.uploadImage(formData);
                    imageUrl = uploadResponse.data;
                }
            } else if (fileList.length > 0 && fileList[0].url) {
                // Keep the current image URL if no new file is uploaded
                imageUrl = product?.imageUrl;
            }

            // Prepare attribute values
            const attributeValues = [];
            if (selectedCategory) {
                attributes.forEach(attr => {
                    const value = values[attr.name];
                    if (value) {
                        attributeValues.push({
                            value,
                            attributeId: attr.id
                        });
                    }
                });
            }

            const productData = {
                id: id,
                imageUrl,
                name: values.name,
                price: values.basePrice,
                description: values.description,
                isActive: values.isAvailable,
                categoryId: values.category,
                placementId: values.placement,
                status: values.isAvailable ? 'Active' : 'Inactive',
            };

            await ProductApiRequest.updateProduct(productData);
            message.success('Product updated successfully');
            navigate('/admin/products');
        } catch (error) {
            message.error('Failed to update product');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        fetchAttributesByCategoryId(value);
    };

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleCancel = () => {
        navigate('/admin/products');
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
            
            {/* Product Form */}
            <Form
                form={productForm}
                layout="vertical"
                name="edit_product_form"
                onFinish={handleSubmit}
            >
                <Flex justify='space-between' align='center'>
                    <Typography>Edit Product</Typography>
                    <Flex gap={16}>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Save Changes
                        </Button>
                    </Flex>
                </Flex>
                <Row gutter={[8, 8]} style={{ marginTop: '10px' }}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Card title="Product Information" style={{ height: '100%' }}>
                            <Form.Item
                                name="image"
                                label="Product Image"
                                // rules={[{ required: true, message: 'Please upload product image!' }]}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    fileList={fileList}
                                    beforeUpload={() => false}
                                    onChange={handleFileChange}
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
                                    {categories.map(category => (
                                        <Option key={category.id} value={category.id}>{category.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="placement"
                                label="Placement"
                                rules={[{ required: true, message: 'Please select placement!' }]}
                            >
                                <Select placeholder="Select placement">
                                    {placements.map(placement => (
                                        <Option key={placement.id} value={placement.id}>{placement.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            
                        </Card>
                    </Col>
                </Row>
            </Form>

            {/* Product Variants */}
            <ProductVariants productId={id} attributes={attributes} style={{ marginTop: '10px' }} />
        </>
    );
};

export default EditProduct;
