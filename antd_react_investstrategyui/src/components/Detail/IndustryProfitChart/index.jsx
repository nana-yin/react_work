import React, { Component } from 'react'
import * as echarts from 'echarts'
import { getIndustryEarn } from './chart.config'
import './index.less'

export default class IndustryProfitChart extends Component {
  state = {
    backStageData: [],
    xData: [], // 绘图数据
    seriseData: [],
    ySerise: [],
    legendArr: [],
    lineChart: null
  }
  componentDidMount() {
    const {getIndustyChart} = this.props
    const backStageDataRes = JSON.parse(JSON.stringify(getIndustyChart.historyPerf))
    const legendArrRes = []
    legendArrRes.push(getIndustyChart.historyPerf.benchmarkName)
    console.log('--图例名称-', legendArrRes)
    this.setState({
      backStageData: backStageDataRes,
      legendArr: legendArrRes
    }, () => {
      this.relativeEarn()
    })
  }
  relativeEarn = () => {
    const {backStageData, legendArr}= this.state
    let xDataRes = [], seriseDataRes = []
    const lineChartRes = echarts.init(document.getElementById('industryEarn'))
    lineChartRes.clear()
    this.setState({
      lineChart: lineChartRes
    })
    backStageData.tradeDate.map(item => {
      xDataRes.push(item.split(' ')[0])
    })
    if (backStageData.benchmark.length > 0) {
      backStageData.benchmark.map(item => {
        seriseDataRes.push(Number(item).toFixed(2))
      })
    }
    this.setState({
      xData: xDataRes,
      seriseData: seriseDataRes
    })
    let xAxisData = xDataRes
    xAxisData = [...Array.from(new Set(xAxisData))]
    xAxisData.sort(function(a, b) {
      return a > b ? 1 : -1
    })
    xDataRes = xAxisData
    lineChartRes.setOption(getIndustryEarn(xDataRes, seriseDataRes, legendArr))
    window.addEventListener('resize', () => {
      lineChartRes.resize()
    })
  }
  render() {
    const {assetName}  = this.props
    return (
      <div className="assetStrategyDetail-industryEarn">
        <div className="assetStrategyDetail-industryEarn__title">{ assetName }</div>
        <div id="industryEarn" />
      </div>
    )
  }
}
