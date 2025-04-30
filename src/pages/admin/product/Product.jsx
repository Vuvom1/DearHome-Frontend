import { useState, useEffect } from 'react';
import { Table, Typography, Card, Button, Space, Tag, Breadcrumb, Switch, Input, App } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SettingOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import AddProduct from './AddProduct';
import { ProductApiRequest } from '../../../api/ApiRequests';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../constants/urls';
const Product = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await ProductApiRequest.getAllProducts();
            setProducts(response.data.$values || []);
        } catch (error) {
            message.error('Failed to fetch products');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search text
    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await ProductApiRequest.updateProductStatus(id, !currentStatus);
            fetchProducts();
            message.success('Product status updated successfully');
        } catch (error) {
            message.error('Failed to update product status');
            console.error(error);
        }
    };

    const handleDeleteProduct = (id) => {
        try {
            // Implement delete functionality
            ProductApiRequest.deleteProduct(id);
            fetchProducts();
            message.success('Product deleted successfully');
        } catch (error) {
            message.error('Failed to delete product');
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: '10%',
            render: (imageUrl) => (
                <img src={imageUrl} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: '15%',
            render: (_, record) => record.category?.name || 'N/A',
            filters: Array.from(new Set(products.map(p => p.category?.name))).filter(Boolean).map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.category?.name === value,
        },
        {
            title: 'Placement',
            dataIndex: 'placement',
            key: 'placement',
            width: '15%',
            render: (_, record) => record.placement?.name || 'N/A',
            filters: Array.from(new Set(products.map(p => p.placement?.name))).filter(Boolean).map(name => ({ text: name, value: name })),
            onFilter: (value, record) => record.placement?.name === value,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            render: (price) => `$${price.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (status) => (
                <Tag color={status === 'In Stock' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '15%',
            render: (isActive, record) => (
                <Switch 
                    checked={isActive} 
                    onChange={() => handleToggleStatus(record.id, isActive)}
                />
            )
        },
        {
            title: '',
            key: 'actions',
            width: '10%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        variant='outlined'
                        icon={<EditOutlined />}
                        onClick={() => navigate(`${URLS.ADMIN.PRODUCT_EDIT(record.id)}`)}
                    />

                    <Button
                        variant='outlined'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteProduct(record.id)}
                    />

                </Space>
            ),
        },
    ];

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item>Products</Breadcrumb.Item>
            </Breadcrumb>
            <Typography.Title style={{ marginTop: 0 }} level={2}>Products</Typography.Title>
            <Card
                extra={
                    <Space>
                        <Input.Search
                            placeholder="Search products..."
                            allowClear
                            style={{ width: 300 }}
                            onSearch={handleSearch}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Button type="primary" onClick={() => setIsAddProductModalOpen(true)}><PlusOutlined /> Add Product</Button>
                        <Button variant='text' icon={<ReloadOutlined />} onClick={fetchProducts} loading={loading} />
                        <Button variant='outlined' icon={<ExportOutlined />} />
                        <Button variant='outlined' icon={<SettingOutlined />} />
                        
                    </Space>
                }
            >

                <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        total: filteredProducts.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                />
            </Card>
            <AddProduct
                open={isAddProductModalOpen}
                onCancel={() => setIsAddProductModalOpen(false)}
                onSubmit={(values) => {
                    console.log('Form submitted with values:', values);
                    setIsAddProductModalOpen(false);
                    fetchProducts();
                }}
            />
        </>
    );
};

export default Product;
