import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Rate, 
  Input, 
  Button, 
  Form, 
  message, 
  Spin, 
  Divider, 
  Space, 
  Image,
  Row,
  Col,
  Result,
  Tag,
  List,
  Avatar
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewApiRequest, orderApiRequest, VariantApiRequest } from '../../api/ApiRequests';
import { URLS } from '../../constants/urls';
import { useSelector } from 'react-redux';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ReviewOrder = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [error, setError] = useState(null);
  const [existingReviews, setExistingReviews] = useState({});

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderApiRequest.getOrderById(id);
        console.log('Order Details:', response.data);
        setOrderDetails(response.data);
        
        // Process existing reviews for the order
        const reviewMap = {};
        
        // Look for reviews in orderDetails
        if (response.data.orderDetails && response.data.orderDetails.$values) {
          response.data.orderDetails.$values.forEach(detail => {
            if (detail.reviews && detail.reviews.$values && detail.reviews.$values.length > 0) {
              // Find the variant associated with this order detail
              let variantId = detail.variantId;
              
              // Extract the first review (assuming one review per orderDetail)
              const review = detail.reviews.$values[0];
              
              // Add review to map with variantId as key
              reviewMap[variantId] = {
                ...review,
                variantId: variantId // Ensure variantId is included for reference
              };
            }
          });
        }
        
        setExistingReviews(reviewMap);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to fetch order details. Please try again later.');
        message.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [id]);

  // Enhanced function to find an object by its reference ID in the response data
  const findReferencedObject = (data, refId) => {
    if (!refId) return null;
    
    // Create a map of all objects with $id
    const objectsById = {};
    
    // Function to index all objects with $id
    const indexObjects = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      
      if (obj.$id) {
        objectsById[obj.$id] = obj;
      }
      
      // Index properties
      for (const key in obj) {
        if (key === '$ref' || key === '$id' || key === '$values') continue;
        
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          indexObjects(value);
        }
      }
      
      // Index arrays
      if (Array.isArray(obj)) {
        for (const item of obj) {
          indexObjects(item);
        }
      }
      
      // Index $values arrays
      if (obj.$values && Array.isArray(obj.$values)) {
        for (const item of obj.$values) {
          indexObjects(item);
        }
      }
    };
    
    // Index all objects in the data
    indexObjects(data);
    
    // Return the object with the matching $id
    return objectsById[refId] || null;
  };

  // Map orderDetails items to format needed for review
  const mapOrderItems = () => {
    if (!orderDetails || !orderDetails.orderDetails || !orderDetails.orderDetails.$values) {
      return [];
    }
    
    return orderDetails.orderDetails.$values.map(item => {
      // Get variant data - handle both direct objects and references
      let variantData = item.variant;
      if (variantData && variantData.$ref) {
        variantData = findReferencedObject(orderDetails, variantData.$ref);
      }
      if (!variantData) return null;
      
      // Get product data - handle both direct objects and references
      let productData = variantData.product;
      if (productData && productData.$ref) {
        productData = findReferencedObject(orderDetails, productData.$ref);
      }
      if (!productData) return null;
      
      // Get variant image URL
      let imageUrl = null;
      if (variantData.imageUrls && variantData.imageUrls.$values && variantData.imageUrls.$values.length > 0) {
        imageUrl = variantData.imageUrls.$values[0];
      } else if (productData.imageUrl) {
        imageUrl = productData.imageUrl;
      }
      
      // Check if user has already reviewed this variant
      const hasReview = existingReviews[variantData.id] !== undefined;
      
      return {
        variantId: variantData.id,
        productId: productData.id,
        productName: productData.name,
        variantName: variantData.sku || 'Default Variant',
        imageUrl: imageUrl,
        price: item.unitPrice,
        hasReview: hasReview,
        review: hasReview ? existingReviews[variantData.id] : null
      };
    }).filter(Boolean); // Remove null items
  };

  const handleVariantSelect = async (variantId) => {
    try {
      // Check if user has already reviewed this variant
      if (existingReviews[variantId]) {
        message.info('You have already reviewed this product');
        return;
      }
      
      // Find selected variant from the existing order data
      if (orderDetails && orderDetails.orderDetails && orderDetails.orderDetails.$values) {
        const orderItem = orderDetails.orderDetails.$values.find(item => {
          const variant = item.variant;
          if (typeof variant === 'object' && !variant.$ref) {
            return variant.id === variantId;
          } else if (variant.$ref) {
            const variantData = findReferencedObject(orderDetails, variant.$ref);
            return variantData && variantData.id === variantId;
          }
          return false;
        });
        
        if (orderItem) {
          const variant = typeof orderItem.variant === 'object' && !orderItem.variant.$ref 
            ? orderItem.variant 
            : findReferencedObject(orderDetails, orderItem.variant.$ref);
            
          const product = typeof variant.product === 'object' && !variant.product.$ref
            ? variant.product
            : findReferencedObject(orderDetails, variant.product.$ref);
          
          setSelectedVariant({
            id: variant.id,
            name: product.name,
            sku: variant.sku || 'Default Variant'
          });
          
          // Reset form fields when selecting a new variant
          form.resetFields();
          return;
        }
      }
      
      // Fallback to API call if needed
      const orderItems = mapOrderItems();
      const selectedItem = orderItems.find(item => item.variantId === variantId);
      
      if (selectedItem) {
        const response = await VariantApiRequest.getVariantsByProductId(selectedItem.productId);
        const variant = response.data.find(v => v.id === variantId);
        setSelectedVariant({
          id: variant.id,
          name: selectedItem.productName,
          sku: variant.sku || 'Default Variant'
        });
      } else {
        message.error('Variant not found');
      }
      
      // Reset form fields when selecting a new variant
      form.resetFields();
    } catch (error) {
      message.error('Failed to fetch variant details');
      console.error('Error fetching variant details:', error);
    }
  };

  const handleSubmitReview = async (values) => {
    if (!selectedVariant) {
      message.warning('Please select a product to review');
      return;
    }

    try {
      setSubmitting(true);
      
      // Find the orderDetail ID for the selected variant
      let orderDetailId = null;
      if (orderDetails && orderDetails.orderDetails && orderDetails.orderDetails.$values) {
        const orderDetail = orderDetails.orderDetails.$values.find(detail => {
          const variant = detail.variant;
          if (typeof variant === 'object' && !variant.$ref) {
            return variant.id === selectedVariant.id;
          } else if (variant.$ref) {
            const variantData = findReferencedObject(orderDetails, variant.$ref);
            return variantData && variantData.id === selectedVariant.id;
          }
          return false;
        });
        
        if (orderDetail) {
          orderDetailId = orderDetail.id;
        }
      }
      
      if (!orderDetailId) {
        message.error('Could not find order detail for this product');
        return;
      }
      
      // Format the review request according to the API definition
      const reviewData = {
        rating: values.rating,
        reviewText: values.reviewText,
        orderDetailId: orderDetailId
      };
      
      await reviewApiRequest.createReview(reviewData);
      message.success('Review submitted successfully');
      
      // Update local state to reflect the new review
      setExistingReviews(prev => ({
        ...prev,
        [selectedVariant.id]: {
          ...reviewData,
          variantId: selectedVariant.id, // Store for UI display purposes
          id: Date.now().toString(), // Temporary ID for UI purposes
          createdAt: new Date().toISOString()
        }
      }));
      
      // Reset form and selected variant
      form.resetFields();
      setSelectedVariant(null);
      
      // Refresh order details to get the updated review
      const response = await orderApiRequest.getOrderById(id);
      setOrderDetails(response.data);
    } catch (error) {
      message.error('Failed to submit review');
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Error"
        subTitle={error}
        extra={[
          <Button type="primary" onClick={() => navigate(URLS.CUSTOMER.ORDER_TRACKING)}>
            Back to Orders
          </Button>
        ]}
      />
    );
  }

  const orderItems = mapOrderItems();
  const hasAllReviews = orderItems.length > 0 && orderItems.every(item => item.hasReview);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Review Your Purchase</Title>
      <Text type="secondary">
        We value your feedback! Please share your thoughts on the products you purchased.
      </Text>
      
      <Divider />
      
      {orderDetails && orderDetails.orderDetails && orderDetails.orderDetails.$values && orderDetails.orderDetails.$values.length > 0 ? (
        <>
          <Title level={4}>Order Items</Title>
          
          {hasAllReviews && (
            <div style={{ marginBottom: '24px' }}>
              <Result
                status="success"
                title="Thank You for Your Feedback!"
                subTitle="You have reviewed all products from this order. Your feedback helps us improve our products and services."
                extra={[
                  <Button type="primary" onClick={() => navigate(URLS.CUSTOMER.ORDER_TRACKING)}>
                    Back to Orders
                  </Button>
                ]}
              />
            </div>
          )}
          
          <div style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              {orderItems.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.variantId}>
                  <Card 
                    hoverable={!item.hasReview}
                    style={{ 
                      cursor: item.hasReview ? 'default' : 'pointer',
                      borderColor: selectedVariant?.id === item.variantId ? '#1890ff' : undefined,
                      boxShadow: selectedVariant?.id === item.variantId ? '0 0 8px rgba(24,144,255,0.5)' : undefined
                    }}
                    onClick={() => !item.hasReview && handleVariantSelect(item.variantId)}
                    extra={item.hasReview && <Tag color="success" icon={<CheckCircleOutlined />}>Reviewed</Tag>}
                  >
                    <div style={{ textAlign: 'center' }}>
                      {item.imageUrl ? (
                        <Image
                          width={100}
                          height={100}
                          src={item.imageUrl}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                          preview={false}
                          style={{ objectFit: 'contain' }}
                        />
                      ) : (
                        <div style={{ width: 100, height: 100, background: '#f5f5f5', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Text type="secondary">No image</Text>
                        </div>
                      )}
                      <Text style={{ display: 'block', marginTop: 8 }} strong>{item.productName}</Text>
                      <Text type="secondary">{item.variantName}</Text>
                      
                      {item.hasReview && (
                        <div style={{ marginTop: 16, textAlign: 'left', border: '1px solid #f0f0f0', padding: '12px', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <Rate disabled defaultValue={item.review.rating} style={{ fontSize: '16px' }} />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {new Date(item.review.createdAt).toLocaleDateString()}
                            </Text>
                          </div>
                          <Paragraph 
                            style={{ marginBottom: 0, fontSize: '14px' }}
                            ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
                          >
                            {item.review.reviewText}
                          </Paragraph>
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          
          {selectedVariant && (
            <Card title={`Write a Review for ${selectedVariant.name}`} style={{ marginTop: 16 }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitReview}
              >
                <Form.Item
                  name="rating"
                  label="Rating"
                  rules={[{ required: true, message: 'Please rate this product' }]}
                >
                  <Rate allowHalf />
                </Form.Item>
                
                <Form.Item
                  name="reviewText"
                  label="Your Review"
                  rules={[{ required: true, message: 'Please write your review' }]}
                >
                  <TextArea 
                    rows={4} 
                    placeholder="Share your experience with this product..."
                    maxLength={1000}
                    showCount
                  />
                </Form.Item>
                
                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={submitting}
                    >
                      Submit Review
                    </Button>
                    <Button onClick={() => {
                      form.resetFields();
                      setSelectedVariant(null);
                    }}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <Text>No items found for this order.</Text>
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={() => navigate(URLS.CUSTOMER.ORDER_TRACKING)}>
                Back to Orders
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReviewOrder;