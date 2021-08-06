import React, { Component } from 'react'
import {Spin} from 'antd'
import { accMul } from '../../../utils/asset'
import { getChart } from './chart.config'
import * as echarts from 'echarts'
import './index.less'

export default class EchartDetail extends Component {
  state = {
    myChart: null,
    spinning: true
  }
  componentDidMount() {
    this.char()
  }
  char = () => {
    const {id,options,type,getMacroSingleList } = this.props
    document.getElementById(id).removeAttribute('_echarts_instance_')
    const myChartRes = echarts.init(document.getElementById(id))
    let serise = []
    let yAxis = []
    let dataSet = []
    let visualMap = {} // 正负值颜色不同
    let dataZoom = 0

    if (Object.keys(options.chart).length === 0) {
      let offsetIndex = 0
      options.member.map((item, index) => {
        const yAxisConfig = {
          axisLabel: {
            formatter: function(yAxisvalue) {
              if (Object.keys(getMacroSingleList).length > 0) {
                yAxisvalue = accMul(yAxisvalue).toFixed(0) + '%'
              }
              return yAxisvalue
            },
            color: '#666',
            fontSize: 12
          },
          min: -1,
          max: 1,
          splitLine: {
            show:true,
            lineStyle: {
              color: '#f3f3f3'
            }
          },
          axisLine: {
            show:true,
            lineStyle: {
              color: '#ccc'
            }
          },
          axisTick: {
            show:true,
            lineStyle: {
              color: '#ccc'
            }
          },
          nameTextStyle: {
            color: '#af8e5d'
          },
          name: '',
          nameGap: 10,
          offset: 0,
          position: 'left',
          show: true,
          type: 'value'
        }

        if ((Object.keys(getMacroSingleList).length === 0) || (getMacroSingleList === undefined)) {
          delete yAxisConfig.min
          delete yAxisConfig.max
        }

        const dataSetConfig = {
          digit: 2,
          region: Object.keys(getMacroSingleList).length > 0 ? '百分号' : '小数'
        }
        const seriseConfig = {
          symbol: 'none',
          symbolSize: 6,
          type: 'line',
          name: '111111',
          yAxisIndex: 0,
          areaStyle: { // alice项目根据UI图进行修改的样式
            color: 'rgba(175,142,93,0.2)'
          },
          lineStyle: {
            width: 1
          },
          data: []
        }

        yAxisConfig['offset'] = offsetIndex * 20
        if (index === 0) {
          yAxisConfig.position = 'left'
        } else {
          yAxisConfig.position = 'right'
          offsetIndex++
        }
        yAxisConfig['name'] = item.secName
        yAxis.push(yAxisConfig)

        dataSet.push(dataSetConfig)

        seriseConfig['yAxisIndex'] = index
        
        if (type === 'macro') { // 只对宏观指标历史序列图表进行限制
          seriseConfig.lineStyle.opacity = 1
        }
        serise.push(seriseConfig)
      })
    } else {
      // 当 chart 的内容不为空时 设置默认的样式
      serise = JSON.parse(JSON.stringify(options.chart.serise))
      dataZoom = options.chart.dataZoom
      yAxis = JSON.parse(JSON.stringify(options.chart.yAxis))
      dataSet = JSON.parse(JSON.stringify(options.chart.dataSet))
      yAxis.map(item => {
        if (item.min) {
          delete item.min
        }
      })
    }
    const data = JSON.parse(JSON.stringify(options.data))
    const member = JSON.parse(JSON.stringify(options.member))
    const legendData = []
    let xData = []
    
    data.member.map((item, index) => {
      const seriseData = []
      item.tradeDate.map((date, i) => {
        const timer = date.split(' ')[0]
        xData.push(timer)
        seriseData.push([timer, item.value[i]])
      })
      serise[index].data = seriseData.reverse()
    })
    member.map((item, index) => {
      legendData.push(item.secName)
      serise[index].name = item.secName
    })
    dataSet.map((item, i) => {
      if (item.newName) {
        yAxis[serise[i].yAxisIndex].name = item.newName
      } else {
        yAxis[serise[i].yAxisIndex].name = options.member[i].secName
        item.newName = options.member[i].secName
      }
      item.secName = options.member[i].secName
      return item
    })

    // console.log(1111)
    // console.log('serise', serise)
    xData = Array.from(new Set(xData.map(item => item))).sort((a, b) => new Date(a) - new Date(b))
    myChartRes.clear()
    myChartRes.setOption(getChart(legendData, serise, xData, yAxis, dataZoom, dataSet, options.name, visualMap), true)
    this.setState({
      myChart: myChartRes,
      spinning: false
    })
    window.addEventListener('resize', function() {
      if (myChartRes) {
        myChartRes.resize()
      }
    })
  }
  render() {
    const {spinning} = this.state
    const {id, options} = this.props
    return (
      <Spin tip="Loading..." spinning={spinning}>
        <div className="macroDetail">
          <div id={id} className="macroDetail-char" />
          <div className="datePick"></div>
          <div className="macroDetail-notes">
          {
            options.member.map(item =>  {
              return (
                <div key={item.secId} className="macroDetail-notes_box">
                  {
                    (item.introduce || item.usage) &&
                    <div className="note">
                      {
                        (options.member.length > 1) &&
                        <div className="noteBox">
                          <span className="title">{ item.secName }</span>
                        </div>
                      } {
                        item.introduce!=='' &&
                        <div className="noteBox">
                          <span className="text">
                            <span className="title">指标含义：</span>
                            { item.introduce }
                          </span>
                        </div>
                      } {
                        item.usage!=='' &&
                        <div className="noteBox">
                          <span className="text">
                            <span className="title">指标用法：</span>
                            { item.usage }
                          </span>
                        </div>
                      }
                    </div>
                  }
                </div>
              )
            })
          }
        </div>
        </div>
    </Spin>
    )
  }
}
