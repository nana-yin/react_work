import React, { Component } from 'react'
import './index.css'
import {nanoid} from 'nanoid'
import PropTypes from 'prop-types'

export default class Header extends Component {
  // 对接收的props进行限制
  static propTypes = {
    addTodo: PropTypes.func.isRequired
  }
  // 对键盘事件的回调
  handleKeyUp = (event) => {
    const {target, keyCode} = event
    const todoObj = {
      id: nanoid(),
      name: target.value,
      done: false
    }
    // 当输入的数据为空，则警告
    if(target.value.trim() === '') {
      alert('输入的数据不能为空')
      return
    }
    // 当敲击回车时，将数据传递给父组件
    if (keyCode === 13) {
      this.props.addTodo(todoObj)
      target.value = ''
    }
  }
  render() {
    return (
      <div className="todo-header">
        <input type="text" placeholder="请输入你的任务名称，按回车键确认" onKeyUp={this.handleKeyUp}/>
      </div>
    )
  }
}
