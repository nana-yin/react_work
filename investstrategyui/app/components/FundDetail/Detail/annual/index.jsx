import React, { Component } from 'react'
// 业绩表现的日期tab,isEmpty判断数据是否是空
import { MOVEMENTS_TIME_CARD,isEmpty } from '../../../../util/fund'
// 引入加载中,按钮，单选框组件
import { Spin, Radio } from 'antd';
// 引入七日年化等数据
import {annualList} from '../../../../mock/fund'
// 引入echarts
import * as echarts from 'echarts'
// 引入绘图的模板
import {drawLine} from './chart.config.js'
// 引入当前页面的样式
import './index.less'

export default class Annual extends Component {
  state = {
    activeTab: '1', // 七日年化收益的活跃tab
    movementsTime: MOVEMENTS_TIME_CARD, // 业绩表现中的时间选择tab
    loading: true, // 页面处于正在加载中
    currentBtn: '七日年化收益率', // 当前的按钮
    xAxisData: [], // x轴的数据
    seriesData: [] // serise的数据
  }
  componentDidMount() {
    this.fetchChart()
  }
  /**
   * 点击时间区间进行重新获取数据
   * @param key 时间
  */
  choose = (key) => {
    this.setState({
      loading: true,
      activeTab: key
    },() => {
      this.fetchChart()
    })
  }
  /**
     * 请求七日年化的数据并进行处理
    */
  fetchChart = () => {
    let xData = []
    let seriesData = []
    const{detailList} = annualList
    if (detailList && detailList.length > 0) {
      detailList.map(item => {
        const tradeDate = item.tradeDate || ''
        const val = !isEmpty(item.yearlyRot) ? item.yearlyRot.toFixed(2) : null
        xData.push(tradeDate)
        seriesData.push([tradeDate, val])
      })
      xData = [...Array.from(new Set(xData))]
      xData.sort(function(a, b) {
        return a > b ? 1 : -1
      })
      this.setState({
        xAxisData: xData,
        seriesData,
        loading: false
      },() => {
        this.initChart(xData,seriesData)
      })
    }
  }
  /**
   * 初始化绘图数据
   * @param xAxisData x轴数据
   * @param seriesData serise绘图
  */
  initChart = (xAxisData,seriesData)=> {
    const {activeTab,currentBtn} = this.state
    // console.log('处理好的数据', data)
    const lineDom = document.getElementById('annualLine-' + activeTab)
    if (lineDom) {
      const myChart = echarts.init(lineDom)
      myChart.clear()
      myChart.setOption(
        drawLine(xAxisData, seriesData,currentBtn), true
      )
      myChart.getZr().on('mousemove', _ => {
        myChart.getZr().setCursorStyle('default')
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
  /**
   * 更换按钮
   * @param e 当前的事件
  */
  handleBtnChange = e => {
    this.setState({ 
      currentBtn: e.target.value
    }, () => {
      // 重新请求数据进行绘图
      this.fetchChart()
    })
  }
  render() {
    const {movementsTime, activeTab,loading, seriesData, currentBtn} = this.state
    return (
      <div className="annual">
        <div className="score-top">
          <span className="title">业绩表现</span>
          <div className="tabs">
            {
              movementsTime.map(item => {
                return (
                  <div key={item.key} className={item.key===activeTab?'tab tabActive':'tab'} onClick={() => this.choose(item.key)}>
                  { item.name }
                  </div>
                )
              })
            }
          </div>
        </div>
        <Spin
            spinning={loading}
            tip="Loading..."
          >
            {
              seriesData.length > 0 &&
              <div>
                <Radio.Group value={currentBtn} onChange={this.handleBtnChange}>
                  <Radio.Button value="七日年化收益率">七日年化收益率</Radio.Button>
                  <Radio.Button value="万份收益">万份收益</Radio.Button>
                </Radio.Group>
                <div id={'annualLine-'+activeTab} className="annualLine" />
              </div>
            }
            {
              seriesData.length === 0 &&
              <span>暂无数据</span>
            }
          </Spin>
      </div>
    )
  }
}
