import React, { Component } from 'react'
// 引入提示框、进度条组件
import { Tooltip, Progress } from 'antd'
// 引入图标
import {InfoCircleOutlined} from '@ant-design/icons'
// 引入历史胜率的右侧数据
import {fundVal} from '../../../../mock/fund'
// 引入echarts
import * as echarts from 'echarts'
// 引入左侧的绘图
import {drawHistorical} from './chart.config.js'
// isEmpty对数据为空进行处理,accMul给数据乘以100
import { isEmpty, accMul} from '../../../../util/fund'
// 引入页面的样式
import './index.less'


export default class Historical extends Component {
  state = {
    benchmarkName: '', // benchmark名称
    leftHasData: true, // 左侧历史胜率是否显示,true表示显示
    rightHasData: true, // 右侧历史胜率是否有数据，true表示有数据
    historyWin: [{
      key: 0,
      title: '正收益概率',
      tooltip: '计算该基金从成立以来，收益率为正的月数和总月数比。',
      explain: '月度回报为正的月数比',
      total: 38,
      percent: 0,
      exact: 0
    }, {
      key: 1,
      title: '超基准概率',
      tooltip: '计算该基金从成立以来，收益率超过基准的月数和总月数比。',
      explain: '月度回报超基准的月数比',
      total: 42,
      percent: 0,
      exact: 0
    }]
  }
  componentDidMount() {
    // 请求数据
    this.init()
  }
  /**
   * 数据初始化
  */
  init = () => {
    const { rtnRateHistory, totalMonths, overBaseMonths, positiveMonths, benchmarkName } = fundVal
    // 左侧的绘图处理
    this.drawChart(rtnRateHistory, benchmarkName)
    // 右侧的数据处理
    const total = !isEmpty(totalMonths) ? totalMonths : '--'
    const historyWin = [{
      key: 0,
      title: '正收益概率',
      tooltip: '计算该基金从成立以来，收益率为正的月数和总月数比。',
      explain: '月度回报为正的月数比',
      total: total,
      percent: !isEmpty(overBaseMonths) ? accMul(overBaseMonths / total) : 0,
      exact: !isEmpty(overBaseMonths) ? overBaseMonths : '--'
    }, {
      key: 1,
      title: '超基准概率',
      tooltip: '计算该基金从成立以来，收益率超过基准的月数和总月数比。',
      explain: '月度回报超基准的月数比',
      total: total,
      percent: !isEmpty(positiveMonths) ? accMul(positiveMonths / total) : 0,
      exact: !isEmpty(positiveMonths) ? positiveMonths : '--'
    }]
    // 历史胜率数据处理
    historyWin.map(item => {
      item.percent = Number(((item.exact / item.total) * 100).toFixed(0))
    })
    const rightHasData = positiveMonths || overBaseMonths
    this.setState({
      historyWin,
      rightHasData,
    })
  }
  /**
   * 绘图初始化
   * @param val 绘图的数据
   * @param benchmarkName benchmarkName
  */
  drawChart = (val, name) => {
    const {fundName}  = this.props
    console.log('fundName',fundName)
    const benchmarkNameRes = name
    let leftHasData = val && val.length > 0
    this.setState({
      benchmarkName:benchmarkNameRes,
      leftHasData
    }, () => {
      if (leftHasData) {
        const historicalDom = document.getElementsByClassName('historicalChart')[0]
        const legendData = [fundName, benchmarkNameRes]
        const xAxisData = []
        const seriseval = []
        const seriseBenchmark = []
        const seriesData = [] // 最终拿到的数据
        val.map(item => {
          const trade = item.tradeDate ? item.tradeDate.split('-') : null
          const tradeRes = trade[0] + '-' + trade[1]
          xAxisData.push(tradeRes)

          const val = !isEmpty(item.value) ? parseFloat(accMul(item.value)).toFixed(2) : '--'
          const benckmarkVal = !isEmpty(item.benchmark) ? parseFloat(accMul(item.benchmark)).toFixed(2) : '--'
          seriseval.push([tradeRes, val])
          seriseBenchmark.push([tradeRes, benckmarkVal])
        })
        legendData.map((item, index) => {
          const obj = {
            name: item,
            type: 'bar',
            legendHoverLink: false,
            data: index === 0 ? seriseval : seriseBenchmark
          }
          seriesData.push(obj)
        })
          if (historicalDom) {
            const myChart = echarts.init(historicalDom)
            let zoomStart = 0 // 缩放轴的起始百分比
            if (xAxisData && xAxisData.length >= 12) {
              zoomStart = Math.ceil(accMul(12 / xAxisData.length))
            } else {
              zoomStart = 0
            }
            myChart.setOption(
              drawHistorical(
                legendData,
                xAxisData,
                seriesData,
                zoomStart
              )
            )
            window.addEventListener('resize', () => {
              myChart.resize()
            })
            myChart.getZr().on('mousemove', _ => {
              myChart.getZr().setCursorStyle('default')
            })
          }
      }
    })
  }
  /**
   * 浮层渲染父节点，默认渲染到 body 上
  */
  getPopupContainer = (trigger) => {
    return trigger.parentElement
  }
  render() {
    const {leftHasData, rightHasData, historyWin} = this.state
    return (
      <div className="historicalBox">
        {
          leftHasData &&
          <div className="historicalChart" />
        }
        {
          !leftHasData &&
          <div>暂无数据</div>
        }
        {/* 被动指数型、增强指数型、被动指数型债基、增强指数型债基都没有该模块 */}
        {
          rightHasData &&
          <div className="historicalBox-odd">
            {
              historyWin.map(item => {
                return (
                  <div key={item.key} className="historicalBox-odd__posEarn">
                    <div className="name">
                      <span>{ item.title }</span>
                      <Tooltip getPopupContainer={this.getPopupContainer} title={item.tooltip}>
                        <InfoCircleOutlined />
                      </Tooltip>
                    </div>
                    <div className="explain">{ item.explain }</div>
                    <Progress  strokeLinecap="square" showInfo={false} percent={item.percent} strokeColor={item.title === '正收益概率' ? '#dcae73' : '#55adf6'} />
                    <div className="progress-data">
                      <span className={item.title === '正收益概率' ? 'data' : 'superData'}>0</span>
                      <span className={item.title === '正收益概率' ? 'data' : 'superData'}>{ item.exact }/{ item.total }</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        }
        {
          !rightHasData &&
          <div>暂无数据</div>
        }
      </div>
    )
  }
}
