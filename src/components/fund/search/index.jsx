import React, { Component } from 'react'
// 引入输入框
import { Input, Spin  } from 'antd'
// 引入icon
import { SearchOutlined } from '@ant-design/icons';
// 引入当前页面样式
import './index.less'

export default class Search extends Component {
  state = {
    list: [], // 搜索的数据列表
    searchval: '', // 搜索的关键字
    isShowContent: false, // 搜索的内容是否需要展示
    loading: false, // 列表是否处于加载中
    hasMore: true, // 列表是否有更多内容
  }
  componentDidMount() {
    // 调用接口，为list数据赋值
    // todo....
    // 监听滚动
    const typeBoxRes = document.getElementsByClassName('assetCenter-search__content')[0]
    typeBoxRes.addEventListener('scroll', e => {
      const dom = e.target
      if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight) {
        this.onScroll()
      }
    })
  }
  /**
   * 滚动事件
   * @param event 监听的滚动事件
  */
  onScroll = () => {
    // 调用接口，为list追加数据
    // todo....
    const {list,searchval} = this.state
    this.setState({
      loading: true,
      searchval
    },() => {
      const resList = []
      for (let i = list.length; i < list.length + 10;i++) { // 假数据
        let obj = {
          name: `第${i}个基金`,
          id: i
        }
        resList.push(obj)
      }
      this.setState({
        list: list.concat(resList),
      },() => {
        this.setState({
          isShowContent: true,
          loading: false
        })
      })
    })
  }
  /**
   * 输入框中按下回车，进行数据的搜索，一次10个
  */
  handleSearch = (e) => {
    // 调用接口，为list数据赋值
    // todo....
    const searchval = e.target.value
    if (searchval.trim()) {
      this.setState({
        loading: true,
        searchval
      },() => {
        const resList = []
        for (let i = 0; i < 11;i++) { // 假数据
          let obj = {
            name: `第${i}个基金`,
            id: i
          }
          resList.push(obj)
        }
        this.setState({
          list: resList,
        },() => {
          this.setState({
            isShowContent: true,
            loading: false
          })
        })
      })
    } else {
      this.setState({
        isShowContent: false
      })
    }
  }
  render() {
    const {list, isShowContent,loading} = this.state
    return (
      <div className="assetCenter-search">
        <Input placeholder="请输入产品名称/代码" prefix={<SearchOutlined />} onChange={e => this.handleSearch(e)} onPressEnter={e => this.handleSearch(e)}/>
        <div className="assetCenter-search__content" style={{display: isShowContent ? 'block' : 'none'}}>
          <Spin spinning={loading}>
            {
              (list.length > 0) && 
              list.map(item => {
                return (
                  <div className="fund" key={item.id}>
                    <span className="fundName">{item.name}</span>
                    <span className="fundId">{item.id}</span>
                  </div>
                )
              })
            } {
              list.length === 0 &&
              <div className="noData">暂无数据！</div>
            }
          </Spin>
        </div>
      </div>
    )
  }
}
