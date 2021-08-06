import React, { PureComponent } from 'react'
// 引入搜索框
import Search from '@/components/fund/search'
// 引入该页面的样式
import './index.less'
// import PropTypes from 'prop-types'
// import { connect } from 'umi'
// @connect(({ post, loading }) => ({ post, loading }))

class AssetCenter extends PureComponent {
  state = {
  }
  componentDidMount() {
  }
  render() {
      return (
        <div className="assetCenter">
          <span className="assetCenter-title">产品搜索：</span>
          <Search />
        </div>
      )
  }
}

// AssetCenter.propTypes = {
//   post: PropTypes.object,
//   loading: PropTypes.object,
//   location: PropTypes.object,
//   dispatch: PropTypes.func,
// }

export default AssetCenter
