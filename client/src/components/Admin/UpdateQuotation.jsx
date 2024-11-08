import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Input, Card } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from "react-cookie";

const { Option } = Select;

const UpdateQuotation = () => {
  const [form] = Form.useForm();
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  useEffect(() => {
    fetchQuotation();
  }, [quotationId, token]);

  const fetchQuotation = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/quotations/${quotationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setQuotation(response.data);
      form.setFieldsValue({ 
        status: response.data.isApprove,
        amount: response.data.amount,
        description: response.data.description
      });
    } catch (error) {
      console.error('Error fetching quotation:', error);
      message.error('Failed to fetch quotation details');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (values.status === 'PROCESS') {
      message.error('You must change the status to update Status');
      return;
    }

    console.log('Submitting values:', values);
    try {
      const response = await axios.put(
        `http://localhost:8080/quotations/admin/${quotationId}?approveStatus=${values.status}`,
        { description: values.status === 'REJECTED' ? values.description : undefined },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('API response:', response.data);
      message.success('Quotation status updated successfully');
      navigate(-1);  // Điều hướng về trang Quotation
    } catch (error) {
      console.error('Error updating quotation status:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      message.error(`Failed to update quotation status: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '140px' }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Update Quotation</h2>}
        style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[
              { required: true, message: 'Please select a status' },
              { 
                validator: (_, value) => {
                  if (value === 'PROCESS') {
                    return Promise.reject('You must change the status to update Status');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Select>
              <Option value="FINISH">Accept</Option>
              <Option value="REJECTED">Rejected</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="description"
            label="Reason"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('status') === 'REJECTED' && (!value || value.trim() === '')) {
                    return Promise.reject(new Error('Description is required when rejecting a quotation'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              Update Status
            </Button>
            <Button onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateQuotation;
