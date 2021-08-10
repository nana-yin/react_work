import React, { Component } from 'react'
// 引入提示框、进度条组件
import { Tooltip, Progress } from 'antd'
// 引入图标
import {InfoCircleOutlined} from '@ant-design/icons'
// 引入历史胜率的右侧数据
import {fundVal} from '../../../../../mock/fund'
// 引入echarts
import * as echarts from 'echarts'
// 引入左侧的绘图
import {drawHistorical} from './chart.config.js'
// isEmpty对数据为空进行处理,accMul给数据乘以100
import { isEmpty, accMul } from '@/utils/fund.js'
// 引入页面的样式
import './index.less'


export default class Historical extends Component {
  state = {
    data: {
      table: [],
      count: 0
    },
    oddShow: true, // 历史胜率是否显示,true表示显示
    params: {}, // 传给后端的参数
    historyRightHasData: true, // 历史胜率是否有数据，true表示有数据
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
    this.drawChart()
    const { totalMonths, overBaseMonths, positiveMonths } = fundVal
    const {investType} = this.props
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
    const historyRightHasData = positiveMonths || overBaseMonths
    const arr = ['A0102', 'A0103', 'A0303', 'A0304']
    const oddShow = arr.find(item => { return investType === item })
    // 历史胜率数据处理
    historyWin.map(item => {
      item.percent = Number(((item.exact / item.total) * 100).toFixed(0))
    })
    this.setState({
      historyWin,
      historyRightHasData,
      oddShow,
    })
  }
  drawChart = () => {
    const historicalDom = document.getElementsByClassName('historicalChart')[0]
    const legendData = ['招商行业精选', '沪深300']
    const xAxisData = ['2021-03', '2021-04', '2021-05', '2021-06', '2021-07']
    const seriesData = []
    const serise = [
      [['2021-03', 20], ['2021-04', 50], ['2021-05', 120],['2021-06', 10],['2021-07', 20]],
      [['2021-03', 80], ['2021-04', 70], ['2021-05', 20],['2021-06', 100],['2021-07', 40]]
    ]
    legendData.map((item, index) => {
      let obj = {
        name: item,
        type: 'bar',
        barWidth: 16,
        barGap: '2%',
        legendHoverLink: false,
        data: serise[index]
      }
      seriesData.push(obj)
    })
    if (historicalDom) {
      const myChart = echarts.init(historicalDom)
      myChart.setOption(
        drawHistorical(
          legendData,
          xAxisData,
          seriesData
        )
      )
      myChart.getZr().on('mousemove', _ => {
        myChart.getZr().setCursorStyle('default')
      })
    }
  }
  /**
   * 浮层渲染父节点，默认渲染到 body 上
  */
  getPopupContainer = (trigger) => {
    return trigger.parentElement
  }
  render() {
    const {oddShow,historyRightHasData, historyWin} = this.state
    return (
      <div className="historicalBox">
        <div className="historicalChart" />
        {/* 被动指数型、增强指数型、被动指数型债基、增强指数型债基都没有该模块 */}
        {
          !oddShow &&
          <div className="historicalBox-odd">
            {
              historyWin.map(item => {
                return (
                  historyRightHasData && 
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
                  // <Empty v-else empty-text="暂无数据" className="empty-box" />
                )
              })
            }
        </div>
        }
      </div>
    )
  }
}
