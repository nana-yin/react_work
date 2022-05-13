// 创建“外壳”组件App
import React,{Component} from 'react';
import axios from 'axios'

//创建并且暴露App组件
export default class App extends Component {
  getData = () => {
    axios.get('http://localhost:3000/api/search/users2').then(res => {
      console.log('请求到的数据', res.data)
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.getData}>点我请求数据</button>
      </div>
    )
  }
}