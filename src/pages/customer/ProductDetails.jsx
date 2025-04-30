import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Row, Col, Image, Button, Card, Flex, InputNumber, Tabs, Select, Rate, Progress, Pagination, Skeleton, Radio } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, UpOutlined, DownOutlined, PlusOutlined, MinusOutlined, StarFilled, DeleteOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import ReviewCard from '../../components/ReviewCard';
import ProductCard from '../../components/ProductCard';
import { ProductApiRequest } from '../../api/ApiRequests';
import AttributeTypes from '../../constants/AttributeTypes'
import { addToCart, updateQuantity, removeFromCart } from '../../store/actions/CartAction';
import { useDispatch, useSelector } from 'react-redux';
const { Title, Text, Paragraph } = Typography;

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState();
    const [selectedTab, setSelectedTab] = useState('1');
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [mainImage, setMainImage] = useState('');
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const itemInCart = useSelector(state => state.cart.items.filter(item => item.item.id === selectedVariant?.id ));
    var quantityInCart = itemInCart.length > 0 ? itemInCart[0].quantity : 0;

    const fetchProduct = async () => {
        await ProductApiRequest.getProductById(id)
            .then(res => {
                setProduct(res.data);
                setMainImage(res.data.imageUrl);
                // Set the first variant as default selected variant
                if (res.data.variants && res.data.variants.$values && res.data.variants.$values.length > 0) {
                    setSelectedVariant(res.data.variants.$values[0]);

                    // Initialize selected attributes from variant attributes
                    const initialAttributes = {};
                    if (res.data.variants.$values[0].variantAttributes &&
                        res.data.variants.$values[0].variantAttributes.$values) {
                        res.data.variants.$values[0].variantAttributes.$values.forEach(attr => {
                            initialAttributes[attr.attributeValue.attributeId] = attr.attributeValue.value;
                        });
                    }
                    setSelectedAttributes(initialAttributes);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    useEffect(() => {
        fetchProduct();
    }, [id]);

    // Find matching variant based on selected attributes
    useEffect(() => {
        if (!product || !product.variants || !product.variants.$values) return;

        // Find variant that matches all selected attributes
        const matchingVariant = product.variants.$values.find(variant => {
            if (!variant.variantAttributes || !variant.variantAttributes.$values) return false;

            // Check if all selected attributes match this variant
            const variantAttrs = variant.variantAttributes.$values;
            for (const [attrId, value] of Object.entries(selectedAttributes)) {
                const matchingAttr = variantAttrs.find(
                    attr => attr.attributeValue.attributeId === attrId && attr.attributeValue.value === value
                );
                if (!matchingAttr) return false;
            }
            return true;
        });

        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
        }
    }, [selectedAttributes, product]);

    const review = {
        avatar: 'https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg',
        username: 'John Doe',
        rating: 4.5,
        content: 'This is a review',
        date: '2024-01-01'
    }

    const handleAddToCart = () => {
        if (quantityInCart.length > 0) {
            dispatch(updateQuantity({ item: selectedVariant, quantity: quantityInCart + 1 }));
        } else {
            
            dispatch(addToCart({ item: {
                ...selectedVariant,
                product: product,
            }, quantity: 1 }));
        }
    };

    const handleQuantityChange = (value) => {
        if (value > 0) {
            dispatch(updateQuantity({ item: selectedVariant, quantity: value }));
        } else {
            dispatch(removeFromCart({ item: selectedVariant }));
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleAttributeChange = (attributeId, value) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [attributeId]: value
        }));

        // Find and update the selected variant based on the new attribute selection
        if (product && product.variants && product.variants.$values) {
            const newAttributes = {
                ...selectedAttributes,
                [attributeId]: value
            };

            const matchingVariant = product.variants.$values.find(variant => {
                if (!variant.variantAttributes || !variant.variantAttributes.$values) return false;

                const variantAttrs = variant.variantAttributes.$values;
                for (const [attrId, attrValue] of Object.entries(newAttributes)) {
                    const matchingAttr = variantAttrs.find(
                        attr => attr.attributeValue.attributeId === attrId && attr.attributeValue.value === attrValue
                    );
                    if (!matchingAttr) return false;
                }
                return true;
            });

            if (matchingVariant) {
                setSelectedVariant(matchingVariant);
            }
        }
    };

    // Calculate final price with variant adjustment
    const calculatePrice = () => {
        if (!product) return 0;
        const basePrice = product.price || 0;
        const adjustment = selectedVariant?.priceAdjustment || 0;
        return basePrice + adjustment;
    };

    const handleImageClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    if (product === undefined) {
        return (
            <Skeleton active paragraph={{ rows: 10 }} />
        );
    }

    return (
        <Flex vertical gap={32}>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                    <Image.PreviewGroup>
                        <Row gutter={[8, 8]} justify={isMobile ? 'center' : 'start'}>
                            <Col xs={24} md={20} lg={20} xl={20} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image
                                    src={mainImage}
                                    alt={product?.name}
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
                                        <Image
                                            width={isMobile ? 100 : '100%'}
                                            preview={false}
                                            src={product.imageUrl}
                                            alt={`${product.name} main view`}
                                            style={{
                                                width: '100%',
                                                objectFit: 'cover',
                                                cursor: 'pointer',
                                                border: mainImage === product.imageUrl ? '2px solid #1890ff' : '1px solid transparent'
                                            }}
                                            onClick={() => handleImageClick(product.imageUrl)}
                                        />
                                        {selectedVariant?.imageUrls?.$values?.map((imageUrl, index) => (
                                            <Image
                                                width={isMobile ? 100 : '100%'}
                                                preview={false}
                                                key={index}
                                                src={imageUrl}
                                                alt={`${product.name} view ${index + 2}`}
                                                style={{
                                                    width: '100%',
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    border: mainImage === imageUrl ? '2px solid #1890ff' : '1px solid transparent'
                                                }}
                                                onClick={() => handleImageClick(imageUrl)}
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
                            <Typography.Text type='secondary'>{product.category?.name}</Typography.Text>
                            <Typography.Title level={3}>{calculatePrice().toLocaleString('vi-VN')}₫</Typography.Title>
                        </div>

                        <Flex vertical gap={8} align="start">
                            {product.category?.categoryAttributes?.$values?.map((catAttr) => {
                                // Find all possible values for this attribute from variants
                                const possibleValues = [];
                                if (product.variants && product.variants.$values) {
                                    product.variants.$values.forEach(variant => {
                                        if (variant.variantAttributes && variant.variantAttributes.$values) {
                                            const attrValue = variant.variantAttributes.$values.find(
                                                attr => attr.attributeValue.attributeId === catAttr.attributeId
                                            );
                                            if (attrValue && !possibleValues.includes(attrValue.attributeValue.value)) {
                                                possibleValues.push(attrValue.attributeValue.value);
                                            }
                                        }
                                    });
                                }

                                return (
                                    <Flex key={catAttr.attributeId} gap={16} align="center">
                                        <Typography.Text>{catAttr.attribute.name || 'Attribute'}:</Typography.Text>

                                        {catAttr.attribute.type === AttributeTypes.Color && possibleValues.length > 1 ? (
                                            <Radio.Group
                                                value={selectedAttributes[catAttr.attributeId] || possibleValues[0]}
                                                onChange={(e) => handleAttributeChange(catAttr.attributeId, e.target.value)}
                                                buttonStyle="solid"
                                            >
                                                <Flex gap={8}>
                                                    {possibleValues.map((option) => (
                                                        <Radio.Button
                                                            key={option}
                                                            value={option}
                                                            style={{
                                                                padding: 0,
                                                                height: '30px',
                                                                width: '30px',
                                                                borderRadius: '50%',
                                                                overflow: 'hidden',
                                                                background: option,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                border: selectedAttributes[catAttr.attributeId] === option ? '2px solid #1890ff' : '1px solid #d9d9d9'
                                                            }}
                                                        >
                                                            <div style={{ opacity: 0 }}>.</div>
                                                        </Radio.Button>
                                                    ))}
                                                </Flex>
                                            </Radio.Group>
                                        ) : possibleValues.length > 1 ? (
                                            <Select
                                                value={selectedAttributes[catAttr.attributeId] || possibleValues[0]}
                                                onChange={(value) => handleAttributeChange(catAttr.attributeId, value)}
                                            >
                                                {possibleValues.map((option) => (
                                                    <Select.Option key={option} value={option}>
                                                        {option}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Typography.Text>
                                                {catAttr.attribute.type === AttributeTypes.Color ? (
                                                    <div style={{
                                                        backgroundColor: possibleValues[0],
                                                        width: '20px',
                                                        height: '20px',
                                                        display: 'inline-block',
                                                        marginRight: '8px',
                                                        verticalAlign: 'middle'
                                                    }}></div>
                                                ) : null}
                                                {possibleValues[0] || 'N/A'}
                                            </Typography.Text>
                                        )}
                                    </Flex>
                                );
                            })}
                        </Flex>

                        <Paragraph>{product.description}</Paragraph>

                        <Flex vertical gap={16} align="start">
                            {
                                quantityInCart > 0 && (
                                    <Flex gap={8} align="center" >
                                        <Typography.Text>Quantity:</Typography.Text>
                                        <Flex>
                                            <Button
                                                icon={quantityInCart > 1 ? <MinusOutlined /> : <DeleteOutlined />}
                                                onClick={() => handleQuantityChange(Math.max(0, quantityInCart - 1))}
                                            />
                                            <InputNumber
                                                min={1}
                                                max={selectedVariant?.stock || 10}
                                                value={quantityInCart}
                                                onChange={handleQuantityChange}
                                                controls={false}
                                                style={{ margin: '0 4px' }}
                                            />
                                            <Button
                                                icon={<PlusOutlined />}
                                                onClick={() => handleQuantityChange(Math.min(selectedVariant?.stock || 10, quantityInCart + 1))}
                                            />
                                        </Flex>
                                    </Flex>
                                )
                            }

                            <Flex gap={8} align="start">
                                <Button
                                    style={{ padding: '0px 40px' }}
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}
                                    size="large"
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariant || selectedVariant.stock <= 0}
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                    size="large"
                                    onClick={toggleFavorite}
                                />
                            </Flex>
                            {selectedVariant && (
                                <Typography.Text type={selectedVariant.stock > 0 ? 'success' : 'danger'}>
                                    {selectedVariant.stock > 0
                                        ? `In Stock: ${selectedVariant.stock} items`
                                        : 'Out of Stock'}
                                </Typography.Text>
                            )}
                            {selectedVariant && (
                                <Typography.Text>SKU: {selectedVariant.sku}</Typography.Text>
                            )}
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
                        {/* {
                            product.relatedProducts.map((product) => (
                                <Col span={24} md={12} lg={8} xl={6}>
                                    <ProductCard product={product} />
                                </Col>
                            ))
                        } */}
                    </Row>

                </Flex>
            </Row>
        </Flex>
    );
};

export default ProductDetails;
