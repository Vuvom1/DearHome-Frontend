import { useState } from 'react'
import { Button } from 'antd'
import ConfigProvider from './contexts/ConfigProvvider'
import AppRouter from './AppRouter'

function App() {
  const [count, setCount] = useState(0)

  return (

    <ConfigProvider>
        <AppRouter />
    </ConfigProvider>
     
  )
}

export default App
