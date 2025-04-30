import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, InputNumber, Select, Upload, App, Tag, Tooltip, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { VariantApiRequest, AttributeApiRequest, UploadApiRequest } from '../../../api/ApiRequests';

const { Option } = Select;

const ProductVariants = ({ productId, attributes }) => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { message } = App.useApp();

    useEffect(() => {
        if (productId) {
            fetchVariants();
        }
    }, [productId]);

    const fetchVariants = async () => {
        try {
            setLoading(true);
            const response = await VariantApiRequest.getVariantsByProductId(productId);
            const variantsData = response.data.$values || [];
            setVariants(variantsData);
            console.log(response.data)
        } catch (error) {
            message.error('Failed to fetch variants');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVariant = () => {
        setEditingVariant(null);
        setFileList([]);
        form.resetFields();
        
        // Set default values for attributes
        const initialValues = {};
        if (attributes && attributes.length > 0) {
            attributes.forEach(attr => {
                if (attr.attributeValues && attr.attributeValues.$values && attr.attributeValues.$values.length > 0) {
                    // Set the first attribute value as default for each attribute
                    initialValues[`attribute_${attr.id}`] = attr.attributeValues.$values[0].id;
                }
            });
        }
        
        if (Object.keys(initialValues).length > 0) {
            form.setFieldsValue(initialValues);
        }
        
        setModalVisible(true);
    };

    const handleEditVariant = (variant) => {
        setEditingVariant(variant);
        
        // Prepare form values with variant attributes
        const formValues = {
            sku: variant.sku,
            priceAdjustment: variant.priceAdjustment,
            ...formatAttributesForForm(variant.variantAttributes?.$values || [])
        };
        
        form.setFieldsValue(formValues);
        
        // Set file list for images
        if (variant.imageUrls && variant.imageUrls.length > 0) {
            setFileList(variant.imageUrls.map((url, index) => ({
                uid: `-${index}`,
                name: `variant-image-${index}.jpg`,
                status: 'done',
                url: url,
            })));
        } else {
            setFileList([]);
        }
        
        setModalVisible(true);
    };

    const formatAttributesForForm = (variantAttributes) => {
        const formattedAttributes = {};
        variantAttributes.forEach(attr => {
            formattedAttributes[`attribute_${attr.attributeId}`] = attr.attributeValueId;
        });
        return formattedAttributes;
    };

    const handleDeleteVariant = async (variantId) => {
        try {
            await VariantApiRequest.deleteVariant(variantId);
            message.success('Variant deleted successfully');
            fetchVariants();
        } catch (error) {
            message.error('Failed to delete variant');
            console.error(error);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            // Upload images if any
            let imageUrls = [];
            for (const file of fileList) {
                if (file.originFileObj) {
                    const formData = new FormData();
                    formData.append('file', file.originFileObj);
                    const uploadResponse = await UploadApiRequest.uploadImage(formData);
                    imageUrls.push(uploadResponse.data);
                } else if (file.url) {
                    imageUrls.push(file.url);
                }
            }
            
            // Prepare variant attributes
            const variantAttributes = [];
            Object.entries(values).forEach(([key, value]) => {
                if (key.startsWith('attribute_') && value) {
                    const attributeId = key.replace('attribute_', '');
                    variantAttributes.push({
                        attributeValueId: value,
                        attributeId: attributeId
                    });
                }
            });
            
            const variantData = {
                imageUrls,
                priceAdjustment: values.priceAdjustment || 0,
                isActive: true,
                sku: values.sku || `SKU-${Date.now()}`,
                productId,
                variantAttributes
            };
            
            if (editingVariant) {
                // Update existing variant
                variantData.id = editingVariant.id;
                await VariantApiRequest.updateVariant(variantData);
                message.success('Variant updated successfully');
            } else {
                // Create new variant
                await VariantApiRequest.createVariant(variantData);
                message.success('Variant added successfully');
            }
            
            setModalVisible(false);
            fetchVariants();
        } catch (error) {
            message.error('Failed to save variant');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrls',
            key: 'image',
            render: (imageUrls) => (
                imageUrls && imageUrls.$values.length > 0 ? (
                    <Image src={imageUrls.$values[0]} alt="Variant" style={{ width: 50, height: 50, objectFit: 'cover' }} />
                ) : null
            ),
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Price Adjustment',
            dataIndex: 'priceAdjustment',
            key: 'priceAdjustment',
            render: (price) => `$${price?.toFixed(2)}`,
        },
        {
            title: 'Attributes',
            dataIndex: 'variantAttributes',
            key: 'attributes',
            render: (variantAttributes) => (
                <Space size={[0, 8]} wrap>
                    {variantAttributes && variantAttributes.$values && variantAttributes.$values.map((attr) => (
                        <Tag color="blue" key={attr.id}>
                            {attr.attributeValue ? `${attr.attributeValue.value}` : 
                             attr.attribute ? `${attr.attribute.name}: ${attr.value}` : 
                             `Attribute: ${attr.value || 'Unknown'}`}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button 
                            icon={<EditOutlined />} 
                            onClick={() => handleEditVariant(record)} 
                            type="text"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDeleteVariant(record.id)} 
                            type="text" 
                            danger
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card 
            title="Product Variants" 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAddVariant}>Add Variant</Button>}
        >
            <Table 
                columns={columns} 
                dataSource={variants} 
                rowKey="id" 
                loading={loading}
                pagination={false}
            />
            
            <Modal
                title={editingVariant ? "Edit Variant" : "Add Variant"}
                open={modalVisible}
                onOk={handleModalOk}
                onCancel={() => setModalVisible(false)}
                confirmLoading={loading}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="sku"
                        label="SKU"
                        rules={[{ required: true, message: 'Please input the SKU!' }]}
                    >
                        <Input placeholder="Enter SKU" />
                    </Form.Item>
                    
                    <Form.Item
                        name="priceAdjustment"
                        label="Price Adjustment"
                        rules={[{ required: true, message: 'Please input the price adjustment!' }]}
                    >
                        <InputNumber
                            prefix="$"
                            min={0}
                            step={0.01}
                            style={{ width: '100%' }}
                            placeholder="Enter price adjustment"
                        />
                    </Form.Item>
                    
                    <Form.Item label="Images">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    
                    {attributes.map(attr => {
                        const attributeValues = attr.attributeValues?.$values || [];
                        // Get the first attribute value as default if available
                        const defaultValue = editingVariant?.variantAttributes?.$values[0].attributeValue.id;
                    
                        return (
                            <Form.Item
                                key={attr.id}
                                name={`attribute_${attr.id}`}
                                label={attr.name}
                                rules={[{ required: true, message: `Please select a ${attr.name}!` }]}
                                initialValue={defaultValue}
                            >
                                <Select 
                                placeholder={`Select ${attr.name}`}>
                                    {attributeValues.map(value => {
                                        // Special handling for color type attributes
                                        if (attr.type === 'Color') {
                                            
                                            return (
                                                <Option key={value.id} value={value.id}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div 
                                                            style={{ 
                                                                backgroundColor: value.value, 
                                                                width: '20px', 
                                                                height: '20px', 
                                                                marginRight: '8px',
                                                                border: '1px solid #d9d9d9',
                                                                borderRadius: '2px'
                                                            }} 
                                                        />
                                                        {typeof value.value === 'string' ? value.value : ''}
                                                    </div>
                                                </Option>
                                            );
                                        }
                                        
                                        return (
                                            <Option key={value.id} value={value.id}>
                                                {typeof value.value === 'string' ? value.value : ''}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        );
                    })}
                </Form>
            </Modal>
        </Card>
    );
};

export default ProductVariants;
