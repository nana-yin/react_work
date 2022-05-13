import React, { Component } from 'react'
// 引入加载中组件
import { Spin } from 'antd';
// isEmpty判断数据是否是空
import { isEmpty } from '../../../../util/fund'
// 引入产品规模、持有人结构的假数据
import {resAnalise, holderRes} from '../../../../mock/fund'
// 引入echarts
import * as echarts from 'echarts'
// 引入绘图模板
import {drawScaleBar,drawScalePie} from './chart.config'
// 引入该页面的样式
import './index.less'

export default class ScaleAnalysis extends Component {
  state = {
    loading: true, // 产品规模是否处于加载中
    holderLoading: true, // 持有人结构是否处于加载中
    historySerise: [], // 持有人结构右侧的柱状图的serise数据
    historyXdata: [], //持有人结构右侧的柱状图的x轴数据
    historyData: [], //持有人结构右侧的柱状图的数据
    inst: 0, // 机构持有百分比
    per: 0 // 个人持有百分比
  }
  componentDidMount() {
    // 请求产品规模和持有人结构的数据
    // 数据初始化
    this.fetchInit()
    this.fetchHolderInit()
  }
  /**
     * 对基金的规模进行亿元的计算
     * @param value 进行计算的数值
    */
  filterFundScale = (value) => {
    return parseFloat(Number(value) / 100000000)
  }
  /**
   * 对基金的数据进行控制的判断
   * @param value 进行计算的数值
  */
  dataIsNull = (value) => {
    let hasVal = true
    if (!isEmpty(value)) {
      hasVal = Number(value) !== -999
    } else {
      hasVal = false
    }
    return hasVal
  }
  /**
   * 产品规模的数据
  */
  fetchInit = () => {
    if (resAnalise && (resAnalise.length > 0)) {
      const seriseData = {
        data: [],
        cursor: 'default',
        type: 'bar',
        barWidth: 14,
        backgroundStyle: {
          color: 'rgba(0,0,0,0.05)'
        },
        itemStyle: {
          color: '#dcae73'
        },
        emphasis: {
          itemStyle: {
            color: '#D1A56D'
          }
        }
      }
      let xData = []
      resAnalise.map(item => {
        const assetTotal = this.dataIsNull(item.assetTotal) ? parseFloat(this.filterFundScale(item.assetTotal).toFixed(2)) : null
        seriseData.data.push([item.tradeDate, assetTotal])
        xData.push(item.tradeDate)
      })

      xData = [...Array.from(new Set(xData))]
      xData.sort(function(a, b) {
        return a > b ? 1 : -1
      })
      // 绘制产品规模的柱状图
      this.init('fundSize-chart', seriseData, xData, [])
    }
  }
  /**
   * 持有人结构的数据初始化
  */
  fetchHolderInit() {
    if (holderRes && (Object.keys(holderRes).length > 0)) {
      const { instHoldRatio, totalShares, tradeDate, indiHoldRatio, history } = holderRes
      const inst = this.dataIsNull(instHoldRatio) ? parseFloat(instHoldRatio.toFixed(2)) : '--'
      const per = this.dataIsNull(indiHoldRatio) ? parseFloat(indiHoldRatio.toFixed(2)) : '--'
      const instVal = inst !== '--' ? inst + '%' : '--'
      const perVal = per !== '--' ? per + '%' : '--'
      const seriseData = [
        { value: inst, name: '机构' },
        { value: per, name: '个人' }
      ]
      const totalVal = this.dataIsNull(totalShares) ? parseFloat((this.filterFundScale(totalShares)).toFixed(2)) : '--'
      // 柱状图
      if (history && (history.length > 0)) {
        // 根据UI的要求，个人持有比例包含机构持有比例
        // 所以绘图的时候，如果个人是30，机构是20.则绘图的时候，个人是10，机构是20
        let xData = []
        let historyData = []
        let historySerise = [
          {
            name: '机构持有',
            type: 'bar',
            stack: 'one',
            cursor: 'default',
            data: [],
            barWidth: 24,
            legendHoverLink: false,
            backgroundStyle: {
              color: 'rgba(0,0,0,0.1)'
            },
            itemStyle: {
              color: '#faf3ea'
            },
            emphasis: {
              itemStyle: {
                color: '#E1DAD2'
              }
            }
          },
          {
            name: '个人持有',
            type: 'bar',
            stack: 'one',
            cursor: 'default',
            legendHoverLink: false,
            data: [],
            barWidth: 24,
            backgroundStyle: {
              color: 'rgba(0,0,0,0.1)'
            },
            itemStyle: {
              color: '#dcae73'
            },
            emphasis: {
              itemStyle: {
                color: '#C69C67'
              }
            }
          }
        ]
        history.map(item => {
          const tradeDate = item.tradeDate || ''
          const instData = this.dataIsNull(item.instHoldRatio) ? item.instHoldRatio.toFixed(2) : '--'
          const perData = this.dataIsNull(item.indiHoldRatio) ? item.indiHoldRatio.toFixed(2) : '--'
          historySerise[0].data.push([tradeDate, instData])
          historySerise[1].data.push([tradeDate, perData])
          xData.push(tradeDate)

          // 总体的数据存储
          const instHoldShares = this.dataIsNull(item.instHoldShares) ? this.filterFundScale(item.instHoldShares).toFixed(4) : '--'
          const indiHoldShares = this.dataIsNull(item.indiHoldShares) ? this.filterFundScale(item.indiHoldShares).toFixed(4) : '--'
          const avgHoldShares = this.dataIsNull(item.avgHoldShares) ? (parseFloat(item.avgHoldShares) / 10000) : '--'
          historyData.push({
            'instPercente': instData,
            'perPercente': perData,
            'inst': instHoldShares,
            'per': indiHoldShares,
            'total': avgHoldShares,
            'tradeDate': tradeDate
          })
        })
        xData = [...Array.from(new Set(xData))]
        xData.sort(function(a, b) {
          return a > b ? 1 : -1
        })
          
        this.setState({
          historySerise,
          historyData,
          historyXdata: xData,
          inst: instVal,
          per: perVal
        }, () => {
          // 绘制左侧饼图
          this.initPie(seriseData, tradeDate, totalVal)
          // 绘制右侧柱状图
          this.init('structureBar', historySerise, xData, historyData)
        })
      }
    }
  }
  /**
   * 柱状图数据初始化
   * @param dom 绘制图表的dom
   * @param seriseData 绘制图表的serise数据
   * @param xData 绘制图表的x轴数据
   * @param data 绘制图表的数据
  */
  init = (dom, seriseData, xData, data) => {
    const barDom = document.getElementsByClassName(dom)[0]
    if (barDom) {
      const barChart = echarts.init(barDom)
      barChart.setOption(drawScaleBar(dom, seriseData, xData, data))
      barChart.getZr().on('mousemove', _ => {
        barChart.getZr().setCursorStyle('default')
      })
      window.addEventListener('resize', () => {
        barChart.resize()
      })
    }
    this.setState({
      loading: false,
      holderLoading: false
    })
  }
  /**
   * 圆环图初始化
   * @param seriseData 绘制图表的serise数据
   * @param tradeDate 日期
   * @param totalVal 总份额
  */
  initPie = (seriseData, tradeDate, totalVal) => {
    const pieDom = document.getElementsByClassName('structurePie')[0]
    if (pieDom) {
      const pieChart = echarts.init(pieDom)
      pieChart.setOption(drawScalePie(seriseData, tradeDate, totalVal))
      pieChart.getZr().on('mousemove', _ => {
        pieChart.getZr().setCursorStyle('default')
      })
      window.addEventListener('resize', () => {
        pieChart.resize()
      })
    }
  }
  render() {
    const {loading, holderLoading, inst, per} = this.state
    return (
      <div className="scaleAnalysis-component">
        {/* 规模分析 */}
        <div className="fundSize">
          <div className="top">
            <div className="title">产品规模</div>
            <div className="date">数据日期：2021年7月6日</div>
          </div>
          <Spin
            spinning={loading}
            tip="Loading..."
          >
            <div v-if="resAnalise && (resAnalise.length > 0)" className="fundSize-chart" />
            {/* <Empty v-else empty-text="暂无数据" /> */}
          </Spin>
        </div>
        <div className="structure">
          <div className="top">
            <div className="title">持有人结构</div>
            <div className="date">数据日期：2021年7月6日</div>
          </div>
          <Spin
            spinning={holderLoading}
            tip="Loading..."
          >
            <div v-if="historyData.length > 0" className="structure-chart">
              <div className="structure-chart__left">
                <div className="structurePie" />
                <div className="pieData">
                  <div>{ inst }</div>
                  <div>{ per }</div>
                </div>
              </div>
              <div className="structureBar" />
            </div>
            {/* <Empty v-else empty-text="暂无数据" /> */}
          </Spin>
        </div>
      </div>
    )
  }
}
