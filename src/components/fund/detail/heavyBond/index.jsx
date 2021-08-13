import React, { Component } from 'react'
// 引入绘制的图表
import {drawBar} from './chart.config.js'
// 引入加载中、表格组件
import { Spin, Table} from 'antd'
// 引入echarts
import * as echarts from 'echarts'
// 引入当前页面的样式
import './index.less'

export default class HeavyBond extends Component {
  state = {
    columns: [
      {
        title: '债券代码',
        dataIndex: 'fundId',
        key: 'fundId'
      },
      {
        title: '债券名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '占净值比',
        dataIndex: 'value',
        key: 'value',
        align: 'right'
      },
      {
        title: '券种类型',
        dataIndex: 'fundType',
        key: 'fundType',
        align: 'right'
      }
    ], // 表格的表头
    loading: true, // 当前模块是否处于加载中
    hasData: true, // 是否有数据
    tableData: [{
      name: '19青岛城投MTN001',
      value: 65.25,
      fundId: '000155',
      fundType: '可转债'
    },{
      name: '21光大银行小微债',
      value: 58.58,
      fundId: '123456',
      fundType: '利率债'
    },{
      name: '21湘高速SCPO02',
      value: 42.25,
      fundId: '987654',
      fundType: '可转债'
    },{
      name: '浦发转债',
      value: 65.80,
      fundId: '657235',
      fundType: '高收益信用债'
    },{
      name: '21招商银行小微债02',
      value: 72.00,
      fundId: '210258',
      fundType: '信用债'
    }], // 表格假数据
  }
  componentDidMount() {
    this.initChart()
  }
  /**
   * 图表初始化
  */
  initChart = () => {
    const {tableData} = this.state
    const barDom = document.getElementById('myChart')
    let hasData = true
    let xData = []
    if (tableData.length > 0) {
      tableData.map(item => {
        xData.push(item.name)
      })
      if (barDom) {
        const myChart = echarts.init(barDom)
        myChart.clear()
        myChart.setOption(drawBar(xData,tableData))
        window.addEventListener('resize', () => {
          myChart.resize()
        })
        myChart.getZr().on('mousemove', _ => {
          myChart.getZr().setCursorStyle('default')
        })
      }
      hasData = true
    } else {
      hasData = false
    }
    this.setState({
      hasData,
      loading: false
    })
  }
  render() {
    const {loading,hasData, columns, tableData} = this.state
    return (
      <div className="heavyBond">
        <div className="heavyBond-title">重仓债券</div>
        <Spin
          spinning={loading}
          tip="Loading..."
        >
          {
            hasData &&
            <div id="myChart" className="chart"/>
          }
          <Table columns={columns} rowKey="fundId" dataSource={tableData} pagination={false} />
          {/* <Empty v-else empty-text="暂无数据" className="empty-box" /> */}
        </Spin>
      </div>
    )
  }
}
