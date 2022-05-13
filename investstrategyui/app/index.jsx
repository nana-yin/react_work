// 引入react核心库
import React from 'react'
// 引入reactDom
import ReactDom from 'react-dom'
// 引入App组件
import App from './pages/App'
// 引入antd的样式
import 'antd/dist/antd.less'
import { HashRouter } from 'react-router-dom'
// 引入当前页面的样式
import './index.less'

ReactDom.render(
    <HashRouter>
      <App />
    </HashRouter>,
    document.getElementById('root')
)
