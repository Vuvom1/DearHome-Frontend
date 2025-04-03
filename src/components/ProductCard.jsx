import { Card, Image, Typography, Flex, Badge } from 'antd';

const { Text } = Typography;

const ProductCard = ({ product }) => {
    return (
        <Card
            style={{ 
                border: 'none', 
                boxShadow: 'none',
                transition: 'transform 0.2s',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
            }}
            cover={
                product.discount ? (
                    <Badge.Ribbon text="20% OFF" color='yellow'>
                        <Image
                            alt={product.name}
                            src={product.image}
                            preview={false}
                            width={'100%'}
                            height={'100%'}
                        />
                    </Badge.Ribbon>
                ) : (
                    <Image
                        alt={product.name}
                        src={product.image}
                        preview={false}
                        width={'100%'}
                        height={'100%'}
                    />
                )
            }
            styles={{
                body: { padding: '24px 0 24px 0' }
            }}
        >
            <Card.Meta
                title={product.name.toUpperCase()}
                description={
                    <Flex vertical>
                        <Text type="secondary">{product.category}</Text>
                        <Text strong style={{ fontSize: '16px' }}>{(product.price).toLocaleString('vi-VN')} ₫</Text>
                    </Flex>
                }
            />
        </Card>
    );
};

export default ProductCard;
