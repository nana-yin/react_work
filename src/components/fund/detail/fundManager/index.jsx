import React, { Component } from 'react'
// 引入表格组件
import { Table } from 'antd';
// 引入基金经理的颜色
import {MANAGER_COLOR} from '@/utils/fund.js'
// 引入基金经理的数据
import {fundManager} from '../../../../../mock/fund'
// isEmpty对数据为空进行处理,颜色转换
import { isEmpty,accMul,bgColor } from '@/utils/fund.js'
// 引入echarts
import * as echarts from 'echarts'
// 引入基金经理的列表表头，绘图的模板
import {columns,drawManager} from './chart.config'
// 引入当前页面的样式
import './index.less'

export default class FundManager extends Component {
  state = {
    columns, // 基金经理的列表表头
    newDate: null, // 最新的时间
    tableData: [], // 表格的数据
    legendData: [], // 图例数据
    seriesData: [], // serise数据
    xAxisData: [] // x轴的数据
  }
  componentDidMount() {
    // 获取后端的数据
    this.fetchInit()
  }
  // 初始化页面的样式
  fetchInit = () => {
    const {fundName} = this.props
    const {managerList, rtnList} = fundManager
    // 表格数据
    let tableData = []
    // 基金经理标记数据
    const markAreaData = []
    // 最新的日期
    const newDate = (rtnList && rtnList.length > 0) ? rtnList[rtnList.length - 1].tradeDate ? rtnList[rtnList.length - 1].tradeDate.split(' ')[0] : null : null
    this.setState({
      newDate
    }, () => {
      // 处理基金经理的表格数据
      if (managerList && managerList.length > 0) {
        managerList.forEach((item, index) => {
          const obj = {
            manager: (item.manager && item.manager.length > 0) ? item.manager.join('、') : '--',
            startDate: item.startDate ? item.startDate : '--',
            leaveDate: item.leaveDate ? item.leaveDate : '在职',
            days: !isEmpty(item.days) ? item.days : '--',
            rtnRate: !isEmpty(item.rtnRate) ? item.rtnRate.toFixed(2) : '--', // 累积收益率 单位:%
            color: MANAGER_COLOR[index]
          }
          tableData.push(obj)
          // 基金经理标记数据
          const arr = [{
            name: obj.manager,
            xAxis: obj.startDate,
            itemStyle: {
              color: bgColor(MANAGER_COLOR[index],0.5)
            }
          }, {
            xAxis: obj.leaveDate === '在职' ? newDate : obj.leaveDate
          }]
          markAreaData.push(arr)
        })
        tableData = tableData.reverse()

        // 绘图数据
        let legendData = [fundName, '沪深300']
        let seriesData = []
        let xAxisData = []
        // 根据图例数据进行serise数据的处理
        legendData.map(item => {
          const chartObj = {
            type: 'line',
            cursor: 'default',
            name: item,
            showSymbol: false,
            symbolSize: 9,
            connectNulls: true,
            data: [],
            emphasis: {
              // 鼠标hover上去的时候，拐点的颜色和样式
              itemStyle: {
                borderWidth: 3, // 描边的线宽
                // shadowBlur: 5 // 图形的阴影大小
              }
            }
          }
          seriesData.push(chartObj)
        })
        
        // 将基金经理进行区域标记
        seriesData[0].markArea = {
          label: {
            show: false,
          },
          data: markAreaData
        }

        if (rtnList && rtnList.length > 0) {
          rtnList.forEach(item => {
            // x轴的数据处理
            const date = item.tradeDate ? item.tradeDate.split(' ')[0] : '--'
            xAxisData.push(date)
            const val = !isEmpty(item.dayPctChange) ? parseFloat(accMul(item.dayPctChange)).toFixed(2) : '--'
            const benchVal = !isEmpty(item.benchmark) ? parseFloat(item.benchmark).toFixed(2) : '--'
            seriesData[0].data.push({
              // 将该区域显示基金经理的名称
              managerData: this.returnManagerLast(item.tradeDate, tableData),
              value: [date,val]
            })
            seriesData[1].data.push({
              value: [date,benchVal]
            })
          })
        }
        this.setState({
          tableData,
          legendData, // 图例数据
          seriesData, // serise数据
          xAxisData // x轴的数据
        }, () => {
          this.chartInit()
        })
      }
    })
  }
  /**
   * 返回图表中提示框基金经理的名字和日期范围
   * @param date 当前的时间
   * @param managerRangeList 基金经理的列表数据
  */
  returnManagerLast = (date, tableData) => {
    let managerLast = {
      name: '--',
      date: []
    }
    // 将日期传化为时间戳进行比较
    const currentDate = (new Date(date)).getTime()
    // 判断当前的日期是否在某个区间内
    for (let i = 0; i < tableData.length; i++) {
      const startDate = (new Date(tableData[i].startDate)).getTime()
      const leaveDate = tableData[i].leaveDate === '在职' ? (new Date(this.state.newDate)).getTime() : (new Date(tableData[i].leaveDate)).getTime()
      if (currentDate >= startDate && currentDate <= leaveDate) {
        managerLast.name = tableData[i].manager
        managerLast.date[0] = tableData[i].startDate
        managerLast.date[1] = tableData[i].leaveDate
        break
      }
    }
    return managerLast
  }
  chartInit = () => {
    const {legendData,xAxisData,seriesData} = this.state
    const managerDom = document.getElementsByClassName('managerChart')[0]
    if (managerDom) {
      const myChart = echarts.init(managerDom)
      myChart.setOption(drawManager(legendData,xAxisData,seriesData))
      myChart.getZr().on('mousemove', _ => {
        myChart.getZr().setCursorStyle('default')
      })
    }
  }
  render() {
    const {columns,tableData} = this.state
    return (
      <div className="fundManager-component">
        <div className="title">基金经理</div>
        <div className="managerChart"></div>
        <Table columns={columns} dataSource={tableData} pagination={false} />
      </div>
    )
  }
}
