import { useState } from 'react';
import { Table, Typography, Card, Button, Space, Tag, Breadcrumb, Switch, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, FilterOutlined, SettingOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import AddProduct from './AddProduct';
const Product = () => {
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    // Mock data - replace with actual API call
    const [products] = useState([
        {
            id: 1,
            image: 'https://placeholder.com/150',
            name: 'Product 1',
            category: 'Electronics',
            price: 999.99,
            status: 'In Stock',
            isAvailable: true,
            placement: 'Kitchen'
        },
        {
            id: 2,
            image: 'https://placeholder.com/150',
            name: 'Product 2',
            category: 'Clothing',
            price: 59.99,
            status: 'Low Stock',
            isAvailable: true,
            placement: 'Living Room'
        },
        // Add more mock products as needed
    ]);

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            width: '10%',
            render: (image) => (
                <img src={image} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
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
            filters: [
                { text: 'Electronics', value: 'Electronics' },
                { text: 'Clothing', value: 'Clothing' },
            ],
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Placement',
            dataIndex: 'placement',
            key: 'placement',
            width: '15%',
            filters: [
                { text: 'Kitchen', value: 'Kitchen' },
                { text: 'Living Room', value: 'Living Room' },
                { text: 'Bedroom', value: 'Bedroom' },
                { text: 'Bathroom', value: 'Bathroom' },
                { text: 'Office', value: 'Office' },
            ],
            onFilter: (value, record) => record.placement === value,
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
            title: 'Available',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            width: '15%',
            render: (isAvailable) => (
                <Switch checked={isAvailable} />
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
                        onClick={() => console.log('Edit', record.id)}
                    />

                    <Button
                        variant='outlined'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => console.log('Delete', record.id)}
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
                            onSearch={(value) => console.log(value)}
                        />
                        <Button type="primary" onClick={() => setIsAddProductModalOpen(true)}><PlusOutlined /> Add Product</Button>
                        <Button variant='text' icon={<ReloadOutlined />} />
                        <Button variant='outlined' icon={<ExportOutlined />} />
                        <Button variant='outlined' icon={<SettingOutlined />} />
                        
                    </Space>
                }
            >

                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{
                        total: products.length,
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
                }}
            />
        </>
    );
};

export default Product;
