import React, { Component } from 'react'
import { changNunToText } from '../../../utils/asset'
import { isAppearOnScreen } from '../../../utils/assetRequest.js'
import * as echarts from 'echarts';
import { getPie } from './chart.config.js'
import {getWinLossData} from '../../../../mock/asset'
import './index.less'

export default class PieChart extends Component {
  state = {
    objId: '',
    winIds: '',
    oddIds: '',
    assetData: null,
    typeBox: null
  }
  componentDidMount() {
    const {winChart, oddChart} = this.state
    const info = this.props.chartInfo
    let objIdRes = ''
    objIdRes = info.assetId !== undefined ? info.assetId : info.strategyId

    this.setState({
      objId: objIdRes,
      winIds: objIdRes + 'winId',
      oddIds: objIdRes + 'oddId'
    },function() {
      // 这时数据都是 null, 应该展示 "暂无数据"
      this.updateChart()
      window.addEventListener('resize', () => {
        if (winChart) {
          winChart.resize()
        }
        if (oddChart) {
          oddChart.resize()
        }
      })
    })
  }
  componentWillUnmount() {
    // const {winChart, oddChart} = this.state
    // window.removeEventListener('resize')
    // if (winChart) { winChart.dispose() }
    // if (oddChart) { oddChart.dispose() }
  }
  onResize = () => {
    const {winChart, oddChart} = this.state
    if (winChart) { winChart.resize() }
    if (oddChart) { oddChart.resize() }
  }
  updateChart= () => { // 更新图表
    const {assetData, objId} = this.state
    if (assetData) { return }
    const result = {}
    for (let i = 0; i < getWinLossData.length; i++) {
      const item = getWinLossData[i]
      result[item.assetId === undefined ? item.strategyId : item.assetId] = item
    }
    const dataObj = result[objId]
    if (!dataObj) { return }
    // 数据范围变换, 并计算对应的文字描述, 胜率 [0, 1] -> [0, 100], 盈亏比 [-3, 3] -> [0, 100]
    const fmtRes = changNunToText('胜率', dataObj.fmtWinRate)
    // console.log('---', fmtRes)
    const assetDataRes = {
      winData: this.convertWinData(dataObj.fmtWinRate),
      oddData: this.convertOddData(dataObj.fmtOdds),
      winText: changNunToText('胜率', dataObj.fmtWinRate),
      oddText: changNunToText('盈亏比', dataObj.fmtOdds)
    }
    
    this.setState({
      assetData: assetDataRes
    },function() {
      // 注册监听事件
      const typeBoxRes = document.getElementById('typeBox')
      typeBoxRes.addEventListener('scroll', this.drawChart)
      this.setState({
        typeBox: typeBoxRes
      },function() {
        // 如果当前组件刚好在屏幕上, 不需要等到滚动时再渲染
        this.drawChart()
      })
    })
  }
  drawChart = () => {
    const {assetData, winIds, oddIds, typeBox} = this.state
    const canvasDom = document.getElementsByTagName('canvas')
    for (let i = 0; i < canvasDom.length; i++) {
      canvasDom[i].style.cursor = 'pointer'
    }
    const data = assetData || {}
    const winChartDom = document.getElementById(winIds)
    const oddChartDom = document.getElementById(oddIds)
    if (isAppearOnScreen(winChartDom)) { // 判断该图是否出现在窗口视野中
      const winChartRes = echarts.init(winChartDom)
      winChartRes.setOption(getPie(data.winData, data.winText))
      this.setState({
        winChart: winChartRes
      },function() {
        typeBox.removeEventListener('scroll', this.drawChart) // 画完图记得移除监听事件
      })
    }
    if (isAppearOnScreen(oddChartDom)) { // 判断该图是否出现在窗口视野中
        const oddChartRes = echarts.init(oddChartDom)
        oddChartRes.setOption(getPie(data.oddData, data.oddText))
        this.setState({
          oddChart: oddChartRes
        },function() {
          typeBox.removeEventListener('scroll', this.drawChart) // 画完图记得移除监听事件
        })
    }
  }
  // 数据转换, 胜率 [0, 1] -> [0, 100]
  convertWinData(value) {
    if (value > 1) {
      value = 1
    } else if (value < 0) {
      value = 0
    } else {
      value *= 100
    }
    return value
  }
  // 数据转换, 盈亏比 [-3, 3] -> [0, 100]
  convertOddData(value) {
    if (value > 3) {
      value = 3
    } else if (value < -3) {
      value = 3
    } else {
      value = ((value + 3) / 6) * 100
    }
    return value
  }
  render() {
    const {winIds, oddIds} = this.state
    return (
      <div className="pieChart">
        <div className="chartBox">
          <div className="chartBox-single">
            <div className="title">胜率</div>
            {/* <ReactEcharts option={getPie} /> */}
            <div id={winIds} className="barChart" />
          </div>
          <div className="chartBox-single">
            <div className="title">盈亏比</div>
            <div id={oddIds} className="barChart" />
          </div>
        </div>
      </div>
    )
  }
}
