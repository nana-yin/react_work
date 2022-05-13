import React, { Component } from 'react'
// 引入债券类型的中英对照
import { isEmpty,BOND_CH } from '../../../../util/fund.js'
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
    columns:[
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
        align: 'right',
        render: text => <span>{!isEmpty(text) ? text.toFixed(2)+'%' : '--'}</span>,
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
    tableData: [], // 表格数据
  }
  componentDidMount() {
    this.initChart()
  }
  /**
   * 图表初始化
  */
  initChart = () => {
    const bondList = [
        {
          "tradeDate": "2021-06-30",
          "bondCode": "010107.SH",
          "mktToNav": 8.520000457763672,
          "bondName": "21国债(7)",
          "investType": "interest_rate_bond"
        },
        {
          "tradeDate": "2021-06-30",
          "bondCode": "113009.SH",
          "mktToNav": 4,
          "bondName": "广汽转债",
          "investType": "convert_bond"
        },
        {
          "tradeDate": "2021-06-30",
          "bondCode": "127018.SZ",
          "mktToNav": 3.380000114440918,
          "bondName": "本钢转债",
          "investType": "convert_bond"
        },
        {
          "tradeDate": "2021-06-30",
          "bondCode": "110070.SH",
          "mktToNav": 3.259999990463257,
          "bondName": "凌钢转债",
          "investType": "convert_bond"
        },
        {
          "tradeDate": "2021-06-30",
          "bondCode": "127023.SZ",
          "mktToNav": 3.109999895095825,
          "bondName": "华菱转2(退市)",
          "investType": "convert_bond"
        }
      ] // 后端假数据
    const {tableData} = this.state
    this.setState({
      tableData: []
    },() => {
      if (bondList && bondList.length > 0) {
        bondList.map((item, index) => {
          const obj = {
            key: `${index}`,
            name: item.bondName || '--',
            value: item.mktToNav || '--',
            fundId: item.bondCode || '--',
            fundType: BOND_CH[item.investType] || '--'
          }
          tableData.push(obj)
        })
      }
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
        tableData,
        hasData,
        loading: false
      })
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
          {
            !hasData &&
            <span>暂无数据</span>
          }
          <Table columns={columns} rowKey="fundId" dataSource={tableData} pagination={false} />
        </Spin>
      </div>
    )
  }
}
