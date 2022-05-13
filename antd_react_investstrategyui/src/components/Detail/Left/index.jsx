import React, { Component } from 'react'
import {Button} from 'antd'
import creatHistory from 'history/createBrowserHistory'
const history = creatHistory();

export default class Left extends Component {
  back = () => {
    history.goBack()
  }
  render() {
    return (
      <div className="leftBack">
        <Button className="btn" onClick={this.back}>返回</Button>
      </div>
    )
  }
}
