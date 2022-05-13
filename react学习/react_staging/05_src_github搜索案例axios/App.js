import React, { Component } from 'react'
import Search from './components/Search'
import List from './components/List'

export default class App extends Component {
  state = {
    userList: [], // 页面的用户列表
    isFirst: true, // 是否是首次展示页面
    isLoading: false, // 页面是否处于加载状态
    err: '' // 请求失败的错误信息
  }
  
  // 更改app中数据的状态
  updateState = (stateObj) => {
    this.setState(stateObj)
  }

  render() {
    return (
      <div className="container">
        <Search updateState={this.updateState}/>
        <List state={this.state}/>
      </div>
    )
  }
}
