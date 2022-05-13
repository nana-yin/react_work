// 创建“外壳”组件App
import React,{Component} from 'react';
import Header from './components/Header';
import List from './components/List';
import Footer from './components/Footer';
import "./App.css"
//创建并且暴露App组件
export default class App extends Component {
  state = {
    todos: [
      {id: '001', name: '吃饭', done: true},
      {id: '002', name: '睡觉', done: true},
      {id: '003', name: '打代码', done: false},
      {id: '004', name: '逛街', done: true},
    ]
  }
  // 添加一个todo
  addTodo = (todoObj) => {
    const {todos} = this.state
    this.setState({
      todos: [todoObj, ...todos]
    })
  }

  // 修改一个todo
  updateTodo = (id, done) => {
    const {todos} = this.state
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return {...todo, done: done}
      } else {
        return todo
      }
    })
    this.setState({
      todos: newTodos
    })
  }

  // 删除某一个待办事件的回调
  deleteObj = (id) => {
    const {todos} = this.state
    const newTodos = todos.filter(todoObj => {
      return todoObj.id !== id
    })
    this.setState({
      todos: newTodos
    })
  }

  // 全选按钮的更改事件回调
  changeAllDone = (done) => {
    const {todos} = this.state
    const newTodos = todos.map(todoObj => {
      return {...todoObj, done: done}
    })
    this.setState({
      todos: newTodos
    })
  }

  // 清除已完成的任务的回调
  clearDone =() => {
    const {todos} = this.state
    const newTodos = todos.filter(todoObj => {
      return !todoObj.done
    })
    this.setState({
      todos: newTodos
    })
  }
  render() {
    const {todos} = this.state
    return (
      <div className="todo-container">
        <div className="todo-wrap">
          <Header addTodo={this.addTodo} />
          <List todos={todos} updateTodo={this.updateTodo} deleteObj={this.deleteObj}/>
          <Footer todos={todos} changeAllDone={this.changeAllDone} clearDone={this.clearDone}/>
        </div>
      </div>
    )
  }
}