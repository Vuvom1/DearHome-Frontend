import { useState, useEffect } from 'react';
import { Form, Input, Button, Avatar, Typography, Row, Col, notification, Tabs, Flex, Breadcrumb, Card, Divider, Skeleton, Select, message, Spin, Checkbox } from 'antd';
import { LockOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { URLS } from '../../constants/urls';
import { authApiRequest } from '../../api/ApiRequests';
import { useSelector } from 'react-redux';
import {shippingApiRequest} from '../../api/ApiRequests';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {logoutUser} from '../../store/actions/AuthAction'
const { Title } = Typography;

const UserProfile = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([{ street: '', ward: '', district: '', city: '', postalCode: '', country: '', isDefault: false }]);
    const userId = useSelector((state) => state.auth.user.nameid);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [updating, setUpdating] = useState(false); // State for updating profile
    const [cities, setCities] = useState([]);
    const [districtsByAddress, setDistrictsByAddress] = useState([]); // Array of districts for each address
    const [wardsByDistrict, setWardsByDistrict] = useState([]); // Array of wards for each district

    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const fetchUser = async () => {
        setLoading(true); // Start loading
        try {
                const response = await authApiRequest.getUser(userId);
                setUser(response.data);
                const userAddresses = response.data.addresses.$values || [];
                
                setAddresses(userAddresses);
                setDistrictsByAddress(userAddresses.map(() => [])); // Initialize districts for each address
                setWardsByDistrict(userAddresses.map(() => [])); // Initialize wards for each address
            // Fetch districts for each address
                userAddresses.forEach((address, index) => {
                if (address.city) {
                    fetchDistricts(address.city, index); // Fetch districts for the city of each address
                }
                if (address.district) {
                    fetchWards(address.district, index); // Fetch wards for the district of each address
                }
            });
        } catch (error) {
            notification.error({ message: 'Failed to fetch user data' });
        } finally {
            setLoading(false); // End loading
        }
    }

    const fetchCities = async () => {
        try {
            const response = await shippingApiRequest.getCities();
            const cityOptions = response.data.map((city) => ({
                value: city.id,
                label: city.name,
            }));
            setCities(cityOptions);
        } catch (error) {
            console.error('Error fetching cities:', error);
            notification.error({ message: 'Failed to fetch cities' });
        }
    };

    const fetchDistricts = async (cityId, addressIndex) => {
        if (!cityId) return;
        
        setLoadingDistricts(true);
        try {
            const response = await shippingApiRequest.getDistrictsByCityId(cityId);
            const districtOptions = response.data.map((district) => ({
                value: district.id,
                label: district.name,
            }));

            console.log('Districts:', response);
            
            // Update districts for the specific address
            const newDistrictsByAddress = [...districtsByAddress];
            newDistrictsByAddress[addressIndex] = districtOptions;
            setDistrictsByAddress(newDistrictsByAddress);
        } catch (error) {
            console.error('Error fetching districts:', error);
            notification.error({ message: 'Failed to fetch districts' });
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtId, addressIndex) => {
        if (!districtId) return;
        setLoadingWards(true);
        try {
            const response = await shippingApiRequest.getWardsByDistrictId(districtId);
            const wardOptions = response.data.map((ward) => ({                  
                value: ward.id,
                label: ward.name,
            }));
            // Update wards for the specific district
            const newWardsByDistrict = [...wardsByDistrict];
            newWardsByDistrict[addressIndex] = wardOptions;
            setWardsByDistrict(newWardsByDistrict);             
        } catch (error) {
            console.error('Error fetching wards:', error);
                notification.error({ message: 'Failed to fetch wards' });
        } finally {
            setLoadingWards(false);
        }
    };

    const onFinish = async (values) => {
            const updatedUser = {
                    id: userId,
                    imageUrl: user.imageUrl,
                    name: values.name,
                    phoneNumber: values.phoneNumber,
                    dateOfBirth: user.dateOfBirth,
                    isActive: user.isActive,
                    customerPoints: user.customerPoints,
                    customerLevel: user.customerLevel,
                    addresses: addresses.map(address => ({
                        id: address.id,
                        street: address.street,
                        ward: address.ward.toString(),      
                        district: address.district,
                        city: address.city,
                        postalCode: address.postalCode,
                        country: address.country,
                        isDefault: address.isDefault
                    }))
            };

            console.log('Updated User:', updatedUser);

            setUpdating(true); // Start updating
            try {
                    await authApiRequest.updateUser(updatedUser);
                    message.success("Update profile successfully");
            } catch (error) {
                    notification.error({ message: 'Failed to update profile' });
                    console.log(error);
            } finally {
                    setUpdating(false); // End updating
            }
    };

    const handleAddAddress = () => {
            setAddresses([...addresses, { street: '', ward: '', district: '', city: '', postalCode: '', country: '', isDefault: false }]);
            setDistrictsByAddress([...districtsByAddress, []]);
            setWardsByDistrict([...wardsByDistrict, []]);
    };

    const handleRemoveAddress = (index) => {
        const newAddresses = addresses.filter((_, i) => i !== index);
        const newDistrictsByAddress = districtsByAddress.filter((_, i) => i !== index);
        const newWardsByDistrict = wardsByDistrict.filter((_, i) => i !== index);

        setAddresses(newAddresses);
        setDistrictsByAddress(newDistrictsByAddress);
        setWardsByDistrict(newWardsByDistrict);
            
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    }


    const handleAddressChange = (index, field, value) => {
            const newAddresses = [...addresses];
            newAddresses[index][field] = value;

            console.log(value)

            // If city is changed, fetch districts for that city
            if (field === 'city') {
                fetchDistricts(value, index);
                // Reset district when city changes
                newAddresses[index]['district'] = '';
            }

            // If district is changed, update the address
            if (field === 'district') {
                newAddresses[index]['postalCode'] = value;
                newAddresses[index]['ward'] = '';
                fetchWards(value, index);
            }

            // Mark only one address as default
            if (field === 'isDefault' && value) {
                    newAddresses.forEach((address, i) => {
                            if (i !== index) {
                                    address.isDefault = false; // Unmark other addresses
                            }
                    });
            }

            setAddresses(newAddresses);
    };

    useEffect(() => {
        fetchUser();
        fetchCities();
    }, []);

    
    const items = [
            {
                    key: '1',
                    label: 'Profile Information',
                    children: loading ? ( // Show skeleton while loading
                            <Skeleton active />
                    ) : (
                            <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={onFinish}
                                    initialValues={user}
                            >
                                    <Row>
                                            <Col xs={24}>
                                                    <Form.Item
                                                            name="name"
                                                            label="Full Name"
                                                            rules={[{ required: true, message: 'Please enter your name' }]}
                                                    >
                                                            <Input />
                                                    </Form.Item>
                                            </Col>
                                            <Col xs={24}>
                                                    <Form.Item
                                                            name="email"
                                                            label="Email"
                                                            rules={[
                                                                    { required: true, message: 'Please enter your email' },
                                                                    { type: 'email', message: 'Please enter a valid email' }
                                                            ]}
                                                    >
                                                            <Input />
                                                    </Form.Item>
                                            </Col>
                                            <Col xs={24}>
                                                    <Form.Item
                                                            name="phoneNumber"
                                                            label="Phone Number"
                                                            rules={[{ required: true, message: 'Please enter your phone number' }]}
                                                    >
                                                            <Input />
                                                    </Form.Item>
                                            </Col>
                                            <Col xs={24}>
                                                    <Typography.Title level={4}>Addresses</Typography.Title>
                                                    <Row>
                                                    {addresses.map((address, index) => (
                                                        <>
                                                            <Col xs={24} key={index}>
                                                                    <Row gutter={[8, 0]}>
                                                                    <Col xs={16}>
                                                                    <Form.Item
                                                                            label={`Street`}
                                                                            rules={[{ required: true, message: 'Please enter your address' }]}
                                                                    >
                                                                            <Input
                                                                                    placeholder='Enter Street'
                                                                                    value={address.street}
                                                                                    onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                                                                            />
                                                                    </Form.Item>
                                                                    </Col>
                                                                    <Col xs={8}>
                                                                    <Form.Item
                                                                            label="City"
                                                                            rules={[{ required: true, message: 'Please select your city' }]}
                                                                    >
                                                                            <Select
                                                                                placeholder='Select City'
                                                                                value={address.city}
                                                                                onChange={(value) => handleAddressChange(index, 'city', value)}
                                                                                options={cities}
                                                                                loading={loading}
                                                                            />
                                                                    </Form.Item>
                                                                    </Col>
                                                                    <Col xs={8}>
                                                                    <Form.Item
                                                                            label="District"
                                                                            rules={[{ required: true, message: 'Please select your district' }]}
                                                                    >
                                                                            <Select
                                                                                placeholder={address.city ? 'Select District' : 'Select City First'}
                                                                                value={address.district}
                                                                                onChange={(value) => handleAddressChange(index, 'district', value)}
                                                                                options={districtsByAddress[index]}
                                                                                loading={loadingDistricts}
                                                                                disabled={!address.city}
                                                                            />
                                                                    </Form.Item>
                                                                    </Col>
                                                                    <Col xs={8}>
                                                                    <Form.Item
                                                                            label="Ward"
                                                                            rules={[{ required: true, message: 'Please select your ward' }]}
                                                                    >
                                                                            <Select
                                                                                placeholder={address.district ? 'Select Ward' : 'Select District First'}
                                                                                value={address.ward}
                                                                                onChange={(value) => handleAddressChange(index, 'ward', value)}
                                                                                options={wardsByDistrict[index]}
                                                                                loading={loadingWards}
                                                                                disabled={!address.district}
                                                                            />
                                                                    </Form.Item>
                                                                    </Col>
                                                                    <Col xs={8}>
                                                                    <Form.Item
                                                                            label="Postal Code"
                                                                            rules={[{ required: true, message: 'Please enter your postal code' }]}
                                                                    >
                                                                            <Input
                                                                                    placeholder='Enter Postal Code'
                                                                                    value={address.postalCode}
                                                                                    onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                                                                            />
                                                                    </Form.Item>
                                                                    </Col>
                                                                    <Col xs={8}>
                                                                    <Form.Item
                                                                            label="Country"
                                                                            rules={[{ required: true, message: 'Please select your country' }]}
                                                                    >
                                                                        <Input
                                                                                value={address.country}
                                                                                onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                                                                                placeholder='Enter Country'
                                                                                />
                                                                    </Form.Item>
                                                                    </Col>
                                                                    </Row>
                                                            </Col>
                                                            <Col style={{display: 'flex', justifyContent: 'space-between'}} xs={24}>
                                                                <Checkbox style={{alignItems: 'center'}} checked={address.isDefault} onChange={() => { handleAddressChange(index, 'isDefault', !address.isDefault);}}>Default</Checkbox>
                                                             <Button type="link" onClick={() => handleRemoveAddress(index)}>Remove</Button>
                                                            </Col>
                                                            <Divider />
                                                            </>
                                                    ))}
                                                    </Row>
                                                    <Button style={{width: '100%'}} type="dashed" onClick={handleAddAddress}>
                                                            <PlusOutlined /> Add Address
                                                    </Button>
                                            </Col>
                                            <Col style={{textAlign: 'right', marginTop: 16}}  xs={24}>
                                                    <Button type="primary" htmlType="submit" loading={updating}>
                                                            Save Changes
                                                    </Button>
                                            </Col>
                                    </Row>
                            </Form>
                    )
            },
            // Other tabs remain unchanged...
    ];

    // Rest of the component remains unchanged...
    
    return (
            <Flex vertical gap={32}>
                    <Breadcrumb>
                            <Breadcrumb.Item href={URLS.CUSTOMER.HOME}>Home</Breadcrumb.Item>
                            <Breadcrumb.Item href={URLS.CUSTOMER.PROFILE}>Profile</Breadcrumb.Item>
                    </Breadcrumb>

                    <Flex vertical align="center" gap={16}>
                            <Avatar size={100} src={user?.imageUrl || "https://product.hstatic.net/1000280685/product/mmh00286_802f4da93114489f9e12fda7ae52f7c7_large.jpg"} />
                            <Typography.Title level={2}>{user?.name || 'John Doe'}</Typography.Title>
                            <Typography.Text type="secondary">Member since {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</Typography.Text>
                    </Flex>

                    <Card>
                            <Tabs tabBarExtraContent={<Button icon={<LogoutOutlined />} onClick={() => handleLogout()} >Logout</Button>}
                            defaultActiveKey="1" items={items} />
                    </Card>
            </Flex>
    );
};

export default UserProfile;
