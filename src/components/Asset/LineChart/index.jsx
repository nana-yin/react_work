import React, { Component } from 'react'
import { isAppearOnScreen } from '../../../utils/assetRequest.js'
import {industryData} from '../../../../mock/asset'
import * as echarts from 'echarts';
import { getLine } from './chart.config.js'
import './index.less'

export default class LineChart extends Component {
  state = {
    strategyId: '',
    hasData: false,
    rtnData: 0.1420,
    lineData: [],
    dateList: [], // 日期列表
    rtnRateID: '',
    rtnRateChart: null,
    typeBox: null
  }
  componentDidMount() {
    const info = this.props.chartInfo
    const {rtnRateChart} = this.state
    this.setState({
      strategyId: info.strategyId,
      rtnRateID: info.strategyId + 'rtnId'
    }, function() {
      this.updateChart()
      window.addEventListener('resize', () => {
        if (rtnRateChart) {
          rtnRateChart.resize()
        }
      })
    })
  }
  componentWillUnmount() {
    // const {rtnRateChart} = this.state
    // // if (!rtnRateChart) { return }
    // window.removeEventListener('resize')
    // if (rtnRateChart) { rtnRateChart.dispose() }
  }
  updateChart = () => {
    const getCenterRecentData = {}
    for (let i = 0; i < industryData.length; i++) {
      const item = industryData[i]
      getCenterRecentData[item.strategyId] = item
    }
    // console.log('最终的数据', getCenterRecentData)
    const {hasData, strategyId} = this.state
    // 加载过数据就不用再画一遍图了
    if (hasData) { return }
    // 只取需要的数据, 没必要序列化整个数据, 更好的解决方案是在 vuex 的 setter 里就将数据改好
    // 使用数据的组件不用修改数据, 就自然不再需要序列化, 反复的序列化将消耗大量的cpu资源
    const dataObj = JSON.parse(JSON.stringify(getCenterRecentData[strategyId]))
    // 没数据就没必要继续画图了
    if (!dataObj) { return }

    // 为节约流量, 接口返回的原始日期数据只有开始和结束日期, 用空字符串填充空位
    const dateList = []
    if (dataObj.tradeDate.length > 1) {
      const length = dataObj.value.length - 2
      for (let i = 0; i < length; i++) {
        dateList.push('')
      }
      // 只需要表示日期的前十个字符串
      dateList.unshift(dataObj.tradeDate[0].slice(0, 10))
      dateList.push(dataObj.tradeDate[1].slice(0, 10))
    } else if (dataObj.tradeDate.length === 1) {
      dateList.unshift(dataObj.tradeDate[0].slice(0, 10))
    } else {
      // 返回的日期列表为空, 相当于无数据, 不应该继续绘图
      return
    }
    // console.log('打印数据', dateList, dataObj.value)
    // # 只有一个净值时是不会有收益率的, 设置为 0 即可, 如有需要也可以显示为提示文字
    const rtnDataRes = isNaN(dataObj.returnRate) ? 0 : (dataObj.returnRate * 100).toFixed(2)
    const rtnColorRes = 'color: ' + (rtnDataRes > 0 ? '#e8531d' : rtnDataRes < 0 ? '#00b578' : '#1d76f1')
    this.setState({
      dateList: dateList,
      lineData: dataObj.value,
      rtnData: rtnDataRes,
      rtnColor: rtnColorRes,
      hasData: true
    })

    // 修改 this.hasData 后 DOM 上才会有图表的 div
    // 所以要用 nextTick 等待 DOM 渲染完成后再去绘图

    // 注册监听事件
    const typeBoxRes = document.getElementById('typeBox')
    typeBoxRes.addEventListener('scroll', this.drawChart)
    this.setState({
      typeBox: typeBoxRes
    },function() {
      // 如果当前组件刚好在屏幕上, 不需要等到滚动时再渲染
      this.drawChart
    })
  }
  onResize = () => {
    const {rtnRateChart} = this.setState
    if (rtnRateChart) { rtnRateChart.resize() }
  }
  drawChart = () => {
    const {rtnRateID, lineData, dateList,typeBox} = this.state
    // 为了鼠标移到图表的内部的时候，变成小手
    const canvasDom = document.getElementsByTagName('canvas')
    for (let i = 0; i < canvasDom.length; i++) {
      canvasDom[i].style.cursor = 'pointer'
    }
    const rtnRateChartDom = document.getElementById(rtnRateID)
    if (isAppearOnScreen(rtnRateChartDom)) { // 判断该图是否出现在窗口视野中
      const rtnRateChartRes = echarts.init(rtnRateChartDom)
      rtnRateChartRes.setOption(getLine(lineData, dateList))  
      typeBox.removeEventListener('scroll', this.drawChart) // 画完图记得移除监听事件
    }
  }
  render() {
    const {hasData, rtnColor, rtnData, rtnRateID} = this.state
    return (
      <div className="lineChart">
        {
          hasData ? 
          <div className="lineChart-box">
            <div className="rtnRate" style={{rtnColor}}>{ rtnData }%</div>
            <div className="title">近三个月相对收益率</div>
            <div id={rtnRateID} className="barChart" />
          </div>
          :
          <div className="noData">暂无数据</div>
        }
      </div>
    )
  }
}
