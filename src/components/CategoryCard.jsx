import { Card, Image, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../constants/urls';
const { Title } = Typography;

const CategoryCard = ({ image, title, slug}) => {
    const navigate = useNavigate();
    return (
        <Card
            onClick={() => navigate(URLS.CUSTOMER.CATEGORY_DETAIL(slug))}
            style={{ 
                width: '100%', 
                border: 'none',
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
                <Image
                    src={image}
                    preview={false}
                    width={'100%'}
                    height={'100%'}
                />
            }
            styles={{
                body: { padding: '24px 0 24px 0' }
            }}
        >
            <Card.Meta
                title={
                    <Title level={5} style={{ textAlign: 'start', color: '#808080', margin: 0 }}>
                        {title}
                    </Title>
                }
            />
        </Card>
    );
};

export default CategoryCard;