import React, { Component } from 'react'
// 引入绘制的图表
import {drawPie} from './chart.config.js'
// 引入加载中组件
import { Spin } from 'antd'
// 引入资产分布的数据
import {fundProtfolio} from '../../../../../mock/fund'
// accMul给数据乘以100
import { accMul } from '@/utils/fund.js'
// 引入echarts
import * as echarts from 'echarts'
// 引入当前页面的样式
import './index.less'

export default class index extends Component {
  state = {
    loading: true, // 资产分布模块是否显示加载中
    hasData: true, // 资产分布模块是否有数据
    assets: { // 资产分布图例右侧的数据
      bondToTotal: '',
      cashToTotal: '',
      otherTotal: '',
      stockToTotal: ''
    }
  }

  componentDidMount() {
    let hasData = true
    if (Object.keys(fundProtfolio).length > 0) {
      const {bondToTotal,cashToTotal,otherTotal,stockToTotal} = fundProtfolio
      hasData = true
      const assets = {
        bondToTotal: (bondToTotal && bondToTotal > 0) ? parseFloat(accMul(Math.round(accMul(bondToTotal, 10000)), 0.01)).toFixed(2) + '%' : '--',
        cashToTotal: (cashToTotal && cashToTotal > 0) ? parseFloat(accMul(Math.round(accMul(cashToTotal, 10000)), 0.01)).toFixed(2) + '%' : '--',
        otherTotal: (otherTotal && otherTotal > 0) ? parseFloat(accMul(Math.round(accMul(otherTotal, 10000)), 0.01)).toFixed(2) + '%' : '--',
        stockToTotal: (stockToTotal && stockToTotal > 0) ? parseFloat(accMul(Math.round(accMul(stockToTotal, 10000)), 0.01)).toFixed(2) + '%' : '--'
      }
      this.setState({
        assets
      },() => {
        this.initChart()
      })
    } else {
      hasData = false
    }
    this.setState({
      hasData
    })
  }
  /**
     * 绘制资产分布的图表
     *
    */
  initChart = () => {
    if (Object.keys(fundProtfolio).length > 0) {
      const draw = document.getElementById('pieChart')
      if (draw) {
        const myChart = echarts.init(draw)
        myChart.clear()
        myChart.setOption(drawPie(fundProtfolio))
        myChart.getZr().on('mousemove', _ => {
          myChart.getZr().setCursorStyle('default')
        })
      }
    }
    this.setState({
      loading: false
    })
  }
  render() {
    const {loading,hasData, assets}  = this.state
    return (
      <div className="assetsAllocation">
        <div className="assetsAllocation-top">
          <div className="assetsAllocation-top__title">资产分布</div>
          <div className="assetsAllocation-top__date">数据日期：{fundProtfolio.tradeDate}</div>
        </div>
        <Spin
          spinning={loading}
          tip="Loading..."
        >
          {
            hasData &&
            <div className="assetsAllocation-chart">
            <div id="pieChart" />
            <div className="data">
              <div>{ assets.stockToTotal }</div>
              <div>{ assets.cashToTotal }</div>
              <div>{ assets.bondToTotal }</div>
              <div>{ assets.otherTotal }</div>
            </div>
          </div>
          }
          {/* <Empty v-else empty-text="暂无数据" className="empty-box" /> */}
        </Spin>
      </div>
    )
  }
}
