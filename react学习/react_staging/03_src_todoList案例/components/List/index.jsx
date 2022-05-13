import React, { Component } from 'react'
import Item from '../Item'
import './index.css'
import PropTypes from 'prop-types'

export default class List extends Component {
  // 对接收的props进行限制
  static propTypes = {
    todos: PropTypes.array.isRequired,
    updateTodo: PropTypes.func.isRequired,
    deleteObj: PropTypes.func.isRequired
  }
  render() {
    const {todos, updateTodo, deleteObj}  = this.props
    return (
      <ul className="todo-main">
        {
          todos.map(todo => {
            return <Item key={todo.id} {...todo} updateTodo={updateTodo} deleteObj={deleteObj}/>
          })
        }
      </ul>
    )
  }
}
