import React, { Component } from 'react'
// 引入搜索框
import Search from '../../components/FundDetail/Search'
// 引入该页面的样式
import './index.less'

class ProductCenter extends Component {
  render () {
    return (
        <div className="productCenter">
          <span className="productCenter-title">产品搜索：</span>
          <Search />
        </div>
    )
  }
}
export default ProductCenter
