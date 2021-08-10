import React, { Component } from 'react'
// 引入绘制的图表
import {drawBar} from './chart.config.js'
// 引入加载中组件
import { Spin } from 'antd'
// 引入行业配置的数据
import {fundDistribute} from '../../../../../mock/fund'
// 引入echarts
import * as echarts from 'echarts'
// 引入当前页面的样式
import './index.less'

export default class IndustyConfig extends Component {
  state = {
    loading: true, // 当前模块是否处于加载中
    hasData: true // 行业分布是否有数据
  }
  componentDidMount() {
    this.initChart()
  }
  /**
     * 图表初始化
    */
  initChart = () => {
    const barDom = document.getElementById('industryChart')
    let hasData = true
    if (Object.keys(fundDistribute).length > 0) {
      if (barDom) {
        const myChart = echarts.init(barDom)
        myChart.clear()
        myChart.setOption(drawBar(fundDistribute.industryList))
        myChart.getZr().on('mousemove', _ => {
          myChart.getZr().setCursorStyle('default')
        })
      }
      hasData = true
    } else {
      hasData = false
    }
    this.setState({
      hasData,
      loading: false
    })
  }
  render() {
    const {loading,hasData} = this.state
    return (
      <div className="industyConfig">
        <div className="industyConfig-top">
          <div className="industyConfig-top__title">行业配置</div>
          <div className="industyConfig-top__date">数据日期：2021年7月6日</div>
        </div>
        <Spin
          spinning={loading}
          tip="Loading..."
        >
          {
            hasData &&
            <div id="industryChart" />
          }
          {/* <Empty v-else empty-text="暂无数据" className="empty-box" /> */}
        </Spin>
      </div>
    )
  }
}
