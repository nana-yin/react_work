import React, { Component } from 'react'
import './index.css'

export default class List extends Component {
  render() {
    const {userList,isFirst,isLoading,err} = this.props.state
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
