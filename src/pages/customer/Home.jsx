import { Carousel, Typography, Card, Row, Col, Button, Image, Flex, Tabs } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import CategoryCard from '../../components/CategoryCard';
import { useEffect, useState } from 'react';

const { Title, Paragraph } = Typography;

const Home = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const carouselItems = [
        {
            title: "Transform Your Living Space",
            description: "Discover smart home solutions that make your life easier and more comfortable.",
            image: "https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2Fimg_slider_3.png?alt=media&token=fb45da40-a459-4d90-a9c9-1b44776dbf87",
        },
        {
            title: "Smart Security Solutions", 
            description: "Keep your home safe with our advanced security systems and monitoring.",
            image: "https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2Ffreepik__adjust__61529.png?alt=media&token=583ef22c-6315-4f7f-b717-6050a53154cc",
        },
        {
            title: "Energy Efficient Living",
            description: "Save money and help the environment with our energy management solutions.",
            image: "https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2Fimg_slider_5.png?alt=media&token=3d814a40-3972-431c-8bb2-878e105b2dd1",
        }
    ];

    return (
        <Flex vertical gap={isMobile ? 8 : 16}>
            <Carousel autoplay effect="fade">
                {carouselItems.map((item, index) => (
                    <div key={index}>
                        <div style={{
                            height: isMobile ? '300px' : '500px',
                            color: '#fff',
                            position: 'relative',
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: isMobile ? '20px' : '50px',
                                transform: 'translateY(-50%)',
                                maxWidth: isMobile ? '300px' : '500px',
                                padding: isMobile ? '0 10px' : 0
                            }}>
                                <Title level={isMobile ? 2 : 1} style={{ color: '#fff', marginBottom: isMobile ? '10px' : '20px' }}>
                                    {item.title}
                                </Title>
                                <Paragraph style={{ 
                                    color: '#fff', 
                                    fontSize: isMobile ? '14px' : '18px', 
                                    marginBottom: isMobile ? '15px' : '30px',
                                    display: isMobile ? 'none' : 'block'
                                }}>
                                    {item.description}
                                </Paragraph>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>

            <Tabs
                defaultActiveKey="1"
                animated={{ inkBar: true, tabPane: true }}
                tabBarStyle={{ display: 'none' }}
                items={[
                    {
                        key: '1',
                        label: ' ',
                        children: (
                            <Row style={{ margin: isMobile ? '0px 0' : '10px 0' }}>
                                <Col xs={0} sm={0} md={12} lg={12} xl={12}>
                                    <Image src="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2FGroup%2057.png?alt=media&token=177ad552-3570-435e-a7d8-8330bc4602e2"
                                        preview={false}
                                        width={'100%'}
                                        height={'100%'} />
                                </Col>
                                {
                                    isMobile && (
                                        <Col xs={1} sm={1} md={1} lg={1} xl={1} >
                                            <Button variant='text' style={{ width: '100%', height: '100%', border: 'none' }}>
                                                <LeftOutlined />
                                            </Button>
                                        </Col>
                                    )
                                }
                                <Col xs={21} sm={21} md={10} lg={10} xl={10} offset={1}>
                                    <Title level={4} style={{ textAlign: 'start', marginBottom: isMobile ? '20px' : '40px' }}>
                                        Categories
                                    </Title>
                                    <Row gutter={[32, 16]}>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CategoryCard image="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2FGroup%2057.png?alt=media&token=177ad552-3570-435e-a7d8-8330bc4602e2"
                                                title="Furniture" />
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CategoryCard image="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2FGroup%2057.png?alt=media&token=177ad552-3570-435e-a7d8-8330bc4602e2"
                                                title="Electronics" />
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CategoryCard image="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2FGroup%2057.png?alt=media&token=177ad552-3570-435e-a7d8-8330bc4602e2"
                                                title="Decor" />
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <CategoryCard image="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2FGroup%2057.png?alt=media&token=177ad552-3570-435e-a7d8-8330bc4602e2"
                                                title="Lighting" />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                                    <Button
                                        variant='text'
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        onClick={() => {
                                            const tabs = document.querySelector('.ant-tabs');
                                            if (tabs) {
                                                const currentTab = tabs.querySelector('.ant-tabs-tab-active');
                                                const nextTab = currentTab.nextElementSibling;
                                                if (nextTab) nextTab.click();
                                            }
                                        }}
                                    >
                                        <RightOutlined />
                                    </Button>
                                </Col>
                            </Row>
                        ),
                    },
                    {
                        key: '2',
                        label: ' ',
                        children: (
                            <Row style={{ margin: isMobile ? '0px 0' : '10px 0' }}>
                                <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                                    <Button
                                        variant='text'
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        onClick={() => {
                                            const tabs = document.querySelector('.ant-tabs');
                                            if (tabs) {
                                                const currentTab = tabs.querySelector('.ant-tabs-tab-active');
                                                const prevTab = currentTab.previousElementSibling;
                                                if (prevTab) prevTab.click();
                                            }
                                        }}
                                    >
                                        <LeftOutlined />
                                    </Button>
                                </Col>
                                <Col xs={21} sm={21} md={21} lg={21} xl={21} offset={1}>
                                    <Title level={4} style={{ textAlign: 'start', marginBottom: isMobile ? '20px' : '40px' }}>
                                        Categories
                                    </Title>
                                    <Row gutter={[32, 16]} justify="center">
                                        {[...Array(4)].map((_, index) => (
                                            <Col key={index} xs={12} sm={12} md={6} lg={6} xl={6}>
                                                <CategoryCard 
                                                    image="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2FGroup%2057.png?alt=media&token=177ad552-3570-435e-a7d8-8330bc4602e2"
                                                    title={['Furniture', 'Electronics', 'Decor', 'Lighting'][index % 4]} 
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </Col>
                                <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                                    <Button
                                        variant='text'
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        onClick={() => {
                                            const tabs = document.querySelector('.ant-tabs');
                                            if (tabs) {
                                                tabs.querySelector('.ant-tabs-tab:first-child').click();
                                            }
                                        }}
                                    >
                                        <RightOutlined />
                                    </Button>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />

            <Row style={{ margin: isMobile ? '20px 0' : '50px 0' }} gutter={[16, 16]}>
                {[1, 2].map((item) => (
                    <Col key={item} xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Image src="https://file.hstatic.net/1000280685/article/sagoconcept__3__80ae23a17cb449d3ae0af5f289347411.png"
                            preview={false}
                            width={'100%'}
                            height={'100%'} />
                        <Title level={4} style={{ textAlign: 'start', marginBottom: isMobile ? '20px' : '40px' }}>
                            DALAT Concept
                        </Title>
                    </Col>
                ))}
            </Row>

            <Row gutter={[16, 16]} style={{ margin: isMobile ? '20px 0' : '50px 0' }}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Title level={4} style={{ textAlign: 'start', marginBottom: isMobile ? '20px' : '40px' }}>
                        ABOUT US
                    </Title>
                    <Paragraph style={{ textAlign: 'start', marginBottom: isMobile ? '20px' : '40px' }}>
                        Welcome to DearHome, your ultimate destination for personalized shopping experiences. Our mission is to create a platform where comfort meets customization, allowing you to discover, design, and order products tailored to your unique preferences—all from the warmth of home.
                        At DearHome, we believe that every detail matters. Whether you're exploring cozy home essentials or designing personalized variants of your favorite products, our app is built to make your journey smooth, inspiring, and enjoyable. With a user-friendly interface and advanced inventory tracking, we ensure that
                    </Paragraph>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Image src="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2Ffreepik__adjust__28784%201.png?alt=media&token=5ab055c1-2f43-478e-b10b-362769646a09"
                        preview={false}
                        width={'100%'}
                        height={'100%'} />
                </Col>
            </Row>
        </Flex>
    );
};

export default Home;
