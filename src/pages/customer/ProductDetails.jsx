import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Row, Col, Image, Button, Card, Flex, InputNumber, Tabs, Select, Rate, Progress, Pagination } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, UpOutlined, DownOutlined, PlusOutlined, MinusOutlined, StarFilled } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import ReviewCard from '../../components/ReviewCard';
import ProductCard from '../../components/ProductCard';
const { Title, Text, Paragraph } = Typography;

const ProductDetails = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [selectedTab, setSelectedTab] = useState('1');
    const [isFavorite, setIsFavorite] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    // Mock product data - replace with API call
    const product = {
        id: id,
        name: 'Modern Sofa',
        price: 799.99,
        description: 'A comfortable and stylish modern sofa perfect for any living room.',
        category: 'Sofa',
        images: [
            'https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg',
            'https://product.hstatic.net/1000280685/product/arou-d-1_7eb2f39b66cb4da385a8f6ff4f175a6d_large.jpg',
            'https://product.hstatic.net/1000280685/product/trang_4_7a40e7b31b514729bb1f7efda41bc51d_c9e6a59c7b894e2aa6dc977aef1686a4_large.jpg'
        ],
        specifications: [
            {
                dimensions: [
                    {
                        name: 'W200xH80xD90cm',
                        code: 'W200xH80xD90cm'
                    },
                    {
                        name: 'W200xH40xD90cm',
                        code: 'W200xH40xD90cm'
                    }
                ]
            },
            {
                material: [
                    {
                        name: 'Premium fabric',
                        code: 'Premium fabric'
                    }
                ]
            },
            {
                color: [
                    {
                        name: 'Black',
                        code: 'Black'
                    },
                    {
                        name: 'White',
                        code: 'White'
                    }
                ]
            }
        ],
        relatedProducts: [
            {
                id: 1,
                name: 'Modern Sofa',
                price: 799.99,
                category: 'Sofa',
                image: 'https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg'
            }
        ]

    };

    const review = {
        avatar: 'https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg',
        username: 'John Doe',
        rating: 4.5,
        content: 'This is a review',
        date: '2024-01-01'
    }

    const handleAddToCart = () => {
        // Implement add to cart functionality
        console.log(`Adding ${quantity} of ${product.name} to cart`);
    };

    const handleQuantityChange = (value) => {
        setQuantity(value);
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <Flex vertical gap={32}>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                    <Image.PreviewGroup>
                        <Row gutter={[8, 8]} justify={isMobile ? 'center' : 'start'}>
                            <Col xs={24} md={20} lg={20} xl={20} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    style={{ width: '100%', objectFit: 'cover' }}
                                />
                            </Col>
                            <Col xs={24} md={4} lg={4} xl={4}  >
                                <div style={{ position: 'relative', height: '100%', gap: 16 }}>
                                    <Button
                                        type='text'
                                        icon={<UpOutlined />}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            zIndex: 1,
                                            display: isMobile ? 'none' : 'block'
                                        }}
                                        onClick={() => {
                                            const container = document.querySelector('.image-scroll');
                                            container.scrollTop -= 100;
                                        }}
                                    />
                                    <Flex
                                        vertical={!isMobile}
                                        gap={16}
                                        justify={isMobile ? 'center' : 'start'}
                                        className="image-scroll"
                                        style={{
                                            maxHeight: isMobile ? 'auto' : '300px',
                                            overflowY: isMobile ? 'visible' : 'auto',
                                            scrollBehavior: 'smooth',
                                            padding: '30px 0'
                                        }}
                                    >
                                        {product.images.slice(1, 4).map((image, index) => (
                                            <Image
                                                width={isMobile ? 100 : '100%'}
                                                preview={false}
                                                key={index}
                                                src={image}
                                                alt={`${product.name} view ${index + 2}`}
                                                style={{ width: '100%', objectFit: 'cover' }}
                                            />
                                        ))}
                                    </Flex>
                                    <Button
                                        type='text'
                                        icon={<DownOutlined />}
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            zIndex: 1,
                                            display: isMobile ? 'none' : 'block'
                                        }}
                                        onClick={() => {
                                            const container = document.querySelector('.image-scroll');
                                            container.scrollTop += 100;
                                        }}
                                    />
                                </div>

                            </Col>
                        </Row>
                    </Image.PreviewGroup>
                </Col>

                <Col xs={24} md={12}>
                    <Flex vertical gap={24}>
                        <div>
                            <Typography.Title level={2} style={{ fontWeight: 400, textTransform: 'uppercase' }}>{product.name}</Typography.Title>
                            <Typography.Text type='secondary'>{product.category}</Typography.Text>
                            <Typography.Title level={3}>{product.price.toLocaleString('vi-VN')}₫</Typography.Title>
                        </div>

                        <Flex vertical gap={8} align="start">
                            {
                                product.specifications
                                    .sort((a, b) => {
                                        const aOptions = Object.values(a)[0];
                                        const bOptions = Object.values(b)[0];
                                        // Sort single options first
                                        return aOptions.length === 1 ? -1 : 1;
                                    })
                                    .map((specification) => {
                                        const specType = Object.keys(specification)[0];
                                        const options = specification[specType];

                                        if (options.length === 1) return (
                                            <Flex gap={16} align="center">
                                                <Typography.Text>{specType}:</Typography.Text>
                                                <Typography.Text>{options[0].name}</Typography.Text>
                                            </Flex>
                                        );

                                        return (
                                            <Flex gap={16} align="center">
                                                <Typography.Text>{specType}:</Typography.Text>
                                                <Select key={specType} defaultValue={options[0].code}>
                                                    {options.map((option) => (
                                                        <Select.Option key={option.code} value={option.code}>
                                                            {option.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Flex>
                                        );
                                    })
                            }
                        </Flex>

                        <Paragraph>{product.description}</Paragraph>

                        <Flex vertical gap={16} align="start">
                            <Flex gap={8} align="center">
                                <Typography.Text>Quantity:</Typography.Text>
                                <Flex>
                                    <Button
                                        icon={<MinusOutlined />}
                                        onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                                    />
                                    <InputNumber
                                        min={1}
                                        max={10}
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        controls={false}
                                        style={{ margin: '0 4px' }}
                                    />
                                    <Button
                                        icon={<PlusOutlined />}
                                        onClick={() => handleQuantityChange(Math.min(10, quantity + 1))}
                                    />
                                </Flex>
                            </Flex>
                            <Flex gap={8} align="start">
                                <Button style={{ padding: '0px 40px' }} type="primary" icon={<ShoppingCartOutlined />} size="large" onClick={handleAddToCart}>
                                    Add to Cart
                                </Button>
                                <Button
                                    icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                    size="large"
                                    onClick={toggleFavorite}
                                />
                            </Flex>
                        </Flex>
                    </Flex>
                </Col>
                <Flex vertical gap={32} style={{ width: '100%' }}>
                    <Tabs>
                        <Tabs.TabPane tab="RATING" key="1">
                            <Flex vertical gap={16}>
                                <Flex vertical gap={16} align="center">
                                    <Row style={{ width: '100%' }}>
                                        <Col span={12} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography.Title>4.5/5</Typography.Title>
                                            <Rate disabled allowHalf value={4.5} style={{ margin: '0px 10px' }} />
                                            <Typography.Text>100+ reviews</Typography.Text>
                                        </Col>
                                        <Col span={12} style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                            <Flex gap={8} align="center">
                                                <Typography.Text>5</Typography.Text>
                                                <StarFilled style={{ color: '#FFD700' }} />
                                                <Progress strokeColor="#FFD700" percent={80} format={percent => `${percent}%`} />
                                            </Flex>
                                            <Flex gap={8} align="center">
                                                <Typography.Text>4</Typography.Text>
                                                <StarFilled style={{ color: '#FFD700' }} />
                                                <Progress strokeColor="#FFD700" percent={80} format={percent => `${percent}%`} />
                                            </Flex>
                                            <Flex gap={8} align="center">
                                                <Typography.Text>3</Typography.Text>
                                                <StarFilled style={{ color: '#FFD700' }} />
                                                <Progress strokeColor="#FFD700" percent={80} format={percent => `${percent}%`} />
                                            </Flex>
                                            <Flex gap={8} align="center">
                                                <Typography.Text>2</Typography.Text>
                                                <StarFilled style={{ color: '#FFD700' }} />
                                                <Progress strokeColor="#FFD700" percent={80} format={percent => `${percent}%`} />
                                            </Flex>
                                            <Flex gap={8} align="center">
                                                <Typography.Text>1</Typography.Text>
                                                <StarFilled style={{ color: '#FFD700' }} />
                                                <Progress strokeColor="#FFD700" percent={80} format={percent => `${percent}%`} />
                                            </Flex>
                                        </Col>
                                    </Row>
                                    <Row style={{ width: '100%' }}>
                                        <Col span={24}>
                                            <ReviewCard review={review} />
                                            <ReviewCard review={review} />
                                            <Flex justify="center" style={{ marginTop: 16 }}>
                                                <Pagination 
                                                    total={50} 
                                                    pageSize={10}
                                                    showSizeChanger={false}
                                                    onChange={(page) => {
                                                        console.log(page);
                                                        // Implement pagination logic here
                                                    }}
                                                />
                                            </Flex>
                                        </Col>
                                    </Row>
                                </Flex>
                            </Flex>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="GUARANTEE" key="2">
                            <Flex vertical gap={16}>
                                <Flex gap={16} align="center">
                                    <Typography.Text>Rating:</Typography.Text>
                                    <Typography.Text>4.5</Typography.Text>
                                </Flex>
                            </Flex>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="DELIVERY & INSTALLATION" key="3">
                            <Flex vertical gap={16}>
                                <Flex gap={16} align="center">
                                    <Typography.Text>Rating:</Typography.Text>
                                    <Typography.Text>4.5</Typography.Text>
                                </Flex>
                            </Flex>
                        </Tabs.TabPane>
                    </Tabs>
                </Flex>

                <Flex vertical gap={32} style={{ width: '100%' }}>
                    <Typography.Title level={2}>Related Products</Typography.Title>
                    <Row gutter={[16, 16]}>
                        {
                            product.relatedProducts.map((product) => (
                                <Col span={24} md={12} lg={8} xl={6}>
                                    <ProductCard product={product} />
                                </Col>
                            ))
                        }
                    </Row>
                   
                </Flex>
            </Row>
        </Flex>
    );
};

export default ProductDetails;
