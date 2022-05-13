import React, { Component } from 'react'
import PubSub from 'pubsub-js'
// import axios from 'axios'

export default class Search extends Component {
  search = async () => {
    // 获取用户的输入(连续结构赋值+重命名)
    const {keyWordElement:{value: keyword}} = this
    // 判断当前页面是否是首次展示
    PubSub.publish('searchMess',{isFirst: false,isLoading: true})
    // axios发送请求
    // axios.get("/api/search/users2?q="+keyword).then(res => {
    //   console.log('请求到的数据', res)
    //   // 请求成功时设置List中的数据
    //   PubSub.publish('searchMess',{isLoading: false,userList: res.data.items})
    // }).catch(err => {
    //   // 请求失败时设置List中的数据
    //   PubSub.publish('searchMess',{isLoading: false,err: err.message})
    // })


    // fetch发送请求（未优化）
    // fetch(`/api/search/users2?q=${keyword}`).then(
    //   response => {
    //     console.log('联系服务器成功了',response)
    //     // 返回的promise对象是当前then的返回值
    //     // 当网络地址出错的时候，返回的是undefined，状态是成功
    //     return response.json()
    //   },
    //   error => {
    //     // 当网络连接失败的时候，状态是失败
    //     console.log('联系服务器失败了',error)
    //     // 为了截断promise，返回一个初始化状态的promise实例
    //     return new Promise(() => {})
    //   }
    // ).then(
    //   res => {
    //     console.log('拿到的数据', res)
    //   },
    //   err => {
    //     console.log('获取数据失败了', err)
    //   }
    // )


    // fetch发送请求（优化1）
    // fetch(`/api/search/users2?q=${keyword}`).then(
    //   response => {
    //     console.log('联系服务器成功了',response)
    //     // 返回的promise对象是当前then的返回值
    //     // 当网络地址出错的时候，返回的是undefined，状态是成功
    //     return response.json()
    //   }
    // ).then(
    //   res => {
    //     console.log('拿到的数据', res)
    //   }
    // ).catch(
    //   err => {
    //     console.log('报错',err)
    //   }
    // )

    // 最终版本
    try {
      const response = await fetch(`/api/search/users2?q=${keyword}`)
      const result = await response.json()
      PubSub.publish('searchMess',{isLoading: false,userList: result.items})
    } catch (err) {
      console.log('请求失败',err)
      PubSub.publish('searchMess',{isLoading: false,err: err.message})
    }
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
