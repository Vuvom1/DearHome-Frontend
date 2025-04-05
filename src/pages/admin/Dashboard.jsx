import { Row, Col, Card, Statistic, Typography, Tabs, Flex, Button, Select, TimePicker, Radio, List, Table, Progress } from 'antd';
import { ShoppingOutlined, UserOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const { Title } = Typography;

const salesRanking = [
    {
        name: 'John Doe',
        sales: 10000,
        orders: 100,
    },

]

const categories = [
    {
        name: 'Category 1',
        stock: 100,
        percentage: 0.5,
    },
    {
        name: 'Category 2',
        stock: 200,
        percentage: 0.3,
    },
    {
        name: 'Category 3',
        stock: 300,
        percentage: 0.2,
    },
]

const inventoryData = [
    {
        name: 'Product A',
        stock: 100,
    },
    {
        name: 'Product B',
        stock: 200,
    },
    {
        name: 'Product C',
        stock: 300,
    },
]

const inventoryColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    
]


const promotionData = [
    {
        name: 'Promotion 1',
        revenue: 10000,
        items: 100,
    },
]

const orderStatusData = [
    {
        name: 'Pending',
        value: 100,
    },
    {
        name: 'Processing',
        value: 200,
    },
    {
        name: 'Completed',
        value: 300,
    },
]

const promotionColumns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Revenue',
        dataIndex: 'revenue',
    },
    {
        title: 'Items',
        dataIndex: 'items',
    },
]

const Dashboard = () => {
    return (
        <>
            <Typography.Title style={{ marginTop: 0 }} level={2}>Dashboard</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Sales"
                            value={234567}
                            prefix={<DollarOutlined />}
                            precision={2}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={1234}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Products"
                            value={456}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Customers"
                            value={789}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card style={{ marginTop: 16 }}>
                        <Tabs defaultActiveKey="sales"
                            tabBarExtraContent={{
                                right: <Flex justify='space-between' align='center' gap={16}>
                                    <Radio.Group>
                                        <Radio.Button value="daily">Daily</Radio.Button>
                                        <Radio.Button value="weekly">Weekly</Radio.Button>
                                        <Radio.Button value="monthly">Monthly</Radio.Button>
                                    </Radio.Group>
                                    <TimePicker.RangePicker />
                                </Flex>
                            }}
                        >
                            <Tabs.TabPane tab="Sales" key="sales">
                                <Row gutter={16}>
                                    <Col span={18}>
                                        <Line
                                            height={200}
                                            data={{
                                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                                datasets: [
                                                    {
                                                        label: 'Sales ($)',
                                                        data: [30000, 45000, 32000, 50000, 35000, 55000, 52000, 48000, 60000, 62000, 58000, 65000],
                                                        fill: false,
                                                        borderColor: '#1890ff',
                                                        tension: 0.4
                                                    }
                                                ]
                                            }}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    title: {
                                                        display: false
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            callback: (value) => `$${value.toLocaleString()}`
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Typography >Sales Ranking</Typography>
                                        <List
                                            dataSource={salesRanking}
                                            renderItem={(item, index) => (
                                                <List.Item>
                                                    <Flex justify="space-between" style={{ width: '100%' }}>
                                                        <Typography.Text>#{index + 1}</Typography.Text>
                                                        <Typography.Text>{item.name}</Typography.Text>
                                                        <Typography.Text>${item.sales.toLocaleString()}</Typography.Text>
                                                    </Flex>
                                                </List.Item>
                                            )}
                                        />
                                    </Col>
                                </Row>


                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Orders" key="orders">
                                <Row gutter={16}>
                                    <Col span={18}>
                                        <Line
                                            height={200}
                                            data={{
                                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                                datasets: [
                                                    {
                                                        label: 'Orders',
                                                        data: [30000, 45000, 32000, 50000, 35000, 55000, 52000, 48000, 60000, 62000, 58000, 65000],
                                                        fill: false,
                                                        borderColor: '#1890ff',
                                                        tension: 0.4
                                                    }
                                                ]
                                            }}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    title: {
                                                        display: false
                                                    }
                                                },
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        ticks: {
                                                            callback: (value) => value.toLocaleString()
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Typography >Orders Ranking</Typography>
                                        <List
                                            dataSource={salesRanking}
                                            renderItem={(item, index) => (
                                                <List.Item>
                                                    <Flex justify="space-between" style={{ width: '100%' }}>
                                                        <Typography.Text>#{index + 1}</Typography.Text>
                                                        <Typography.Text>{item.name}</Typography.Text>
                                                        <Typography.Text>{item.orders.toLocaleString()}</Typography.Text>
                                                    </Flex>
                                                </List.Item>
                                            )}
                                        />
                                    </Col>
                                </Row>

                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <Card title="Promotion Effectiveness">

                        <Row gutter={[12, 12]}>
                            <Col span={12}>
                                <Card>
                                    <Statistic title="Total Revenue" value={234567} prefix={<DollarOutlined />} precision={2} />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card >
                                    <Statistic title="Total Items Sale" value={234567} prefix={<DollarOutlined />} precision={2} />
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Table
                                    dataSource={promotionData}
                                    columns={promotionColumns}

                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Proportion of Order Status" style={{ height: '100%' }}>
                       
                        <Row gutter={[12, 12]} style={{ alignItems: 'center', justifyContent: 'center' }}>
                            
                                <Doughnut                                
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'right'
                                            },
                                            
                                        }
                                    }}
                                    data={{
                                        labels: orderStatusData.map(item => item.name),
                                        datasets: [{
                                            data: orderStatusData.map(item => item.value),
                                            backgroundColor: [
                                                '#FF6384',
                                                '#36A2EB',
                                                '#FFCE56'
                                            ]
                                        }]
                                    }}
                                    style={{ height: '80%' }}
                                />
                        
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                    <Card title="Inventory Management">
                        <Tabs>

                            {
                                categories.map(category => (
                                    <Tabs.TabPane tab={
                                        <Flex vertical justify="space-between" align="center" gap={2}>
                                            <Typography.Text>{category.name}</Typography.Text>
                                            <Progress percent={category.percentage * 100} />
                                        </Flex>
                                    } key={category.name}>
                                        <Bar
                                            data={{
                                                labels: inventoryData.map(item => item.name),
                                                datasets: [{
                                                    data: inventoryData.map(item => item.stock),
                                                }]
                                            }}
                                        />
                                    </Tabs.TabPane>
                                ))
                            }
                                
                           
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Dashboard;
