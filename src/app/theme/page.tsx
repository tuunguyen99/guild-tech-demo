'use client';
import { Button, Card, ConfigProvider, Input, Layout, theme } from 'antd';
import React from 'react';
import themeConfig from '../../../Theme/themeConfig';
import Navbar from '@/components/navbar/Navbar';

const customDarkAlgorithm = (seedToken: any, mapToken: any) => {
  const mergeToken = theme.darkAlgorithm(seedToken, mapToken);
  console.log('darktheme', mergeToken);

  return {
    ...mergeToken,
    colorBgLayout: '#ccc',
    colorBgContainer: '#c5c5c5',
    // colorBgElevated: '#32363e',
    // colorBgBase: '#252525',
    colorBgBase: '#ccc',
    colorTextBase: 'white',
    colorText: 'white',
    colorTextHeading: 'white',
    colorPrimary: '#ccc',
    blue1: 'red'
  };
};

const ThemePage = () => {
  console.log('theme', theme.useToken().token);

  return (
    <ConfigProvider
      theme={{
        ...themeConfig,
        algorithm: [customDarkAlgorithm]
      }}
    >
      <Layout>
        <Card style={{ width: '600px', margin: 'auto' }}>
          <h1>Card</h1>
          <Input />
          <Button type='primary'>Submit</Button>
          <Navbar />
        </Card>
      </Layout>
    </ConfigProvider>
  );
};

export default ThemePage;
