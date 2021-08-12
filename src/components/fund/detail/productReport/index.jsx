import React, { Component } from 'react'
// 引入表格组件
import { Table } from 'antd'
// 引入表格的表头
import {columns} from './table.js'
// 引入当前页面的样式
import './index.less'

export default class ProductReport extends Component {
  state = {
    dataSource:[ // 产品文件的源数据
      {
        key: '1',
        title: '2021年报.pdf',
        type: '定期报告',
        releseDate: '2021-07-12'
      },
      {
        key: '2',
        title: '2021年报.pdf',
        type: '定期报告',
        releseDate: '2021-07-12'
      },
    ]
  }
  downFile = () => {
    console.log('下载文件')
  }
  render() {
    const {dataSource} = this.state
    return (
      <div className="productReport">
        <div className="title">
          产品报告
          <span className="count">（{dataSource.length}个）</span>
        </div>
        <Table dataSource={dataSource} columns={columns} pagination={false}/>
      </div>
    )
  }
}
