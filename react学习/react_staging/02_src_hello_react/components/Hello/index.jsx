import React, {Component} from 'react'
// 样式的模块化
import hello from './index.module.css'

export default class Hello extends Component {
  render(){
    return (
      <h1 className={hello.title}>
        Hello,React!
      </h1>
    )
  }
}
