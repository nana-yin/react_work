import React, { Component } from 'react'
import {Table} from 'antd'
import * as echarts from 'echarts';
import {colorMap,accMul, changNunToText} from '../../../utils/asset.js'
// 引入小类资产、行业策略假数据
import {getAssetSmall, getIndusty} from '../../../../mock/detail'
// 引入风格策略假数据
import {getAssetStrategy} from '../../../../mock/styleCard'
import {getDashChart} from './chart.config.js'
import trendDown from '../../../../public/images/marketPerspectiveUp.png'
import trendUnchange from '../../../../public/images/marketPerspectiveUnchang.png'
import trendUp from '../../../../public/images/marketPerspectiveDown.png'
import DashboardChart from '../DashboardChart'
import LongTermExpect from '../LongTermExpect'
import IndexRelation from '../IndexRelation'
import HistoryPerformance from '../HistoryPerformance'
import PerspectiveTable from '../PerspectiveTable'
import IndustryProfitChart from '../IndustryProfitChart'
import './index.less'

export default class AssetDetail extends Component {
  state = {
    yAxisName: '',
    colorMap: colorMap,
    trendUp: trendUp,
    trendDown: trendDown,
    trendUnchange: trendUnchange,
    echartData: {
      basic: [],
      dateArr: [1]
    },
    columns: [{
      title: '',
      key: 'name',
      dataIndex: 'name',
      width: 100,
      render: (text) => (
        <span className="dashStatus">{ text }</span>
      ),
    },
    {
      title: '当前状态',
      key: 'status',
      dataIndex: 'status',
      width: 100,
      render: (text) => (
        <span className="dashStatus"
        style = {{
          color: text !== '--' ? colorMap[text] : '',
          backgroundColor:  text !== '--' ? this.bgColor(colorMap[text], 0.1) : '',
          borderColor: text !== '--' ? colorMap[text] : ''
        }}
        >{ text }
        </span>
      ),
    },
    {
      title: '当前数值',
      key: 'numerical',
      dataIndex: 'numerical',
      width: 100,
      render: (text, record) => (
        <span>
          { record.name === '胜率' || record.name === '趋势强度' ? text === '--' ? '--' : text+ '%' : text }
        </span>
      ),
    },
    {
      title: '近三个月变化',
      key: 'transformData',
      dataIndex: 'transformData',
      width: 150,
      render: (_, record) => (
        <span id={record.key ? record.key : record.name} className="dashChange" />
      )
    }, {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      width: 120,
      render: (_, record) => (
        <a className="dashAction" onClick={() => {this.goDashAction(record)}}>详情</a>
      ),
    }],
    data: [],
    dashChart: null,
    tableData: {},
    tableLine: {},
    drawHistory: false
  }
  componentDidMount() {
    const {type} = this.props
    const {echartData} = this.state
    let basicRes = {}
    let tableDataRes = {}
    let tableLineRes = {}
    if(type === 'smallClassAsset') { // 小类资产卡
      basicRes = [this.scatterPoint(JSON.parse(JSON.stringify(getAssetSmall.compass)))]
      tableDataRes = JSON.parse(JSON.stringify(getAssetSmall.detail))
      tableLineRes = JSON.parse(JSON.stringify(getAssetSmall.historyPerf))
    }

    if(type === 'styleStrategy'  || type ===  'industryStrategy') { // 风格策略卡
      basicRes = [this.scatterPoint(JSON.parse(JSON.stringify(getAssetStrategy.compass)))]
      tableDataRes = JSON.parse(JSON.stringify(getAssetStrategy.detail))
      tableLineRes = JSON.parse(JSON.stringify(getAssetStrategy.historyPerf))
    }

    if (type == 'industryStrategy') { // 行业策略卡
      basicRes = [this.scatterPoint(JSON.parse(JSON.stringify(getIndusty.compass)))]
      tableDataRes = JSON.parse(JSON.stringify(getIndusty.detail))
      tableLineRes = JSON.parse(JSON.stringify(getIndusty.historyPerf))
    }
    const compassRes = echartData['basic']
    this.setState({
      [compassRes]: basicRes,
      tableData: tableDataRes,
      tableLine: tableLineRes
    }, () => {
      this.setState({
        drawHistory: true
      }, () => {
        this.tableDataInit()
      })
    })
  }
  tableDataInit() {
    const {tableData} = this.state
    const {id, type} = this.props
    // 大类资产-》largeClassAsset  小类资产-》smallClassAsset  A股风格-》styleStrategy  A股行业-》industryStrategy
    const dataRes = [{
      key: 1,
      name: '盈亏比',
      status: '较低',
      numerical: tableData.fmtOdds&& tableData.fmtOdds.length > 0 ? (accMul(accMul(tableData.fmtOdds[tableData.fmtOdds.length - 1], 100), 0.01)).toFixed(2) : null,
      transformData: tableData.fmtOdds
    }, {
      key: 2,
      name: '趋势强度',
      status: '较低',
      numerical: tableData.mktTrend && tableData.mktTrend.length > 0 ? accMul(tableData.mktTrend[tableData.mktTrend.length - 1], 100) : null,
      transformData: tableData.mktTrend
    }]
    
    if (type !== 'industryStrategy') {
      this.setState({
        yAxisName: '胜率'
      })
      dataRes.unshift({
        key: tableData.fmtWinRate.secId ? tableData.fmtWinRate.secId : 3,
        name: '胜率',
        status: '较高',
        numerical: tableData.fmtWinRate.length > 0 ? accMul(tableData.fmtWinRate[tableData.fmtWinRate.length - 1], 100) : null,
        transformData: tableData.fmtWinRate
      })
      dataRes.push({
        key: tableData.mktCongestion.secId ? tableData.mktCongestion.secId : 4,
        name: '拥挤度',
        status: '较低',
        numerical: tableData.mktCongestion.length > 0 ? (accMul(accMul(tableData.mktCongestion[tableData.mktCongestion.length - 1], 100), 0.01)).toFixed(2) : null,
        transformData: tableData.mktCongestion
      })
    } else {
      this.setState({
        yAxisName: '趋势强度'
      })
    }
    
    this.setState({
      data: dataRes
    }, () => {
      dataRes.map(item => {
        if (item.numerical === null) {
          item.status = '--'
          item.numerical = '--'
        } else {
          item.numerical = (Number(item.numerical)).toFixed(2)
          let val = Number(item.numerical)
          if (item.name === '胜率' || item.name === '趋势强度') {
            val = accMul(item.numerical, 0.01)
          }
          item.status = changNunToText(item.name, val)
        }
        this.chartInit(item)
      })
    })
  }
  scatterPoint(data) {
    const arr = []
    if (data.length > 0) {
      data.map(item => {
        // console.log('数据', item)
        const obj = {
          assetId: item.assetId === undefined ? item.strategyId : item.assetId,
          name: item.name,
          x: item.fmtOdds,
          y: item.fmtWinRate === undefined ? item.mktTrend : item.fmtWinRate
        }
        arr.push(obj)
      })
    }
    return arr
  }
  chartInit(val) {
    const dashChartDom = document.getElementById(val.key)
    const dashChartRes = echarts.init(dashChartDom)
    dashChartRes.setOption(getDashChart(val.transformData))
    this.setState({
      dashChart: dashChartRes
    })
  }
  goDashAction = (param) => {
    const {id, type, history} = this.props
    history.push('/assetFourIndex?id='+id+'&type='+type+'&detailType='+param.name)
    // history.push({ 
    //   // pathname: '/asset/assetFourIndex',
    //   pathname: '/assetFourIndex', 
    //   state: { 
    //     detailType: param.name,
    //     id: id,
    //     type: type
    //   } 
    // })
  }
  bgColor(hex, opacity) { // 转换颜色
    return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')'
  }
  render() {
    const {id, type, pageTitle} = this.props
    const {columns, data, tableLine, drawHistory} = this.state
    return (
      <div className="assetStrategyDetail-centerBox">
        <div className="assetStrategyDetail-scatter">
          <div className="assetStrategyDetail-scatter__name">决策罗盘</div>
          {
            (type !== 'industryStrategy')
              && 
            <div className="assetStrategyDetail-scatter__chartName">基本面</div>
          }
          {/* <scatterChart :echart-color-type="2" :style="{width: yAxisName!=='胜率'? '700px' :'565px',height: yAxisName!=='胜率'? '500px':'410px',margin: '0 auto'}" :font-size="'16px'" :echart-data="echartData" :active-asset="this.$route.query.id" :y-axis-name="yAxisName" /> */}
        </div>
        <div className="assetStrategyDetail-dashboard">
          {
            (type !== 'industryStrategy')
              &&
            <div className="assetStrategyDetail-scatter__chartName" style={{margin: '20px 0 0'}}>市场面</div>
          }
          {
            (type !== 'industryStrategy')
              &&
            <DashboardChart drawChart={type === 'smallClassAsset' ? getAssetSmall : getAssetStrategy}/>
          }
          <Table
            className="assetStrategyDetail-dashboard__table"
            style={type !== 'industryStrategy' ? {marginTop: "-55px"} : {marginTop: "20px"}}
            columns={columns}
            dataSource={data}
            bordered={true}
            pagination={false}
          />
        </div>
        <div className="assetStrategyDetail-diagram">
          <IndexRelation drawChart={type === 'smallClassAsset' ? getAssetSmall : getAssetStrategy} id={id} type={type}/>
        </div>
        {
          (type.indexOf('ClassAsset') !== -1)
            &&
          <div className="assetStrategyDetail-longTermScatter">
            <LongTermExpect pageTitle={pageTitle} drawChart={type === 'smallClassAsset' ? getAssetSmall : getAssetStrategy}/>
          </div>
        }
        {
          (type !== 'industryStrategy') && drawHistory
            &&
          <div className="assetStrategyDetail-history">
            <HistoryPerformance historyName={pageTitle} historyData={tableLine} id={id} type={type}/>
          </div>
        }
        {
          (type == 'industryStrategy')
            &&
          <div className="assetStrategyDetail-industryProfit">
            <div className="assetStrategyDetail-industryProfit__title">行业相对收益</div>
            <IndustryProfitChart assetName={pageTitle} getIndustyChart={getIndusty} />
          </div>
        }
        {
          type.indexOf('ClassAsset') !== -1 &&
          getAssetSmall.marketPerspective.length > 0
          &&
          <div className="assetStrategyDetail-perspective">
            <div className="assetStrategyDetail-perspective__title">市场透视</div>
            <PerspectiveTable perspectiveData={getAssetSmall} />
          </div>
        }
      </div>
    )
  }
}
