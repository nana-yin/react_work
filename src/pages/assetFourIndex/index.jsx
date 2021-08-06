import React, { PureComponent } from 'react'
import * as echarts from 'echarts'
import {Spin} from 'antd'
import LeftBack from '../../components/Detail/Left'
import { getChart } from './chart.config.js'
import { accMul,getUrlParams } from '../../utils/asset'
import {getAssetIndex, getStrategyIndex} from '../../../mock/fourIndex.js'
import RightSide from '../../components/Detail/RightSide'
import './index.less'

class assetFourIndex extends PureComponent {
  state = {
    rightShow: false,
    idRes: '',
    typeRes: '',
    detailTypeRes: '',
    currentName: '',
    spinning: true,
    fourIndexTitle: '',
    getPageData: {},
    indexId: 'att_00000435',
    legendData: [],
    seriesData: [],
    xData: [],
    multiY: [],
    dataSet: [],
    indexInfo: [],
    typeChange: {
      '胜率': 'fmtWinRate',
      '盈亏比': 'fmtOdds',
      '趋势强度': 'mktTrend',
      '拥挤度': 'mktCongestion'
    }
  }
  componentDidMount() {
    const {search} = this.props.location
    const idRes = getUrlParams('id', search)
    const typeRes = getUrlParams('type', search)
    const detailTypeRes = getUrlParams('detailType', search)
    this.setState({
      idRes,typeRes,detailTypeRes
    }, () => {
      this.init()
    })
  }
  init = () => { // 数据初始化
    const {typeRes} = this.state
    if (typeRes === 'smallClassAsset') {
      const getPageDataRes = JSON.parse(JSON.stringify(getAssetIndex))
      this.setState({
        getPageData: getPageDataRes,
        currentName: getPageDataRes.assetName,
        rightShow: false
      }, ()=> {
        this.dataInit()
      })
      // this.fetchAssetIndex({
      //   assetId: idRes,
      //   type: this.typeChange[detailTypeRes]
      // }).then(() => {
      //   this.getPageData = JSON.parse(JSON.stringify(this.getAssetIndex))
      //   this.currentName = this.getPageData.assetName
      //   this.dataInit()
      // })
    } else {
      const getPageDataRes = JSON.parse(JSON.stringify(getStrategyIndex))
      this.setState({
        getPageData: getPageDataRes,
        currentName: getPageDataRes.strategyName,
        rightShow: true
      }, ()=> {
        this.dataInit()
      })
      // this.fetchStrategyIndex({
      //   strategyId: idRes, 
      //   type: this.typeChange[detailTypeRes]
      // }).then(() => {
      //   this.getPageData = JSON.parse(JSON.stringify(this.getStrategyIndex))
      //   this.currentName = this.getPageData.strategyName
      //   this.dataInit()
      // })
    }
  }
  dataInit = () => {
    const { detailTypeRes, getPageData, currentName} = this.state
    let fourIndexTitle = ''
    const indexId = getPageData.secId
    if (Object.keys(getPageData).length > 0) {
      if ((detailTypeRes === '胜率') || (detailTypeRes === '盈亏比')) {
        fourIndexTitle = currentName + '-基本面' + detailTypeRes
      }
      if ((detailTypeRes === '趋势强度') | (detailTypeRes === '拥挤度')) {
        fourIndexTitle = currentName + '-市场面' + detailTypeRes
      }
      const indexExplain = {
        introduce: getPageData.introduce,
        secId: getPageData.secId,
        secName: fourIndexTitle,
        usage: getPageData.usage
      }
      const indexInfoRes=[indexExplain]

      this.setState({
        fourIndexTitle,
        indexId,
        indexInfo: indexInfoRes
      }, () => {
        this.dataSort()
      })
    }
  }
  dataSort = () => {
    const {fourIndexTitle, currentName, getPageData, detailTypeRes} = this.state
    let legendDataRes = [],
        xDataRes = [], // X轴的数据
        seriesData = [], // serise数据
        leftData = [],
        rightData = [],
        multiY = [], // y轴的数据
        dataSet = []
    legendDataRes.push(fourIndexTitle, currentName + 'benchmark')
    for (let i = 0; i < getPageData.tradeDate.length; i++) {
      xDataRes.push(getPageData.tradeDate[i].split(' ')[0])
    }
    const backSerise = JSON.parse(JSON.stringify(getPageData.value))
    for (let i = 0; i < backSerise.length; i++) {
      leftData.push([xDataRes[i], backSerise[i]])
    }
    const backSeriseBenchmark = JSON.parse(JSON.stringify(getPageData.benchmark))
    for (let i = 0; i < backSeriseBenchmark.length; i++) {
      rightData.push([xDataRes[i], backSeriseBenchmark[i]])
    }
    seriesData.push({ // 当前资产的左侧serise
      type: 'line',
      name: fourIndexTitle,
      symbol: 'none',
      yAxisIndex: 0,
      connectNulls: true,
      areaStyle: { // 面积图
        color: 'rgba(155,114,53,0.2)'
      },
      data: leftData,
      lineStyle: { width: 1, color: '#af8e5d' }
    }, { // 当前资产的右侧benchmark的serise
      type: 'line',
      data: rightData,
      yAxisIndex: 1,
      connectNulls: true,
      lineStyle: {
        width: 3,
        color: '#f3b687'
      },
      itemStyle: {
        color: '#f3b687'
      },
      name: currentName + 'benchmark',
      symbolSize: 6
    })
    multiY.push({ // 左侧Y轴
      type: 'value',
      name: fourIndexTitle,
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: function(yAxisvalue) {
          if ((detailTypeRes === '胜率') || (detailTypeRes === '趋势强度')) {
            yAxisvalue = accMul(yAxisvalue).toFixed(0) + '%'
          }
          return yAxisvalue
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      nameGap: 10,
      nameTextStyle: { color: '#af8e5d' },
      offset: 0,
      position: 'left',
      show: true,
      splitLine: {
        lineStyle: {
          color: '#f3f3f3'
        }
      }
    }, { // 右侧Y轴
      type: 'value',
      name: currentName + 'benchmark',
      axisLabel: { color: '#666', fontSize: 12 },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      nameGap: 10,
      nameTextStyle: { color: '#f3b687' },
      offset: 0,
      position: 'right',
      show: true,
      splitLine: {
        lineStyle: {
          color: '#f3f3f3'
        }
      }
    })
    dataSet.push({
      digit: 2,
      newName: fourIndexTitle,
      region: (detailTypeRes === '胜率') || (detailTypeRes === '趋势强度') ? '百分号' : '小数',
      secName: fourIndexTitle
    }, {
      digit: 2,
      newName: currentName + 'benchmark',
      region: '小数',
      secName: currentName + 'benchmark'
    })
    
    this.setState({
      legendData: legendDataRes,
      xData: xDataRes,
      seriesData,
      multiY,
      dataSet
    }, () => {
      this.drawChart()
    })
  }
  drawChart = () => {
    const {indexId, legendData, seriesData, xData,multiY, dataSet} = this.state
    const fourIndexDom = document.getElementById(indexId)
    if (fourIndexDom) {
      const fourIndexChart = echarts.init(fourIndexDom)
      fourIndexChart.setOption(getChart(legendData, seriesData, xData,multiY, 0, dataSet, '', {}))
      this.setState({
        fourIndexChart,
        spinning: false
      })
    }
  }
  render() {
    const {spinning, fourIndexTitle, indexId, indexInfo, typeRes, rightShow, currentName } = this.state
    console.log('查看一下',typeRes)
    return (
      <Spin spinning={spinning} tip="Loading...">
        <div className="fourIndex">
          <div className="fourIndex-left">
            <LeftBack />
          </div>
          <div className="fourIndex-center">
            <div className="fourIndex-center__name">{ fourIndexTitle }详情</div>
            <div id={indexId} className="fourIndex-center_chart" />
            <div className="fourIndex-notes">
              {
                indexInfo.map((item, index) => {
                  return (
                    <div key={index} className="fourIndex-notes_box">
                    {
                      (item.introduce || item.usage) &&
                      <div className="note">
                        {
                          indexInfo.length > 1 &&
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
                        }
                        {
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
          <div className="fourIndex-right">
            {
              rightShow &&
              <RightSide pageTitle={currentName} type={typeRes} />
            }
          </div>
          <div className="clear" />
        </div>
      </Spin>
    )
  }
}

export default assetFourIndex
