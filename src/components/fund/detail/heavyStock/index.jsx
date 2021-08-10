import React, { Component } from 'react'
// 引入绘制的图表
import {drawTreeMap} from './chart.config.js'
// 引入加载中组件
import { Spin } from 'antd'
// 引入重仓股票的数据
import {fundTop} from '../../../../../mock/fund'
// 引入echarts
import * as echarts from 'echarts'
// 引入当前页面的样式
import './index.less'

export default class HeavyStock extends Component {
  state = {
    hasData: true, // 重仓股票是否有数据
    loading: true // 重仓股票是否处于加载中
  }
  componentDidMount() {
    this.treeMapInit()
  }
  treeMapInit = () => {
    let hasData = true
    if (fundTop.length > 0) {
      hasData = true
      const treeMapDom = document.getElementById('treeDomChart')
      if (treeMapDom) {
        const myTreeMap = echarts.init(treeMapDom)
        myTreeMap.clear()
        myTreeMap.setOption(drawTreeMap(fundTop))
        myTreeMap.getZr().on('mousemove', _ => {
          myTreeMap.getZr().setCursorStyle('default')
        })
      }
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
      <div className="heavyStock">
        <div className="heavyStock-title">重仓股票</div>
        <Spin spinning={loading} tip="Loading...">
          {
            hasData &&
            <div id="treeDomChart" />
          }
          {/* <Empty v-else empty-text="暂无数据" className="empty-box" /> */}
        </Spin>
      </div>
    )
  }
}
