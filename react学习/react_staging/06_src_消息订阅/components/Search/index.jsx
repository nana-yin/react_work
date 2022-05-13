import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'

export default class Search extends Component {
  search = () => {
    // const {updateState} = this.props
    // 获取用户的输入(连续结构赋值+重命名)
    const {keyWordElement:{value: keyword}} = this
    console.log(keyword)
    // 判断当前页面是否是首次展示
    // updateState({isFirst: false,isLoading: true})
    PubSub.publish('searchMess',{isFirst: false,isLoading: true})
    // axios发送请求
    axios.get("/api/search/users2?q="+keyword).then(res => {
      console.log('请求到的数据', res)
      // 请求成功时设置List中的数据
      // updateState({isLoading: false,userList: res.data.items})
      PubSub.publish('searchMess',{isLoading: false,userList: res.data.items})
    }).catch(err => {
      // 请求失败时设置List中的数据
      // updateState({isLoading: false,err: err.message})
      PubSub.publish('searchMess',{isLoading: false,err: err.message})
    })
  }
  render() {
    return (
      <section className="jumbotron">
        <h3 className="jumbotron-heading">Search Github Users</h3>
        <div>
          <input type="text" ref={c => this.keyWordElement = c} placeholder="请输入关键词" />&nbsp;<button onClick={this.search}>搜索</button>
        </div>
      </section>
    )
  }
}
