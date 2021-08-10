import React, { Component } from 'react'
// 引入加载中、栅格、导航、评分组件
import { Spin, Table } from 'antd';
// 引入表格和绘图
import {columns,drawLineChart} from './chart.config'
// 引入业绩表现的数据
import {fundTend} from '../../../../../mock/fund'
// 引入echarts
import * as echarts from 'echarts'
// isEmpty对数据为空进行处理,accMul给数据乘以100
import { isEmpty, accMul } from '@/utils/fund.js'
// 引入当前页面的样式
import './index.less'

export default class MovementsChart extends Component {
  state = {
    loading: true, // 该模块是否处于加载中
    hasData: true, // 当前模块是否有数据
    columns: columns, // 表格的初始化
    tableData: [], // 表格数据
    scoreTab: [{
      key: '1',
      name: '近一月'
    }, {
      key: '3',
      name: '近三月'
    }, {
      key: '0',
      name: '今年以来'
    }, {
      key: '12',
      name: '近一年'
    }, {
      key: '36',
      name: '近三年'
    }, {
      key: '1220',
      name: '成立以来'
    }], // 业绩表现的时间周期
    activeTab: '1'
  }
  componentDidMount() {
    // 获取数据
    // this.fetchFundDetailPerformanceTends({ FundId: this.fundId, TimeRange: this.activeTab })
    this.initChart(fundTend)
  }
  /**
   * 点击时间区间进行重新获取数据
   * @param key 时间
  */
  choose = (key) => {
    this.setState({
      loading: true,
      activeTab: key
    })
    // this.fetchFundDetailPerformanceTends({ FundId: this.fundId, TimeRange: this.activeTab })
    this.initChart(fundTend)
  }
  /**
   * 初始化数据
   * @param val 从后端传来的数据
  */
  initChart = (val) => {
    const {fundName} = this.props
    const {benchmarkName, detailList,fundDict, benchmarkDict} = val
    let hasData = true
    if (Object.keys(val).length > 0) { // 有数据
      hasData = true
      // 图例数据
      const legendData = [fundName, benchmarkName]
      // x轴的数据
      const xAxisData = []
      // 本基金的绘图数据
      const fundList = []
      // benchmark的绘图数据
      const benchmark = []
      if (detailList && detailList.length> 0) {
        detailList.map(item => {
          const date = !isEmpty(item.tradeDate) ? item.tradeDate.split(' ')[0] : null
          xAxisData.push(date)
          const fundVal = !isEmpty(item.dayPctChange) ? parseFloat(accMul(item.dayPctChange)).toFixed(2) : '--'
          fundList.push([date, fundVal])
          const benchmarkval = !isEmpty(item.benchmark) ? parseFloat(accMul(item.benchmark)).toFixed(2) : '--'
          benchmark.push([date, benchmarkval])
        })
      }
      const lineDom = document.getElementById('lineChart')
      const seriesData = [fundList, benchmark]
      if (lineDom) {
        const myChart = echarts.init(lineDom)
        myChart.setOption(
          drawLineChart(
            legendData,
            xAxisData,
            seriesData
          )
        )
        myChart.getZr().on('mousemove', _ => {
          myChart.getZr().setCursorStyle('default')
        })
      }
      // 表格数据
      const tableData = [
        { key: '1',
          name: fundName,
          rateReturn: !isEmpty(fundList[fundList.length - 1][1]) ? fundList[fundList.length - 1][1]  + '%' : '--',
          vol: !isEmpty(fundDict.vol) ? parseFloat(fundDict.vol).toFixed(2) + '%' : '--',
          sharpe: !isEmpty(fundDict.sharpe) ? parseFloat(fundDict.sharpe).toFixed(2) : '--',
          maxDraw: !isEmpty(fundDict.maxDraw) ? parseFloat(fundDict.maxDraw).toFixed(2) + '%' : '--'
        },
        {
          key: '2',
          name: benchmarkName,
          rateReturn: !isEmpty(benchmark[benchmark.length - 1][1]) ? benchmark[benchmark.length - 1][1] + '%' : '--',
          vol: !isEmpty(benchmarkDict.vol) ? parseFloat(benchmarkDict.vol).toFixed(2) + '%' : '--',
          sharpe: !isEmpty(benchmarkDict.sharpe) ? parseFloat(benchmarkDict.sharpe).toFixed(2) : '--',
          maxDraw: !isEmpty(benchmarkDict.maxDraw) ? parseFloat(benchmarkDict.maxDraw).toFixed(2) + '%' : '--'
        }
      ]
      this.setState({
        tableData
      })
    } else {
      hasData = true
    }
    this.setState({
      loading: false,
      hasData
    })
  }
  render() {
    const {loading,tableData,scoreTab,activeTab,hasData} = this.state
    return (
      <div>
        <div className="score-top">
          <span className="title">业绩表现</span>
          <div className="tabs">
            {
              scoreTab.map(item => {
                return (
                  <div key={item.key} className={item.key===activeTab?'tab tabActive':'tab'} onClick={() => this.choose(item.key)}>
                  { item.name }
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="movementsCharts">
          {/* 基金卡业绩走势折线图 */}
          <Spin
            spinning={loading}
            tip="Loading..."
          >
            {
              hasData &&
              <div>
                <div id="lineChart" className="lineChart" />
                <Table columns={columns} row-key="key" dataSource={tableData} pagination={false} />
              </div>
            }
            {
              !hasData &&
              <div>暂无数据</div>
            }
            {/* <Empty v-else empty-text="暂无数据" /> */}
          </Spin>
        </div>
      </div>
    )
  }
}
