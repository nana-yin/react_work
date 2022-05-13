import React, { Component } from 'react'
// 引入表格组件
import { Table } from 'antd'
// 下载的icon
import downLoad from '../../../../images/downFile.png'
// 引入当前页面的样式
import './index.less'
export default class ProductReport extends Component {
  state = {
    columns: [ // 产品报告的表头
      {
        title: '文档名称',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: '发布日期',
        dataIndex: 'releseDate',
        key: 'releseDate'
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: () => <img src={downLoad} className="downLoad"/>
      }
    ],
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
    const {dataSource,columns} = this.state
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
