import React, { useState } from 'react';
import { Tabs, Table, Button, Space, Tag, Input, Card, Typography, Flex } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileAddOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../constants/urls';

const { Title } = Typography;
const { TabPane } = Tabs;

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();

  // Mock data for product stock
  const productStockData = [
    {
      key: '1',
      sku: 'SKU001',
      name: 'Product A',
      category: 'Electronics',
      quantity: 25,
      status: 'In Stock',
      variants: [
        {
          key: '1',
          name: 'Variant 1',
          quantity: 10,
        },
        {
          key: '2',
          name: 'Variant 2',
          quantity: 15,
        },
      ],
    },
    {
      key: '2',
      sku: 'SKU002',
      name: 'Product B',
      category: 'Clothing',
      quantity: 5,
      status: 'Low Stock',
      variants: [
        {
          key: '1',
          name: 'Variant 1',
          quantity: 2,
        },
      ],
    },
    {
      key: '3',
      sku: 'SKU003',
      name: 'Product C',
      category: 'Home',
      quantity: 0,
      status: 'Out of Stock',
      variants: [
        {
          key: '1',
          name: 'Variant 1',
          quantity: 0,
        },  
        {
          key: '2',
          name: 'Variant 2',
          quantity: 0,
        },
      ],
    },
  ];

  // Mock data for goods received notes
  const grnData = [
    {
      key: '1',
      id: 'GRN001',
      date: '2023-05-15',
      supplier: 'Supplier A',
      items: 10,
      totalCost: 100,
      status: 'Received',
    },
    {
      key: '2',
      id: 'GRN002',
      date: '2023-05-20',
      supplier: 'Supplier B',
      items: 5,
      totalCost: 50,
      status: 'Pending',
    },
    {
      key: '3',
      id: 'GRN003',
      date: '2023-05-25',
      supplier: 'Supplier C',
      items: 8,
      totalCost: 80,
      status: 'Received',
    },
  ];

  // Product stock columns
  const productStockColumns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'Low Stock') {
          color = 'orange';
        } else if (status === 'Out of Stock') {
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  // GRN columns
  const grnColumns = [
    {
      title: 'GRN ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
        title: 'Total Cost',
        dataIndex: 'totalCost',
        key: 'totalCost',
        render: (cost) => `$${cost.toFixed(2)}`,
      },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Received' ? 'green' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} size="small" />
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Inventory Management</Title>
      </Flex>

      <Card>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
        >
          <TabPane tab="Product Stock" key="1">
            <Flex justify="space-between" style={{ marginBottom: 16 }}>
              <Input 
                placeholder="Search products" 
                prefix={<SearchOutlined />} 
                style={{ width: 300 }}
              />
              <Button type="primary" icon={<PlusOutlined />}>
                Add Product
              </Button>
            </Flex>
            <Table 
              columns={productStockColumns} 
              dataSource={productStockData} 
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: record => (
                  <Table 
                    columns={[
                      { title: 'Variant Name', dataIndex: 'name', key: 'name' },
                      { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' }
                    ]}
                    dataSource={record.variants}
                    pagination={false}
                    size="small"
                  />
                ),
                rowExpandable: record => record.variants && record.variants.length > 0
              }}
            />
          </TabPane>
          
          <TabPane tab="Goods Received Notes" key="2">
            <Flex justify="space-between" style={{ marginBottom: 16 }}>
              <Input 
                placeholder="Search GRN" 
                prefix={<SearchOutlined />} 
                style={{ width: 300 }}
              />
              <Flex gap={8}>   
                <Button 
                    type="primary" icon={<FileAddOutlined />} 
                    onClick={() => navigate(URLS.ADMIN.ADD_GOOD_RECEIVED_NOTE)}>
                    Create GRN
                </Button>
                <Button 
                    variant='outlined'
                    icon={<ReloadOutlined />}
                    onClick={() => {}}>

                    </Button>
                <Button 
                    variant="outlined" icon={<ExportOutlined />} 
                    onClick={() => {}}>
                </Button>
              </Flex>
            </Flex>
            <Table 
              columns={grnColumns} 
              dataSource={grnData} 
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Inventory;
