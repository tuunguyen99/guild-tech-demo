'use client';
import React, { useState } from 'react';
import { Button, ConfigProvider, Flex, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined, LoginOutlined } from '@ant-design/icons';
import themeConfig from '../../../Theme/themeConfig';
import { css } from '@emotion/css';
interface ILoginForm {
  email: string;
  password: string;
  remember: boolean;
}
const useButtonStyle = () => {
  const { getPrefixCls } = React.useContext(ConfigProvider.ConfigContext);
  const btnPrefixCls = getPrefixCls('btn');

  return css`
    background: red;
    color: black;
    max-width: 100px;
    overflow: hidden;
    height: auto !important;
    white-space: normal !important;
    padding: 25px !important;
    .${btnPrefixCls}-icon {
      color: green;
    }
  `;
};
const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: ILoginForm) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const styles = useButtonStyle();
  return (
    <ConfigProvider theme={themeConfig} button={{ className: styles }}>
      <Flex justify='center'>
        <Form
          name='login'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ width: '400px', textAlign: 'center' }}
        >
          <Typography.Title level={2}>Sign in</Typography.Title>

          <Form.Item
            name='email'
            rules={[{ required: true, message: 'Please input your Email!' }]}
          >
            <Input
              prefix={<MailOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block={true}
              icon={<LoginOutlined />}
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
          <Button type='primary' size='small'>
            Log in
          </Button>
        </Form>
      </Flex>
    </ConfigProvider>
  );
};

export default LoginPage;
