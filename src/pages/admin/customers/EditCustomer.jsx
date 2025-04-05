import React from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const EditCustomer = ({ 
  editModalVisible, 
  setEditModalVisible, 
  form, 
  handleEditSubmit 
}) => {
  return (
    <Modal
      title="Edit Customer"
      open={editModalVisible}
      onCancel={() => setEditModalVisible(false)}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleEditSubmit}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="First Name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Last Name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input placeholder="Phone Number" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
        >
          <Input.TextArea rows={3} placeholder="Address" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
            <Button onClick={() => setEditModalVisible(false)}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCustomer;