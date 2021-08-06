import React, { Component } from 'react'
import * as echarts from 'echarts';
import {Spin } from 'antd'
import { getLongTerm } from './chart.config'
import { accMul, FUND_TAG_COLOR, colorConfig } from '../../../utils/asset.js'
import './index.less'

export default class LongTermExpect extends Component {
  state = {
    getLongTermDataInit: [], // 从后端获取的数据
    longTermNameList: [],
    realDataList: [],
    incomeVolatility: null,
    spinning: true,
    tabName: ''
  }
  componentDidMount() {
    const {drawChart} = this.props
    const tabNameRes = drawChart.detail.name
    const getLongTermDataInitRes = JSON.parse(JSON.stringify(drawChart.riskReturn))
    this.setState({
      tabName: tabNameRes,
      getLongTermDataInit: getLongTermDataInitRes
    }, () => {
      this.getLongTermInit()
    })
  }
  getLongTermInit() {
    const {getLongTermDataInit, tabName} = this.state
    const realDataListRes = []
    const longTermNameListRes = []
    getLongTermDataInit.map((item, index) => { // 获取策略名称
      if (item.vol !== null || item.rtn !== null) {
        longTermNameListRes.push(item.name)
      }
      const seriesList = {
        name: item.name,
        label: {
          show: true,
          color: '#999',
          fontSize: 12,
          formatter: item.name,
          position: 'bottom'
        },
        rippleEffect: {
          period: 4,
          scale: 5,
          brushType: 'fill'
        },
        itemStyle: {
          color: item.assetId === undefined ? colorConfig[index] : FUND_TAG_COLOR[item.assetId]
        },
        data: [[item.vol === null ? null : (accMul(item.vol, 100)).toFixed(2), item.rtn === null ? null : (accMul(item.rtn, 100)).toFixed(2)]]
      }

      if (seriesList.name === tabName) {
        seriesList.type = 'effectScatter'
        seriesList.effectType = 'ripple'
        seriesList.showEffectOn = 'render'
      } else {
        seriesList.type = 'scatter'
        delete seriesList.effectType
        delete seriesList.showEffectOn
      }
      realDataListRes.push(seriesList)
    })
    if (realDataListRes.length !== 0) {
      this.setState({
        spinning: false,
        realDataList: realDataListRes,
        longTermNameList: longTermNameListRes
      }, () => {
        this.scatterDiagram()
      })
    }
  }
  scatterDiagram() { // 初始化散点图
    const {realDataList, longTermNameList} = this.state
    const incomeVolatilityRes = echarts.init(document.getElementById('longTermScatter'))
    incomeVolatilityRes.setOption(getLongTerm(realDataList, longTermNameList))
    window.addEventListener('resize', () => {
      incomeVolatilityRes.resize()
    })
    this.setState({
      incomeVolatility: incomeVolatilityRes
    })
  }
  render() {
    const {spinning } = this.state
    return (
      <div className="assetStrategy-longTermChart">
        <div className="assetStrategy-longTermChart__title">长期视角：长期风险收益空间</div>
        <Spin tip="Loading..." spinning={spinning}>
          <div id="longTermScatter" />
        </Spin>
      </div>
    )
  }
}
