import { Card, Avatar, Rate, Typography, Flex } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const ReviewCard = ({ review }) => {
    return (
        <Card style={{ marginBottom: 16 }}>
            <Flex gap={16} align="start">
                <Avatar 
                    size={40} 
                    icon={<UserOutlined />}
                    src={review?.avatar}
                />
                <Flex vertical gap={8} style={{ width: '100%' }}>
                    <Flex gap={8} align="center" justify="space-between" style={{ width: '100%' }}>
                        <Text strong>{review?.username || 'Anonymous'}</Text>
                        <Text style={{ fontSize: 12 }} type="secondary">{review?.date}</Text>
                    </Flex>
                    <Rate disabled allowHalf value={review?.rating || 0} />
                    <Paragraph>{review?.content}</Paragraph>
                </Flex>
            </Flex>
        </Card>
    );
};

export default ReviewCard;
