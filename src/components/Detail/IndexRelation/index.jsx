import React, { Component } from 'react'
import G6 from '@antv/g6';
import {Spin} from 'antd'
import { getTreeChart } from './chart.config'
import './index.less'

export default class index extends Component {
  state = {
    winRateBack: {}, // 从后端获取的胜率数据
    oddsBack: {}, // 从后端获取的盈亏比数据
    graph: null,
    winShow: true,
    oddShow: true,
    spinning: true,
    annotation: [{
      title: '正向驱动',
      className: 'pos'
    }, {
      title: '负向驱动',
      className: 'neg'
    }, {
      title: '上升',
      className: 'up'
    },{
      title: '下降',
      className: 'down'
    }]
  }
  componentDidMount() {
    const {drawChart} = this.props
    if (Object.keys(drawChart).length > 0) {
      const winRateBackRes = drawChart.winRateRelation
      const oddsBackRes = drawChart.oddsRelation
      this.setState({
        winRateBack: winRateBackRes,
        oddsBack: oddsBackRes
      },() => {
        this.dashBoardChart()
      })
    }
  }
  dashBoardChart = () => {
    const {winRateBack, oddsBack} = this.state
    const {type} = this.props
    if (winRateBack !== null || oddsBack !== null) {
      this.setState({
        winShow: true,
        oddShow: true
      }, ()=> {
        if (type === 'industryStrategy') { // 行业策略
          this.getLeafCount(oddsBack, 'indicatorChart')
        } else {
          this.getLeafCount(winRateBack, 'relationG2')
          this.getLeafCount(oddsBack, 'indicatorChart')
        }
      })
    } else {
      if (winRateBack === null) {
        this.setState({
          winShow: false,
          oddShow: true
        })
      }
      if (this.oddsBack === null) {
        this.setState({
          winShow: true,
          oddShow: false
        })
      }
      this.setState({
        spinning: false
      })
    }
  }
  getLeafCount = (resultList, dom) => {
    const {type} = this.props
    document.getElementById(dom).innerHTML = ''
    let verticalLayer = 1 // 竖向的元素个数
    const verticalTwo = resultList.subset.length
    let verticalThree = 0
    const chartWidth = document.getElementById(dom).scrollWidth - 40
    let chartHeight = document.getElementById(dom).scrollHeight
    let flagIndex = 0
    const resultRes = { // 最左边的父元素
      name: resultList.name,
      id: resultList.secId === undefined ? resultList.assetId + ' node_assetId' : resultList.secId + ' node_secId',
      children: []
    }
    if (resultList.subset) { // 两层
      resultList.subset.map(val => {
        const obj = {
          name: val.name,
          id: val.secId === undefined ? val.assetId + ' nodeSub_assetId' + flagIndex : val.secId + ' nodeSub_secId' + flagIndex,
          relation: val.relation,
          children: []
        }
        if (val.subset) { // 三层
          val.subset.map(subItem => {
            flagIndex++
            verticalThree++
            obj.children.push({
              name: subItem.name,
              id: subItem.secId === undefined ? subItem.assetId + ' nodeSubson_assetId' + flagIndex : subItem.secId + ' nodeSubson_secId' + flagIndex,
              img: subItem.trend,
              relation: subItem.relation
            })
          })
        } else {
          obj.img = val.trend
        }
        flagIndex++
        resultRes.children.push(obj)
      })
    }
    // console.log('第三层的', verticalThree, verticalTwo)
    // console.log('------------', resultList)
    if (verticalThree > verticalTwo) {
      verticalLayer = verticalThree
    } else {
      verticalLayer = verticalTwo
    }
    document.getElementById(dom).height = 50 * verticalLayer + 'px'
    chartHeight = 50 * verticalLayer
    if (type === 'industryStrategy') {
      document.getElementById(dom).height = 60 * verticalLayer + 'px'
      chartHeight = 60 * verticalLayer
    }
    if (resultList.name === '高收益信用债-盈亏比') {
      document.getElementById(dom).height = 70 * verticalLayer + 'px'
      chartHeight = 70 * verticalLayer
    }
    this.drawInit(chartWidth, chartHeight, resultRes, dom)
  }
  drawInit = (chartWidth, chartHeight, resultList, dom)=> {
    const {id, type} = this.props
    const {pageTitle} = this.state
    let graphRes = null
    // console.log('高度高度', chartHeight)
    if (id === 'cta') { // 当前页面是cta时，cta的胜率树最后一层子节点的图片判断由0--》0.5
      graphRes = getTreeChart(chartWidth, chartHeight, resultList, dom, 'cta')
    } else {
      graphRes = getTreeChart(chartWidth, chartHeight, resultList, dom)
    }
    const _self = this
    graphRes.render()
    this.setState({
      spinning: false
    })
    graphRes.on('node:click', e => {
    // 先将所有当前是 click 状态的节点置为非 click 状态
      const nodeItem = e.item // 获取被点击的节点元素对象
      const nodeSec = (nodeItem._cfg.id.split(' ')[1]).split('_')[1].indexOf('secId')
      const nodeAsset = (nodeItem._cfg.id.split(' ')[1]).split('_')[1].indexOf('assetId')
      if (dom === 'relationG2') { // 胜率
        if ((nodeItem._cfg.id.split(' ')[1]).split('_')[0] === 'node') {
          console.log('跳转四大指标页面--胜率')
          // _self.$router.push({
          //   path: '/assetStrategy/assetFourIndex',
          //   query: {
          //     detailType: '胜率',
          //     id: id,
          //     type: type,
          //     parentName: pageTitle
          //   }
          // })
        }
      } else if (dom === 'indicatorChart') { // 盈亏比
        console.log('跳转四大指标页面--盈亏比')
        // if ((nodeItem._cfg.id.split(' ')[1]).split('_')[0] === 'node') {
        //   _self.$router.push({
        //     path: '/assetStrategy/assetFourIndex',
        //     query: {
        //       detailType: '盈亏比',
        //       id: id,
        //       type: type,
        //       parentName: pageTitle
        //     }
        //   })
        // }
      }

      // alice2.0
      if ((nodeAsset !== -1) && ((nodeItem._cfg.id.split(' ')[1]).split('_')[0] !== 'node')) {
        console.log('跳转资产卡')
        // _self.$router.push({
        //   path: '/assetStrategy/assetStrategyDetail',
        //   query: {
        //     id: nodeItem._cfg.id.split(' ')[0],
        //     type: 'smallClassAsset'
        //   }
        // })
      } else if ((nodeSec !== -1) && ((nodeItem._cfg.id.split(' ')[1]).split('_')[0] !== 'node')) {
        console.log('跳转底层指标或者宏观卡')
        // _self.$router.push({
        //   path: '/assetStrategyDetail/indicator',
        //   query: {
        //     id: nodeItem._cfg.id.split(' ')[0]
        //   }
        // })
      }
    })
  }
  render() {
    const {type, id} = this.props
    const {winShow, oddShow, spinning, annotation} = this.state
    return (
      <div className="assetStrategy-diagramChart">
        <Spin tip="Loading..." spinning={spinning}>
          {
            (type !== 'industryStrategy') && winShow
            &&
            <div className="assetStrategy-diagramChart-relationG2">
              <div className="assetStrategy-diagramChart-title">胜率-指标驱动关系</div>
              {
                id === 'cta'
                &&
                <div className="explain">
                  <div><span className="explain-title">管理期货-胜率：</span>商品期货波动率和股指期货波动率等权加权后的方向的置信度</div>
                  <div><span className="explain-title">商品CTA胜率：</span>商品期货加权波动率方向的置信度</div>
                  <div><span className="explain-title">股指CTA胜率：</span>股指期货加权波动率方向的置信度</div>
                </div>
              }
              <div id="relationG2" />
              <div className="annotation">
                {
                  annotation.map(annoItem => {
                    return (
                      <div className={annoItem.className} key={annoItem.title}>{annoItem.title}</div>
                    )
                  })
                }
              </div>
            </div>
          } 
          {
            oddShow
              &&
            <div className="assetStrategy-diagramChart-relation">
              <div className="assetStrategy-diagramChart-title">盈亏比-多维度指标</div>
              {
                id === 'cta'
                  &&
                <div className="explain">
                  <div><span className="explain-title">管理期货-盈亏比：</span>商品CTA盈亏比和股指CTA盈亏比等权加权</div>
                </div>
              }
              <div id="indicatorChart" />
            </div>
          }
        </Spin>
      </div>
    )
  }
}
