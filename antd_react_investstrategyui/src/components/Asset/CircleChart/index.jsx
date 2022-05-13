import React, { Component } from 'react'
import { isAppearOnScreen } from '../../../utils/assetRequest.js'
import * as echarts from 'echarts';
import { getCircle } from './chart.config.js'
import {macroData} from '../../../../mock/asset'
import './index.less'
// import { func } from 'prop-types';

export default class LineChart extends Component {
  state = {
    circleId: '',
    macroTitle: '',
    macroDate: '',
    trend: null,
    circleData: null,
    circleChart: null,
    typeBox: null
  }
  componentDidMount() {
    const infoId = this.props.chartInfo.secId + 'circleId'
    this.setState({
      circleId: infoId
    },function() {
      this.updateData()
      window.addEventListener('resize', this.onResize)
    })
  }
  componentWillUnmount() {
    // const {circleChart} = this.props
    // window.removeEventListener('resize', this.onResize)
    // if (circleChart) { circleChart.dispose() }
  }
  onResize = () => {
    const {circleChart} = this.props
    if (circleChart) { circleChart.resize() }
  }
  updateData = () => {
    const {circleData} = this.state
    const getCenterMacroData = {}
    for (let i = 0; i < macroData.length; i++) {
      const item = macroData[i]
      getCenterMacroData[item.secId] = item
    }
    // 监听数据变动, 如果已经读取过就不再刷新, 没有数据的不用继续画图
    if (circleData) { return }
    const dataObj = getCenterMacroData[this.props.chartInfo.secId]
    // console.log('圆环数据', getCenterMacroData)
    // console.log('数据', this.circleId)
    if (!dataObj) { return }
    const macroTitleRes = dataObj.secName || ''
    const macroDateRes = dataObj.tradeDate ? dataObj.tradeDate.slice(0, 10).replace(/-/g, '\/') : ''
    const trendRes = dataObj.trend
    const circleDataRes = isNaN(dataObj.value) ? null : dataObj.value.toFixed(2)

    this.setState({
      macroTitle: macroTitleRes,
      macroDate: macroDateRes,
      trend: trendRes,
      circleData: circleDataRes
    }, function() {
      // 注册监听事件
      const typeBox = document.getElementById('typeBox')
      typeBox.addEventListener('scroll', this.drawChart)
      this.setState({
        typeBox: typeBox
      }, function() {
        // 如果当前组件刚好在屏幕上, 不需要等到滚动时再渲染
        this.drawChart
      })
    })
  }
  drawChart = () => {
    const {circleId, circleData, trend, typeBox} = this.state
    const circleRef = document.getElementById(circleId)
    const canvasDom = document.getElementsByTagName('canvas')
    for (let i = 0; i < canvasDom.length; i++) {
      canvasDom[i].style.cursor = 'pointer'
    }
    // document.getElementsByTagName('canvas')[0].style.cursor = 'pointer'
    if (isAppearOnScreen(circleRef)) { // 判断该图是否出现在窗口视野中
      const circleChartRes = echarts.init(circleRef)
      circleChartRes.setOption(getCircle(circleData, trend))
      typeBox.removeEventListener('scroll', this.drawChart) // 画完图记得移除监听事件
    }
  }
  render() {
    const {macroTitle, circleId, macroDate} = this.state
    return (
      <div className="circleChart">
        <div className="title">{ macroTitle }</div>
        <div id={circleId} className="barChart" />
        <div className="date">{ macroDate }</div>
      </div>
    )
  }
}
