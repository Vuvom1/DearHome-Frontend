import { Card, Image, Typography, Flex, Badge, Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ProductCard = ({ product }) => {
    return (
        <Card
            style={{ 
                border: 'none', 
                boxShadow: 'none',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.querySelector('.add-to-cart-btn').style.opacity = 1;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.querySelector('.add-to-cart-btn').style.opacity = 0;

            }}
            cover={
                product.discount ? (
                    <Badge.Ribbon text="20% OFF" color='yellow'>
                        <div 
                            style={{ position: 'relative' }}
                        >
                            <Image
                                alt={product.name}
                                src={product.image}
                                preview={false}
                                width={'100%'}
                                height={'100%'}
                            />
                            <Button
                            className="add-to-cart-btn"
                            variant='text'
                            icon={<ShoppingOutlined />}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                position: 'absolute',
                                right: 8,
                                top: '30%',
                                transform: 'translate(0%, -100%)',
                                opacity: 0,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translate(0%, -100%) scale(1.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translate(0%, -100%)';
                            }}
                        />
                           
                        </div>
                    </Badge.Ribbon>
                ) : (
                    <div 
                        style={{ position: 'relative' }}
                    >
                        <Image
                            alt={product.name}
                            src={product.image}
                            preview={false}
                            width={'100%'}
                            height={'100%'}
                        />
                        <Button
                            className="add-to-cart-btn"
                            variant='text'
                            icon={<ShoppingOutlined />}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                position: 'absolute',
                                right: 8,
                                top: '30%',
                                transform: 'translate(0%, -100%)',
                                opacity: 0,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translate(0%, -100%) scale(1.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translate(0%, -100%)';
                            }}
                        />
                    
                    </div>
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
