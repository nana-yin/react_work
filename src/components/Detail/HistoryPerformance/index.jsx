import React, { Component } from 'react'
import * as echarts from 'echarts'
import {Table, Spin} from 'antd'
import { getHistoryLine } from './chart.config'
import { accMul } from '../../../utils/asset.js'
import { calcBoundary } from '../../../utils/assetRequest.js'
import './index.less'

export default class HistoryPerformance extends Component {
  state = {
    xData: [], // 绘图数据
      seriseData: [],
      legendData: [],
      ySerise: [],
      historyBack: {}, // 从后端获取的数据
      spinning: true,
      modelShow: true,
      columns: [{
        title: '',
        key: 'name',
        dataIndex: 'name',
        width: 200,
        align: 'center'
      },
      {
        title: '年化收益率',
        key: 'rtnYearly',
        dataIndex: 'rtnYearly',
        width: 150,
        align: 'center'
      },
      {
        title: '年化波动率',
        key: 'rtnVol',
        dataIndex: 'rtnVol',
        width: 150,
        align: 'center'
      },
      {
        title: '最大回撤',
        key: 'maxDd',
        dataIndex: 'maxDd',
        width: 150,
        align: 'center'
      },
      {
        title: '夏普比率',
        key: 'sharpe',
        dataIndex: 'sharpe',
        width: 150,
        align: 'center'
      },
      {
        title: '卡玛比率',
        key: 'calmar',
        dataIndex: 'calmar',
        width: 150,
        align: 'center'
      }],
      tableData: [],
      lineChart: null
  }
  componentDidMount() {
    const {historyData} = this.props
    if (Object.keys(historyData).length > 0) {
      const historyBackRes = JSON.parse(JSON.stringify(historyData))
      this.setState({
        historyBack: historyBackRes
      }, () => {
        if (!this.state.spinning) return
        this.historyChart()
      })
    }
  }
  historyChart = () => {
    let tableDataRes = [],
        ySeriseRes = [],
        xDataRes = [],
        seriseDataRes = [],
        legendDataRes = []
    const {historyBack} = this.state
    if (Object.keys(historyBack).length > 0) {
      this.setState({
        modelShow: true
      }, () => {
        tableDataRes.push({
          key: 0,
          name: '回测净值绩效评价',
          rtnYearly: historyBack.netValEval.rtnYearly === null ? '--' : accMul(historyBack.netValEval.rtnYearly, 100).toFixed(2) + '%',
          maxDd: historyBack.netValEval.maxWd === null ? '--' : accMul(historyBack.netValEval.maxWd).toFixed(2) + '%',
          rtnVol: historyBack.netValEval.volYearly === null ? '--' : accMul(historyBack.netValEval.volYearly).toFixed(2) + '%',
          sharpe: historyBack.netValEval.sharpe === null ? '--' : (accMul(accMul(historyBack.netValEval.sharpe, 100), 0.01)).toFixed(2),
          calmar: historyBack.netValEval.calmar === null ? '--' : (accMul(accMul(historyBack.netValEval.calmar, 100), 0.01)).toFixed(2)
        }, {
          key: 1,
          name: '基准绩效评价',
          rtnYearly: historyBack.benchmarkEval.rtnYearly === null ? '--' : accMul(historyBack.benchmarkEval.rtnYearly, 100).toFixed(2) + '%',
          maxDd: historyBack.benchmarkEval.maxWd === null ? '--' : accMul(historyBack.benchmarkEval.maxWd).toFixed(2) + '%',
          rtnVol: historyBack.benchmarkEval.volYearly === null ? '--' : accMul(historyBack.benchmarkEval.volYearly).toFixed(2) + '%',
          sharpe: historyBack.benchmarkEval.sharpe === null ? '--' : (accMul(accMul(historyBack.benchmarkEval.sharpe, 100), 0.01)).toFixed(2),
          calmar: historyBack.benchmarkEval.calmar === null ? '--' : (accMul(accMul(historyBack.benchmarkEval.calmar, 100), 0.01)).toFixed(2)
        })
        this.setState({
          tableData: tableDataRes
        })

        const lineChartRes = echarts.init(document.getElementById('historyLine'))
        lineChartRes.clear()
        this.setState({
          lineChart: lineChartRes
        })
        xDataRes = historyBack.tradeDate.map(item => {
          return item.split(' ')[0]
        })
        const calcVal = calcBoundary(historyBack.benchmark, 0.1, 0.1, 'detailPage')
        const calcVal2 = calcBoundary(historyBack.netVal, 0.1, 0.1, 'detailPage')
        const calcVal3 = calcBoundary(historyBack.fmtOdds, 0.1, 0.1, 'detailPage')
        const calcVal4 = calcBoundary(historyBack.fmtWinRate, 0.1, 0.1, 'detailPage')
        ySeriseRes.push({
          show: true,
          type: 'value',
          min: calcVal['lowerVal'],
          max: calcVal['upperVal'],
          name: historyBack.benchmarkName,
          position: 'left',
          offset: 0,
          nameGap: 10,
          nameTextStyle: {
            align: 'left',
            fontSize: 14
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#af8e5d'
            }
          },
          axisLabel: {
            itemStyle: {
              color: '#af8e5d',
              fontSize: 14
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        })
        seriseDataRes.push({
          name: historyBack.benchmarkName,
          nameLocation: 'end',
          type: 'line',
          connectNulls: true,
          data: historyBack.benchmark,
          lineStyle: {
            width: 3,
            color: '#af8e5d'
          },
          itemStyle: {
            color: '#af8e5d',
            shadowColor: 'rgba(199,176,141,0.25)',
            shadowBlur: 6
          }
        })
        legendDataRes.push(historyBack.benchmarkName)

        ySeriseRes.push({
          show: true,
          type: 'value',
          min: calcVal2['lowerVal'],
          max: calcVal2['upperVal'],
          name: '回测净值',
          position: 'right',
          offset: 0,
          nameGap: 10,
          nameTextStyle: {
            align: 'left',
            fontSize: 14
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#9b7235'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          },
          axisLabel: {
            itemStyle: {
              color: '#9b7235',
              fontSize: 14
            }
          }
        })
        seriseDataRes.push({
          name: '回测净值',
          type: 'line',
          connectNulls: true,
          data: historyBack.netVal,
          yAxisIndex: 1,
          itemStyle: {
            color: '#9b7235',
            shadowColor: 'rgba(199,176,141,0.25)',
            shadowBlur: 5
          },
          lineStyle: {
            width: 3,
            color: '#9b7235'
          }
        })
        ySeriseRes.push({
          show: false,
          type: 'value',
          min: calcVal3['lowerVal'],
          max: calcVal3['upperVal'],
          name: '盈亏比',
          position: 'right',
          nameGap: 10,
          nameTextStyle: {
            align: 'left',
            fontSize: 14
          },
          offset: 30,
          axisLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ee8e45'
            }
          },
          axisLabel: {
            itemStyle: {
              color: '#ee8e45',
              fontSize: 14
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        })
        seriseDataRes.push({
          name: '盈亏比',
          type: 'line',
          connectNulls: true,
          data: historyBack.fmtOdds,
          yAxisIndex: 2,
          lineStyle: {
            width: 3,
            color: '#ee8e45'
          },
          itemStyle: {
            color: '#ee8e45',
            shadowColor: '#ee8e45',
            shadowBlur: 8
          }
        })

        ySeriseRes.push({
          show: false,
          type: 'value',
          min: calcVal4['lowerVal'],
          max: calcVal4['upperVal'],
          name: '胜率',
          position: 'right',
          offset: 80,
          nameGap: 10,
          nameTextStyle: {
            align: 'left',
            fontSize: 14
          },
          axisLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ffb92c'
            }
          },
          axisLabel: {
            formatter: function(val) {
              return accMul(val) + '%'
            },
            itemStyle: {
              color: '#ffb92c',
              fontSize: 14
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        })
        seriseDataRes.push({
          name: '胜率',
          type: 'line',
          connectNulls: true,
          data: historyBack.fmtWinRate,
          yAxisIndex: 3,
          lineStyle: {
            width: 3,
            color: '#ffb92c'
          },
          itemStyle: {
            color: '#ffb92c',
            shadowColor: '#ffb92c',
            shadowBlur: 8
          }
        })
        legendDataRes.push('回测净值', '盈亏比', '胜率')
        let xAxisData = xDataRes
        xAxisData = [...Array.from(new Set(xAxisData))]
        xAxisData.sort(function(a, b) {
          return a > b ? 1 : -1
        })
        xDataRes = xAxisData
        // 0表示初始化，1表示重绘
        lineChartRes.setOption(getHistoryLine(xDataRes, seriseDataRes, ySeriseRes, legendDataRes, 0))
        this.setState({
          spinning: false
        })
        lineChartRes.on('legendselectchanged', params => { // 点击的图例显示和隐藏
          ySeriseRes.map(item => {
          // console.log(item.name, params.name)
            if (item.name === params.name) {
            // console.log('显示隐藏', item.show)
              item.show = !item.show
              if (!item.show) { // 隐藏
                item.position = ''
                let leftShow = true
                const rightArr = []
                const rightArrReal = []
                leftShow = ySeriseRes.some(k => {
                  return (k.position === 'left' && k.show === true)
                })
                ySeriseRes.map((j, p) => {
                  if (j.show === true && j.position && j.position === 'right') {
                    rightArr.push(p)
                    rightArrReal.push(j)
                  }
                })
                if (!leftShow) {
                  if (rightArr.length > 0) {
                    ySeriseRes[Math.min.apply(Math, rightArr)].position = 'left'
                    ySeriseRes[Math.min.apply(Math, rightArr)].offset = 0
                    ySeriseRes[Math.min.apply(Math, rightArr)].nameGap = 10
                    for (let i = 0; i < rightArrReal.length; i++) {
                      if (i !== 0) {
                        rightArrReal[i].position = 'right'
                        rightArrReal[i].offset = 66 * (i - 1)
                      }
                    }
                  }
                } else {
                  for (let ii = 0; ii < rightArrReal.length; ii++) {
                    rightArrReal[ii].position = 'right'
                    rightArrReal[ii].offset = 66 * ii
                  }
                }
              } else { // 显示
                const rightArr2 = []
                const rightArrReal2 = []
                const first = []
                let leftShow2 = true
                if (ySeriseRes[0].name === params.name && ySeriseRes[0].show === true) { // 如果是第一个
                  ySeriseRes.map((j, p) => {
                    if (p !== 0 && j.show === true) {
                      j.position = 'right'
                      first.push(j)
                    } else {
                      ySeriseRes[0].position = 'left'
                      ySeriseRes[0].offset = 0
                    }
                    if (first.length === 3) {
                      for (let m = 0; m < first.length; m++) {
                        first[m].offset = 66 * m
                      }
                    } else {
                      for (let n = 0; n < first.length; n++) {
                        first[n].offset = 66 * n
                      }
                    }
                  })
                } else { // 显示如果不是第一个
                  leftShow2 = ySeriseRes.some(k => {
                    return (k.position === 'left' && k.show === true)
                  })
                  ySeriseRes.map((j, p) => {
                    if (p !== 0 && j.position !== 'left') {
                      j.position = 'right'
                    }
                    if (j.show === true && j.position !== 'left') {
                      rightArr2.push(p)
                      rightArrReal2.push(j)
                    }
                  })
                  if (!leftShow2) { // 左侧没轴
                    if (rightArr2.length > 0) {
                      ySeriseRes[Math.min.apply(Math, rightArr2)].position = 'left'
                      ySeriseRes[Math.min.apply(Math, rightArr2)].offset = 0
                    }
                  } else { // 左侧有数据
                    if (rightArrReal2.length === 3) {
                      for (let q = 0; q < rightArrReal2.length; q++) {
                        rightArrReal2[q].position = 'right'
                        rightArrReal2[q].offset = 66 * q
                      }
                    } else {
                      for (let a = 0; a < rightArrReal2.length; a++) {
                        rightArrReal2[a].position = 'right'
                        rightArrReal2[a].offset = 66 * a
                      }
                    }
                  }
                }
              }
            }
          })
          lineChartRes.setOption(getHistoryLine(xDataRes, seriseDataRes, ySeriseRes, legendDataRes, 1))
        })
        window.addEventListener('resize', () => {
          lineChartRes.resize()
        })
      })
    } else {
      this.setState({
        modelShow: false,
        spinning: false
      })
    }
  }
  render() {
    const {spinning, modelShow, columns, tableData} = this.state
    const {historyName} = this.props
    return (
      <Spin tip="Loading..." spinning={spinning}>
        {
          modelShow &&
          <div className="assetStrategyDetail-historyLine">
            <div className="assetStrategyDetail-history__title">历史表现</div>
            <div className="assetStrategyDetail-historyLine__title">{ historyName }</div>
            <div id="historyLine" />
            <div className="datePick"></div>
            {/* <RangePicker bordered={false} /> */}
            <div className="assetStrategyDetail-historyLine__tableBox">
              <div className="assetStrategyDetail-historyLine__tableTitle">绩效评价：</div>
              <Table
                className="assetStrategyDetail-historyLine__table"
                columns={columns}
                dataSource={tableData}
                bordered={true}
                pagination={false}
              />
            </div>
          </div>
        }
      </Spin>
    )
  }
}
