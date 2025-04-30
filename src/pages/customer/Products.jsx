import { Typography, Card, Row, Col, Input, Select, Flex, Image, Breadcrumb, Pagination, Spin } from 'antd';
import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import CategoryCard from '../../components/CategoryCard';
import ComboCard from '../../components/ComboCard';
import { URLS } from '../../constants/urls';
import { CategoryApiRequest, ProductApiRequest } from '../../api/ApiRequests';

const { Title, Text } = Typography;
const { Search } = Input;

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('all');
    const [products, setProducts] = useState([]);
    const [hotProducts, setHotProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0
    });

    const fetchCategories = async () => {
        try {
            const response = await CategoryApiRequest.getAllCategories();
            setCategories(response.data.$values);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    const fetchProducts = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            // Calculate skip for pagination (0-based index for the API)
            const skip = (page - 1) * pageSize;
            
            // Use the updated API request with pagination parameters
            const response = await ProductApiRequest.getAllProducts(skip, pageSize);
            
            // Assuming the API returns pagination information
            setProducts(response.data.$values);
            setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize,
                total: response.data.totalCount || response.data.$values.length
            });
            
            // Set hot products (this can be based on your business logic)
            setHotProducts(response.data.$values.filter(p => p.isHot || p.discountPercentage > 10));
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const handlePageChange = (page, pageSize) => {
        fetchProducts(page, pageSize);
    };

    // If we have a search term, filter the products on the client side
    // For a real app, you might want to send the search to the API
    const filteredProducts = searchTerm ? 
        products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())) : 
        products;

    const combos = [
        {
            id: 1,
            name: 'Furniture Bundle',
            description: 'Buy any sofa + coffee table, get 15% OFF',
            category: 'Furniture',
            price: 15,
            image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png'
        },
        {
            id: 2,
            name: 'Home Decor Set',
            description: 'Buy any 3 decor items, get 20% OFF',
            category: 'Decor',
            price: 20,
            image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png'
        }
    ];

    const filteredCombos = combos.filter(combo => {
        const matchesSearch = combo.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <Flex vertical gap={24}>
            <Breadcrumb>
                <Breadcrumb.Item href={URLS.CUSTOMER.HOME}>Home</Breadcrumb.Item>
                <Breadcrumb.Item href={URLS.CUSTOMER.PRODUCTS}>Products</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <Image 
                    width={'100%'}
                    height={'100%'}
                    preview={false}
                    src='https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2Fminimalist-interior-design.jpg?alt=media&token=2fb4fddd-57d9-40bd-b07d-64fc7ec03602'
                    />
                </Col>
                <Col xs={0} sm={0} md={8} lg={8}>
                    <Image 
                    width={'100%'}
                    height={'100%'}
                    preview={false}
                    src='https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2Fhome-plant-vase-decoration-assortment.jpg?alt=media&token=e79674e6-f657-45be-a09a-87d3d5139a5f'
                    />
                </Col>
            </Row>

            <div style={{ textAlign: 'center' }}>
                <Title level={2}>Our Products</Title>
            </div>

            {/* Hot Sale Products */}
            <div>
                <Title level={3}>Hot Sale</Title>
                <Row gutter={[16, 16]}>
                    {hotProducts.map(product => (
                        <Col xs={12} sm={12} md={8} lg={6} key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Categories */}
            <div>
                <Title level={3}>Shop by Category</Title>
                <Row gutter={[32, 16]}>
                    {categories?.length > 0 && categories
                        .map(category => (
                            <Col xs={12} sm={8} md={6} lg={4} key={category.value}>
                                <CategoryCard image={category.imageUrl} title={category.name} slug={category.slug} />
                            </Col>
                        ))}
                </Row>
            </div>

            {/* Combo Sale Off */}
            <div>
                <Title level={3}>Special Combos</Title>
                <Row gutter={[16, 16]}>
                {filteredCombos.map(combo => (
                        <Col xs={12} sm={12} md={8} lg={6} key={combo.id}>
                            <ComboCard combo={combo} />
                        </Col>
                    ))}
                </Row>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={0} sm={0} md={12} lg={12}>
                    <Image 
                    preview={false}
                    src='https://firebasestorage.googleapis.com/v0/b/makemyhome-27df4.appspot.com/o/Banners%2FImages%2Fpicture-frame-by-velvet-armchair.jpg?alt=media&token=d4d0af61-4c75-4343-b618-e27160849bd2'
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Row gutter={[32, 16]} style={{ marginTop: '20px' }}>
                        {
                            filteredProducts.map(product => (
                                <Col xs={12} sm={12} md={12} lg={12} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))
                    }
                    </Row>
                </Col>
            </Row>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Pagination 
                    current={pagination.current} 
                    pageSize={pagination.pageSize} 
                    total={pagination.total} 
                    onChange={handlePageChange} 
                />
            </div>
        </Flex>
    );
};

export default Products;
