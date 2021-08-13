import React, { Component } from 'react'
// 引入表格组件
import { Table } from 'antd'
// 引入表格的表头
import {columns} from './table.js'
// 引入当前页面的样式
import './index.less'

export default class SeriesProduct extends Component {
  state = {
    dataSource:[ // 系列产品的源数据
      {
        key: '1',
        serialNum: '0325484',
        title: '国联安优选',
        mainCode: '0211654',
        productCode: '01',
        name: '国联安优选行业',
        abbName: '国联安'
      },
      {
        key: '2',
        serialNum: '0325484',
        title: '国联安优选',
        mainCode: '0211654',
        productCode: '01',
        name: '国联安优选行业',
        abbName: '国联安'
      },
      {
        key: '3',
        serialNum: '0325484',
        title: '国联安优选',
        mainCode: '0211654',
        productCode: '01',
        name: '国联安优选行业',
        abbName: '国联安'
      }
    ]
  }
  render() {
    const {dataSource} = this.state
    return (
      <div className="seriesProduct">
        <div className="title">系列产品</div>
        <Table dataSource={dataSource} columns={columns} pagination={false}/>
      </div>
    )
  }
}
