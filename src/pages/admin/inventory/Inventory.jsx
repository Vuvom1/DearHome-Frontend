import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Space, Tag, Input, Card, Typography, Flex, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileAddOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../constants/urls';
import { productApiRequest, goodReceivedNoteApiRequest } from '../../../api/ApiRequests';

const { Title } = Typography;
const { TabPane } = Tabs;

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [goodsReceivedNotes, setGoodsReceivedNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchGoodsReceivedNotes();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApiRequest.getAllWithVariants();
      if (response.data && response.data.$values) {
        const formattedProducts = response.data.$values.map((product, index) => {
          const variants = product.variants && product.variants.$values 
            ? product.variants.$values.map((variant, vIndex) => ({
                key: vIndex.toString(),
                name: variant.sku || `Variant ${vIndex + 1}`,
                quantity: variant.stock || 0,
                id: variant.id
              }))
            : [];
          
          let status = 'In Stock';
          if (variants.length === 0 || variants.every(v => v.quantity === 0)) {
            status = 'Out of Stock';
          } else if (variants.some(v => v.quantity <= 5)) {
            status = 'Low Stock';
          }
          
          const totalQuantity = variants.reduce((sum, variant) => sum + variant.quantity, 0);
          
          return {
            key: index.toString(),
            id: product.id,
            sku: variants.length > 0 ? variants[0].name : 'N/A',
            name: product.name,
            category: product.category?.name || 'Uncategorized',
            quantity: totalQuantity,
            status: status,
            variants: variants,
          };
        });
        
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchGoodsReceivedNotes = async () => {
    try {
      setLoading(true);
      const response = await goodReceivedNoteApiRequest.getAllGoodReceivedNotes();
      if (response.data && response.data.$values) {
        const formattedGRNs = response.data.$values.map((grn, index) => {
          const items = grn.goodReceivedItems && grn.goodReceivedItems.$values 
            ? grn.goodReceivedItems.$values.length 
            : 0;
          
          const totalCost = grn.goodReceivedItems && grn.goodReceivedItems.$values 
            ? grn.goodReceivedItems.$values.reduce((sum, item) => sum + (item.unitCost * item.quantity), 0) + (grn.shippingCost || 0)
            : 0;
          
          return {
            key: index.toString(),
            id: grn.id,
            date: new Date(grn.receivedDate).toLocaleDateString(),
            items: items,
            quantity: grn.quantity,
            totalCost: totalCost,
            status: grn.status || 'Received',
          };
        });
        
        setGoodsReceivedNotes(formattedGRNs);
      }
    } catch (error) {
      console.error('Error fetching goods received notes:', error);
      message.error('Failed to fetch goods received notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await goodReceivedNoteApiRequest.deleteGoodReceivedNote(id);
      message.success('Goods Received Note deleted successfully');
      fetchGoodsReceivedNotes();
    } catch (error) {
      console.error('Error deleting goods received note:', error);
      message.error('Failed to delete goods received note');
    }
  };

  // Product stock columns
  const productStockColumns = [
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
      title: 'Total Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
        title: 'Total Cost',
        dataIndex: 'totalCost',
        key: 'totalCost',
        render: (cost) => `${(cost * 24000).toLocaleString('vi-VN')} ₫`,
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
          <Button icon={<EditOutlined />} size="small" onClick={() => navigate(URLS.ADMIN.EDIT_GOOD_RECEIVED_NOTE(record.id))} />
          <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
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
              <Flex gap={8}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate(URLS.ADMIN.ADD_PRODUCT)}
                >
                  Add Product
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchProducts}
                />
              </Flex>
            </Flex>
            <Table 
              columns={productStockColumns} 
              dataSource={products} 
              pagination={{ pageSize: 10 }}
              loading={loading}
              expandable={{
                expandedRowRender: record => (
                  <Table 
                    columns={[
                      { title: 'SKU', dataIndex: 'name', key: 'name' },
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
                    onClick={fetchGoodsReceivedNotes}>
                    </Button>
                <Button 
                    variant="outlined" icon={<ExportOutlined />} 
                    onClick={() => {}}>
                </Button>
              </Flex>
            </Flex>
            <Table 
              columns={grnColumns} 
              dataSource={goodsReceivedNotes} 
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Inventory;
