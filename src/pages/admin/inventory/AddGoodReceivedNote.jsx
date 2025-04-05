import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    DatePicker,
    Select,
    InputNumber,
    Table,
    Space,
    Flex,
    Divider
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AddGoodReceivedNote = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    // Mock data for suppliers and products
    const suppliers = [
        { id: '1', name: 'Supplier A' },
        { id: '2', name: 'Supplier B' },
        { id: '3', name: 'Supplier C' },
    ];

    const products = [
        { id: '1', name: 'Product A', sku: 'SKU001' },
        { id: '2', name: 'Product B', sku: 'SKU002' },
        { id: '3', name: 'Product C', sku: 'SKU003' },
    ];

    const addItem = () => {
        const newItem = {
            key: Date.now(),
            product: null,
            quantity: 1,
            unitCost: 0,
            totalCost: 0,
        };
        setItems([...items, newItem]);
    };

    const removeItem = (key) => {
        setItems(items.filter(item => item.key !== key));
    };

    const updateItem = (key, field, value) => {
        const newItems = [...items];
        const index = newItems.findIndex(item => item.key === key);

        if (index !== -1) {
            newItems[index] = { ...newItems[index], [field]: value };

            // Recalculate total cost if quantity or unit cost changes
            if (field === 'quantity' || field === 'unitCost') {
                newItems[index].totalCost = newItems[index].quantity * newItems[index].unitCost;
            }

            setItems(newItems);
        }
    };

    const calculateTotalCost = () => {
        return items.reduce((sum, item) => sum + (item.totalCost || 0), 0);
    };

    const handleSubmit = (values) => {
        const grnData = {
            ...values,
            items: items,
            totalCost: calculateTotalCost(),
        };

        console.log('GRN Data:', grnData);
        // Here you would typically send the data to your backend

        // Navigate back to inventory page
        navigate('/admin/inventory');
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (_, record) => (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select a product"
                    value={record.product}
                    onChange={(value) => updateItem(record.key, 'product', value)}
                >
                    {products.map(product => (
                        <Option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => updateItem(record.key, 'quantity', value)}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Unit Cost',
            dataIndex: 'unitCost',
            key: 'unitCost',
            render: (_, record) => (
                <InputNumber
                    min={0}
                    step={0.01}
                    prefix="$"
                    value={record.unitCost}
                    onChange={(value) => updateItem(record.key, 'unitCost', value)}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Total Cost',
            dataIndex: 'totalCost',
            key: 'totalCost',
            render: (text) => `$${(text || 0).toFixed(2)}`,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeItem(record.key)}
                />
            ),
        },
    ];

    return (
        <div>
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Typography.Title level={2}>Create Goods Received Note</Typography.Title>
                <Flex gap={16}>
                    <Button
                        variant="outlined"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(URLS.ADMIN.INVENTORY)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        htmlType="submit"
                    >
                        Save GRN
                    </Button>
                </Flex>
            </Flex>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Card
                    title="GRN Details"
                    style={{ marginBottom: 16 }}>
                    <Flex gap={16} wrap="wrap">
                        <Form.Item
                            name="grnNumber"
                            label="GRN Number"
                            rules={[{ required: true, message: 'Please input GRN number!' }]}
                            style={{ flex: 1, minWidth: '250px' }}
                        >
                            <Input placeholder="GRN-001" />
                        </Form.Item>

                        <Form.Item
                            name="date"
                            label="Date Received"
                            rules={[{ required: true, message: 'Please select date!' }]}
                            style={{ flex: 1, minWidth: '250px' }}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="supplier"
                            label="Supplier"
                            rules={[{ required: true, message: 'Please select supplier!' }]}
                            style={{ flex: 1, minWidth: '250px' }}
                        >
                            <Select placeholder="Select a supplier">
                                {suppliers.map(supplier => (
                                    <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Flex>

                    <Form.Item
                        name="notes"
                        label="Notes"
                    >
                        <TextArea rows={4} placeholder="Additional notes about this delivery" />
                    </Form.Item>
                </Card>

                <Card
                    title="Items Received"
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={addItem}
                        >
                            Add Item
                        </Button>
                    }
                    style={{ marginBottom: 16 }}>
                    <Table
                        columns={columns}
                        dataSource={items}
                        pagination={false}
                        rowKey="key"
                        summary={() => (
                            <Table.Summary>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                                        <strong>Total:</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>
                                        <strong>${calculateTotalCost().toFixed(2)}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} />
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                    />
                </Card>
            </Form>
        </div>
    );
};

export default AddGoodReceivedNote;
