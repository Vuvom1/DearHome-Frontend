import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Row, Col, Flex, Image, Button, Card, Dropdown, Checkbox, Spin } from 'antd';
import ProductCard from '../../components/ProductCard';
import CategoryCard from '../../components/CategoryCard';
import { DownOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { CategoryApiRequest, ProductApiRequest } from '../../api/ApiRequests';
const { Title } = Typography;

const CategoryDetails = () => {
  const { slug: slug } = useParams();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await CategoryApiRequest.getBySlug(slug);
        // Assuming API returns the category object directly
        setCategoryDetails(res.data);
        
      } catch (error) {
        console.error('Failed to fetch category:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
        setLoading(true);
        try {
            const res = await ProductApiRequest.getProductsByCategoryId(categoryDetails.id);
            // Assuming API returns the category object directly
            setProducts(res.data.$values);
          } catch (error) {
            console.error('Failed to fetch category:', error);
          } finally {
            setLoading(false);
        }
    }

    if (categoryDetails)
        fetchProductsByCategory();

  }, [categoryDetails])

  if (loading) {
    return (
      <Flex justify="center" style={{ padding: 50 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!categoryDetails) {
    return (
      <Flex justify="center" style={{ padding: 50 }}>
        <Typography.Text type="warning">Category not found.</Typography.Text>
      </Flex>
    );
  }

  const hasChildren = categoryDetails.subCategories.$values.length > 0;

  return (
    <Flex vertical gap={24}>
      {/* Category Header */}
      <Row>
        <Col span={24}>
          <Image
            width="100%"
            height={300}
            style={{ objectFit: 'cover' }}
            src={categoryDetails.imageUrl}
            preview={false}
          />
        </Col>
      </Row>

      {/* Category Info */}
      <div style={{ textAlign: 'center' }}>
        <Title level={2}>{categoryDetails.name}</Title>
        <Typography.Paragraph type="secondary">
          {categoryDetails.description}
        </Typography.Paragraph>
      </div>

      {hasChildren ? (
        <>
          {/* Sub Categories */}
          <Row gutter={[16, 16]} justify="center">
            {categoryDetails.subCategories.$values.map((sub) => (
              <Col key={sub.id} xs={12} sm={12} md={8} lg={6} xl={4}>
                <CategoryCard image={sub.imageUrl} title={sub.name} slug={sub.slug} />
              </Col>
            ))}
          </Row>
          <div style={{ marginTop: '24px' }}>
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2F3d-room-decor-with-furniture-minimalist-beige-tones.jpg?alt=media&token=5c0e9000-ce4e-4c18-b5ea-5121487dc8b3"
              width="100%"
              height={300}
            />
          </div>
        </>
      ) : (
        <div>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: isMobile ? 'center' : 'start',
              }}
            >
              <Flex gap={16}>
                <Dropdown
                  trigger={['click']}
                  dropdownRender={() => (
                    <Card style={{ width: 'fit-content' }}>
                      <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={(values) => console.log(values)}
                      >
                        <Flex vertical>
                          <Checkbox value="0-2000000">0đ - 2.000.000đ</Checkbox>
                          <Checkbox value="2000000-5000000">
                            2.000.000đ - 5.000.000đ
                          </Checkbox>
                          <Checkbox value="5000000-10000000">
                            5.000.000đ - 10.000.000đ
                          </Checkbox>
                          <Checkbox value="10000000+">Trên 10.000.000đ</Checkbox>
                        </Flex>
                      </Checkbox.Group>
                    </Card>
                  )}
                >
                  <Button style={{ width: isMobile ? '100%' : 'fit-content' }}>
                    Price Range <DownOutlined />
                  </Button>
                </Dropdown>

                <Dropdown
                  trigger={['click']}
                  dropdownRender={() => (
                    <Card style={{ width: 200 }}>
                      <Checkbox.Group
                        style={{ width: '100%' }}
                        onChange={(values) => console.log(values)}
                      >
                        <Flex vertical>
                          <Checkbox value="black">Black</Checkbox>
                          <Checkbox value="white">White</Checkbox>
                          <Checkbox value="brown">Brown</Checkbox>
                          <Checkbox value="gray">Gray</Checkbox>
                          <Checkbox value="beige">Beige</Checkbox>
                        </Flex>
                      </Checkbox.Group>
                    </Card>
                  )}
                >
                  <Button style={{ width: isMobile ? '100%' : 'fit-content' }}>
                    Color <DownOutlined />
                  </Button>
                </Dropdown>
              </Flex>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              style={{
                alignItems: 'center',
                display: 'flex',
                gap: '16px',
                justifyContent: 'end',
              }}
            >
              <Typography.Text>{products.length} products</Typography.Text>
              <Dropdown
                trigger={['click']}
                dropdownRender={() => (
                  <Card style={{ width: 200 }}>
                    <Flex vertical>
                      <Button type="text" style={{ textAlign: 'left' }}>
                        Price: Low to High
                      </Button>
                      <Button type="text" style={{ textAlign: 'left' }}>
                        Price: High to Low
                      </Button>
                      <Button type="text" style={{ textAlign: 'left' }}>
                        Name: A to Z
                      </Button>
                      <Button type="text" style={{ textAlign: 'left' }}>
                        Name: Z to A
                      </Button>
                    </Flex>
                  </Card>
                )}
              >
                <Button style={{ width: 'fit-content' }}>
                  Sort by <DownOutlined />
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </div>
      )}

      {/* Products Grid */}
      <div>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </Flex>
  );
};

export default CategoryDetails;
