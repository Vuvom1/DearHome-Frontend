import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Card, Button, Spin, Row, Col, Typography, Space, Divider } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, HomeOutlined, FileOutlined } from '@ant-design/icons';
import {paymentApiRequest} from '../../api/ApiRequests';
import { URLS } from '../../constants/urls';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const VerifyPayment = () => {
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [paymentData, setPaymentData] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Handle both standard query parameters and hash-based routing parameters
                let searchParams;
                
                if (location.hash && location.hash.includes('?')) {
                    // Extract query parameters after the hash fragment
                    const hashParts = location.hash.split('?');
                    if (hashParts.length > 1) {
                        searchParams = new URLSearchParams('?' + hashParts[1]);
                    }
                } else {
                    // Standard query parameters
                    searchParams = new URLSearchParams(location.search);
                }
                
                // If still no parameters found, try parsing from the complete URL
                if (!searchParams || Array.from(searchParams.entries()).length === 0) {
                    const fullUrl = window.location.href;
                    const queryStart = fullUrl.indexOf('?');
                    if (queryStart !== -1) {
                        const queryString = fullUrl.substring(queryStart);
                        searchParams = new URLSearchParams(queryString);
                    }
                }
                
                if (!searchParams) {
                    throw new Error('Could not extract payment parameters from URL');
                }

                //handle orderCode
                let orderCode = searchParams.get('orderCode');
                if (orderCode) {
                    orderCode = orderCode.replace(/#\/verify-payment/g, '').replace(/#/g, '');
                }
                
                const paymentParams = {
                    code: searchParams.get('code'),
                    id: searchParams.get('id'),
                    cancel: searchParams.get('cancel') === 'true',
                    status: searchParams.get('status'),
                    orderCode: orderCode,
                };
    
                console.log('Payment parameters:', paymentParams);
    
                // Early check for obvious cancellation
                if (paymentParams.cancel || paymentParams.status !== 'PAID') {
                    setStatus('error');
                    return;
                }
    
                // Verify the payment with your backend
                const response = await paymentApiRequest.verifyPayment(paymentParams);
                
                setPaymentData(response.data);
                setStatus('success');
            } catch (error) {
                console.error('Payment verification failed:', error);
                setStatus('error');
            }
        };
    
        verifyPayment();
    }, [location]);

    if (status === 'loading') {
        return (
            <Content style={{ padding: '48px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card style={{ width: '100%', maxWidth: 600, textAlign: 'center', padding: 24 }}>
                        <Spin size="large" style={{ display: 'block', margin: '0 auto 24px' }} />
                        <Title level={3}>Verifying Payment</Title>
                        <Text type="secondary">Please wait while we confirm your transaction...</Text>
                    </Card>
                </div>
            </Content>
        );
    }

    if (status === 'success') {
        return (
            <Content style={{ padding: '48px 24px' }}>
                <Row justify="center">
                    <Col xs={24} md={16}>
                        <Card>
                            <div style={{ textAlign: 'center', padding: 16 }}>
                                <CheckCircleFilled style={{ fontSize: 60, color: '#52c41a', marginBottom: 16 }} />
                                <Title level={2}>Payment Successful!</Title>
                                <Paragraph style={{ fontSize: 18 }}>
                                    Your transaction has been completed successfully
                                </Paragraph>
                                
                                <Card style={{ background: '#f9f9f9', marginBottom: 24, textAlign: 'left' }}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={12}>
                                            <Text strong>Order ID:</Text> {paymentData?.orderCode || '-'}
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Text strong>Payment ID:</Text> {paymentData?.paymentId || '-'}
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Text strong>Amount:</Text> {paymentData?.amount?.toLocaleString()} VND
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Text strong>Date:</Text> {new Date().toLocaleString()}
                                        </Col>
                                    </Row>
                                </Card>
                                
                                <Space size="middle">
                                    {/* <Button type="primary" onClick={() => navigate(`/orders/${paymentData?.orderCode}`)}>
                                        <FileOutlined /> View Order Details
                                    </Button> */}
                                    <Button onClick={() => window.location.href = URLS.APP_URL}>
                                        <HomeOutlined /> Return to Home
                                    </Button>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        );
    }

    return (
        <Content style={{ padding: '48px 24px' }}>
            <Row justify="center">
                <Col xs={24} md={16}>
                    <Card>
                        <div style={{ textAlign: 'center', padding: 16 }}>
                            <CloseCircleFilled style={{ fontSize: 60, color: '#f5222d', marginBottom: 16 }} />
                            <Title level={2}>Payment Failed</Title>
                            <Paragraph style={{ fontSize: 18, marginBottom: 24 }}>
                                We couldn't verify your payment or the transaction was canceled.
                            </Paragraph>
                            <Button type="primary" onClick={() => window.location.href = URLS.APP_URL}>
                                <HomeOutlined /> Return to Home
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default VerifyPayment;