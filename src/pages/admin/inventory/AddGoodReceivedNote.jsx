import React, { useState, useEffect } from 'react';
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
    Divider,
    message
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    SaveOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../../../constants/urls';
import { goodReceivedNoteApiRequest, VariantApiRequest } from '../../../api/ApiRequests';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AddGoodReceivedNote = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [variants, setVariants] = useState([]);

    const fetchVariants = async () => {
        const response = await VariantApiRequest.getAllVariants();
        setVariants(response.data.$values);
    }

    // Fetch products
    useEffect(() => {
        fetchVariants();
    }, []);

    const addItem = () => {
        const newItem = {
            key: Date.now(),
            variantId: null,
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

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            
            // Format the items for the API
            const goodReceivedItems = items.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
                unitCost: item.unitCost
            }));
            
            // Prepare the payload
            const payload = {
                receivedDate: values.date.toISOString(),
                note: values.note || "",
                shippingCost: values.shippingCost || 0,
                status: "Received",
                goodReceivedItems: goodReceivedItems
            };

            console.log(payload);
            
            // Make the API call
            const response = await goodReceivedNoteApiRequest.createGoodReceivedNote(payload);
            
            message.success('Goods Received Note created successfully');
            
            // Navigate back to inventory page
            navigate(URLS.ADMIN.INVENTORY);
        } catch (error) {
            console.error('Error creating GRN:', error);
            message.error('Failed to create Goods Received Note');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: 'variantId',
            key: 'variantId',
            render: (_, record) => (
                <Select
                    style={{ width: '100%' }}
                    placeholder="Select a product"
                    value={record.variantId}
                    onChange={(value) => updateItem(record.key, 'variantId', value)}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {variants.map(variant => (
                        <Option key={variant.id} value={variant.id}>
                            {variant.name} ({variant.sku})
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
                        onClick={() => form.submit()}
                        loading={loading}
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
                            name="date"
                            label="Date Received"
                            rules={[{ required: true, message: 'Please select date!' }]}
                            style={{ flex: 1, minWidth: '250px' }}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="shippingCost"
                            label="Shipping Cost"
                            initialValue={0}
                            style={{ flex: 1, minWidth: '250px' }}
                        >
                            <InputNumber
                                min={0}
                                step={0.01}
                                suffix="VND"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Flex>
                    <Form.Item
                        name="note"
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
