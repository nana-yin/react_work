import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import './index.css'

export default class List extends Component {
  state = {
    userList: [], // 页面的用户列表
    isFirst: true, // 是否是首次展示页面
    isLoading: false, // 页面是否处于加载状态
    err: '' // 请求失败的错误信息
  }
  componentDidMount() {
    // 订阅消息
    this.token = PubSub.subscribe('searchMess',(_,stateObj) =>{
      this.setState(stateObj)
    })
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token)
  }
  render() {
    const {userList,isFirst,isLoading,err} = this.state
    return (
      <div className="row">
        {
          isFirst ? <h2>欢迎使用，请输入关键词进行搜索</h2> : 
          isLoading ? <h2>数据正在来的路上...</h2> :
          err ? <h2 style={{color: 'red'}}>{err}</h2> :
          userList.map(item => {
            return (
              <div className="card" key={item.id}>
                <a href={item.html_url} target="_blank" rel="noreferrer">
                  <img alt="" src={item.avatar_url} style={{width: '100px'}}/>
                </a>
                <p className="card-text">{item.login}</p>
              </div>
            )
          })
        }
      </div>
    )
  }
}
