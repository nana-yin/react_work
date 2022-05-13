import React, { Component } from 'react'
import './index.css'

export default class Footer extends Component {
  handleChange = (event) => {
    this.props.changeAllDone(event.target.checked)
  }
  handleClearDone = () => {
    this.props.clearDone()
  }
  render() {
    const {todos} = this.props
    const doneCount = todos.reduce((pre,currentObj) => {
      return pre + (currentObj.done ? 1 : 0)
    }, 0)
    const total = todos.length
    return (
      <div className="todo-footer">
        <label>
          <input type="checkbox" checked={(doneCount === total) && (total !== 0)} onChange={this.handleChange}/>
        </label>
        <span>
          <span>已完成{doneCount}</span> / 全部{total}
        </span>
        <button className="btn btn-danger" onClick={this.handleClearDone}>清除已完成任务</button>
      </div>
    )
  }
}
