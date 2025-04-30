import { useState } from 'react'
import { Button, message, App as AntApp } from 'antd'
import ConfigProvider from './contexts/ConfigProvvider'
import AppRouter from './AppRouter'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './store/reducers/AuthReducer'
import cartReducer from './store/reducers/CartReducer'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  }
})

function App() {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <Provider store={store}>
      <ConfigProvider>
        <GoogleOAuthProvider clientId="197676092937-n40lf4fsir6v2p7nfl1hpfrrrm93r70v.apps.googleusercontent.com">
          <AntApp>
            {contextHolder}
            <AppRouter />
          </AntApp>
        </GoogleOAuthProvider>
      </ConfigProvider>
    </Provider>
  )
}

export default App
