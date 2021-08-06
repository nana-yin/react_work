import React, { Component } from 'react'
import * as echarts from 'echarts';
import { accMul } from '../../../utils/asset'
import { getDashChart } from './chart.config'
import './index.less'

export default class DashboardChart extends Component {
  state = {
    markData: 3, // 市场拥挤度
    trendData: 100,
    winRate: null,
    profitLossRatio: null,
    dashBoardInitData: {} // 从后端获取的数据
  }
  componentDidMount() {
    const {drawChart} = this.props
    if (Object.keys(drawChart).length > 0) {
      const dashBoardInitDataRes = JSON.parse(JSON.stringify(drawChart.detail))
      const markDataRes = dashBoardInitDataRes.mktCongestion.length === 0 ? null : (accMul(accMul(dashBoardInitDataRes.mktCongestion[dashBoardInitDataRes.mktCongestion.length - 1], 100), 0.01)).toFixed(2)
      const trendDataRes = dashBoardInitDataRes.mktTrend.length === 0 ? null : accMul(dashBoardInitDataRes.mktTrend[dashBoardInitDataRes.mktTrend.length - 1], 100)
      this.setState({
        dashBoardInitData: dashBoardInitDataRes,
        markData: markDataRes,
        trendData: trendDataRes
      }, () => {
        this.dashBoardChart()
      })
    }
  }
  dashBoardChart = () => {
    const {markData, trendData} = this.state
    // 胜率关系图
    const winRateRes = echarts.init(document.getElementById('marketChart'))
    winRateRes.setOption(getDashChart(markData, 1))
    this.setState({
      winRate: winRateRes
    })

    // 盈亏比关系图
    const profitLossRatioRes = echarts.init(document.getElementById('trendChart'))
    profitLossRatioRes.setOption(getDashChart(trendData, 2))
    this.setState({
      profitLossRatio: profitLossRatioRes
    })
  }
  render() {
    return (
      <div className="assetStrategy-dashboard__dashboardChart">
        <div id="trendChart" />
        <div id="marketChart" />
      </div>
    )
  }
}
