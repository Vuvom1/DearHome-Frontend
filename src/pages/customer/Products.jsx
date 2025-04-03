import { Typography, Card, Row, Col, Input, Select, Flex, Image } from 'antd';
import { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import CategoryCard from '../../components/CategoryCard';
import ComboCard from '../../components/ComboCard';
const { Title, Text } = Typography;
const { Search } = Input;

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');

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

    // Mock products data - replace with real API call later
    const products = [
        {
            id: 1,
            name: 'Modern Sofa',
            price: 799.99,
            category: 'Furniture',
            image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png'
        },
        {
            id: 2,
            name: 'Smart LED Light',
            price: 49.99,
            category: 'Electronics',
            image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png'
        },
        {
            id: 3,
            name: 'Coffee Table',
            price: 299.99,
            category: 'Furniture',
            image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png'
        },
        {
            id: 4,
            name: 'Wall Art',
            price: 89.99,
            category: 'Decor',
            image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png'
        }
    ];

    const categories = [
        { value: 'all', label: 'All Categories', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        { value: 'furniture', label: 'Furniture', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        { value: 'electronics', label: 'Electronics', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        { value: 'decor', label: 'Decor', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        { value: 'lighting', label: 'Lighting', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        { value: 'home-accessories', label: 'Home Accessories', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        { value: 'kitchen', label: 'Kitchen', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        { value: 'bathroom', label: 'Bathroom', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        { value: 'bedroom', label: 'Bedroom', image: 'https://product.hstatic.net/1000280685/product/den_noti_757ede804a0040c680335ad6ab94b796_compact.png' },
        
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || product.category.toLowerCase() === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <Flex vertical gap={24}>

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
                    {filteredProducts
                        .filter(product => product.price > 200) // Example condition for "hot" products
                        .map(product => (
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
                    {categories
                        .filter(cat => cat.value !== 'all')
                        .map(category => (
                            <Col xs={12} sm={8} md={6} lg={4} key={category.value}>
                                <CategoryCard image={category.image} title={category.label} />
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
                            products.map(product => (
                                <Col xs={12} sm={12} md={12} lg={12} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))
                    }
                    </Row>
                </Col>
            </Row>
        </Flex>
    );
};

export default Products;
