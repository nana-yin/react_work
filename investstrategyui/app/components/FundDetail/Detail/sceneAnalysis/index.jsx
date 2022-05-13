import React, { Component } from 'react'
// 引入加载中组件
import { Spin } from 'antd'
// isEmpty对数据为空进行处理
import {isEmpty,accMul} from '../../../../util/fund'
// 引入echarts
import * as echarts from 'echarts'
// 引入绘制的图表
import {drawScenceChart} from './chart.config.js'
// 引入牛熊周期的假数据
import {bearBull} from '../../../../mock/fund'
// 引入当前页面的样式
import './index.less'
export default class SceneAnalysis extends Component {
  state = {
    bullTran: {
      1: '牛市',
      2: '熊市',
      3: '震荡市'
    }, // 根据数字对应名称
    labelList: [], // 图表下方的数据
    loading: true, // 当前模块是否处于加载中
    hasData: true // 牛熊周期是否有数据
  }
  componentDidMount() {
    this.initChart(bearBull)
  }
  /**
     * 图表初始化
     * @param val 从后端拿到的数据
    */
  initChart = (val) => {
    const {fundName,benchmarkName} = this.props
    const {labelList,bullTran} = this.state
    
    this.setState({
      labelList: []
    },() => {
      const barDom = document.getElementsByClassName('sceneChart')[0]
      // x轴的数据
      const xData = []
      // 绘图的数据
      const seriesData = [
        {
          name: fundName,
          type: 'line',
          lineStyle: {
            width: 1
          },
          symbolSize: 8,
          data: []
        },
        {
          name: benchmarkName,
          type: 'bar',
          barWidth: 52,
          data: [],
          emphasis: {
            itemStyle: {
              color: '#e0e2eb'
            }
          }
        }
      ]
      // 图例数据
      const legendData = [fundName, benchmarkName]
      let hasData = null
      if (val && val.length > 0) {
        hasData = true
        // 计算图表下方的展示数据
        val.map(item => {
          const startDate = item.startDate ? item.startDate.split(' ')[0] : null
          const endDate = item.endDate ? item.endDate.split(' ')[0] : null
          const name = bullTran[item.bull]
          const obj = {
            startDate,
            end: endDate,
            name
          }
          labelList.push(obj)

          const xLabel = startDate + '~' + endDate
          xData.push(xLabel)
          const val = !isEmpty(item.rtnRateTotal) ? parseFloat(accMul(item.rtnRateTotal)).toFixed(2) : '--'
          const benchVal = !isEmpty(item.benchmark) ? parseFloat(item.benchmark).toFixed(2) : '--'
          seriesData[0].data.push({
            value: [xLabel, val]
          })
          seriesData[1].data.push({
            value: [xLabel, benchVal]
          })

          if (barDom) {
            const myChart = echarts.init(barDom)
            myChart.clear()
            myChart.setOption(drawScenceChart(legendData, xData, seriesData))
            window.addEventListener('resize', () => {
              myChart.resize()
            })
            myChart.getZr().on('mousemove', _ => {
              myChart.getZr().setCursorStyle('default')
            })
          }
        })
      } else {
        hasData = false
      }
      this.setState({
        hasData,
        labelList,
        loading: false
      })
    })
  }
  render () {
    const {loading,hasData,labelList} = this.state
    return (
      <div className="sceneAnalysis">
        <div className="title">牛熊周期</div>
        <Spin spinning={loading} tip="Loading...">
          {
            hasData &&
            <div className="content">
              <div className="sceneChart"></div>
              <div className="bottom"
              style={
                labelList.length === 1 ? {paddingLeft: 49+ '%',paddingRight: 42 + '%'}
                : labelList.length === 2 ? {paddingLeft: 26+ '%',paddingRight: 22.5 + '%'}
                : labelList.length === 3 ? {paddingLeft: 18+ '%',paddingRight: 15 + '%'}
                : labelList.length === 4 ? {paddingLeft: 14+ '%',paddingRight: 11 + '%'}
                :labelList.length === 5 ? {paddingLeft: 150+ 'px',paddingRight: 110 + 'px'}
                :labelList.length === 6 ? {paddingLeft: 120+ 'px',paddingRight: 85 + 'px'}
                :labelList.length === 7 ? {paddingLeft: 120+ 'px',paddingRight: 80 + 'px'}
                :labelList.length === 8 ? {paddingLeft: 105+ 'px',paddingRight: 65 + 'px'}
                :labelList.length === 9 ? {paddingLeft: 90+ 'px',paddingRight: 55 + 'px'}
                :labelList.length === 10 ? {paddingLeft: 80+ 'px',paddingRight: 50 + 'px'}
                : {}
              }
              >
                {
                  labelList.map((item,index) => {
                    return (
                      <div key={index} className="single">
                        <span>{item.startDate}</span>
                        <span className="icon"></span>
                        <span>{item.end}</span>
                        <span className={item.name === '熊市' ? 'bear' : item.name === '牛市' ? 'bull' : 'shock'}>{item.name}</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          }
        </Spin>
      </div>
    )
  }
}
