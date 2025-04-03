import { Card, Typography, Flex, Image, Badge } from 'antd';

const { Title, Text } = Typography;

const ComboCard = ({ combo }) => {
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
                combo.discount ? (
                    <Badge.Ribbon text={`${combo.discount}% OFF`} color='yellow'>
                        <Image
                            alt={combo.name}
                            src={combo.image}
                            preview={false}
                            width={'100%'}
                            height={'100%'}
                        />
                    </Badge.Ribbon>
                ) : (
                    <Image
                        alt={combo.name}
                        src={combo.image}
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
                title={(combo.name).toUpperCase()}
                description={
                    <Flex vertical>
                        <Text type="secondary">Combo {combo.category} from</Text>
                        <Text strong style={{ fontSize: '16px' }}>{(combo.price).toLocaleString('vi-VN')} ₫</Text>
                    </Flex>
                }
            />
        </Card>
    );
};

export default ComboCard;
