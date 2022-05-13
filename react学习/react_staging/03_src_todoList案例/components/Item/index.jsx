import React, { Component } from 'react'
import './index.css'

export default class Item extends Component {
  state = {
    mouseover: false
  }
  // 鼠标移入、移出事件
  handleMouseOver = (mouseover) => {
    return () => {
      this.setState({
        mouseover: mouseover
      })
    }
  }
  // 选择框状态改变
  handleChange = (id) => {
    return (event) => {
      this.props.updateTodo(id, event.target.checked)
    }
  }
  // 删除选中的todo的回调
  handleDelete(id) {
    if (window.confirm('确定要删除这组数据吗？')) {
      this.props.deleteObj(id)
    }
  }
  render() {
    const {id, name, done} = this.props
    const {mouseover} = this.state
    return (
      <div>
        <li style={{background: mouseover ? '#ddd' : '#fff'}} onMouseOver={this.handleMouseOver(true)} onMouseOut={this.handleMouseOver(false)}>
          <label>
            <input type="checkbox" checked={done} onChange={this.handleChange(id)}/>
            <span>{name}</span>
          </label>
          <button className="btn btn-danger" style={{display: mouseover? 'block' : 'none'}} onClick={() => this.handleDelete(id)}>删除</button>
        </li>
      </div>
    )
  }
}
