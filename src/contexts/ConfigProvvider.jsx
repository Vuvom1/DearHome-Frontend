import React from 'react';
import { ConfigProvider as AntConfigProvider } from 'antd';

const ConfigProvider = ({ children }) => {
  return (
    <AntConfigProvider
      theme={{
        token: {
          colorPrimary: '#090909',
          colorSecondary: '#FFCC00',
          colorBgTextActive: '#FFCC00',
          colorBgTextHover: '#FFCC00',
          colorBgContainer: '#FFFFFF',
          colorBgElevated: '#FFFFFF',
          colorBgSpotlight: '#FFCC00',
          colorBgBase: '#FFFFFF',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </AntConfigProvider>
  );
};

export default ConfigProvider;
