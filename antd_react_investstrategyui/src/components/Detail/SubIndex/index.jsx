import React, { Component } from 'react'
import {Spin} from 'antd'
import { getTreeChart } from './chart.config'
import './index.less'

export default class SubIndex extends Component {
  state = {
    subBackIndex: {},
    subIndexData: {},
    graph: null,
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
    const {getMacroSingleList} = this.props
    this.setState({
      subBackIndex: getMacroSingleList
    },() => {
      this.subInit()
    })
  }
  subInit = () => {
    const {subBackIndex} = this.state
    const chartWidth = document.getElementById('subIndexChart').scrollWidth
    let chartHeight = document.getElementById('subIndexChart').scrollHeightlet
    let verticalLayer = 1 // 竖向的元素个数
    let secIndexCount = 0 // 第三层竖向元素的个数
    const subIndexRes = {
      id: subBackIndex.secId + '-node_secId',
      name: subBackIndex.name,
      children: []
    }
    let countIndex = 0
    if (subBackIndex.relatedIndex.length > 0) {
      subBackIndex.relatedIndex.map(item => {
        const obj = {
          id: item.secId + '-nodeSub_secId' + (countIndex++),
          name: item.name,
          img: item.trend,
          children: [],
          relation: item.relation
        }
        if ((item.subset) && (item.subset.length > 0)) {
          item.subset.map(subItem_sub => {
            const subObj = {
              id: subItem_sub.secId + '-nodeSubItem_secId' + (countIndex++),
              name: subItem_sub.name,
              img: subItem_sub.trend,
              relation: subItem_sub.relation
            }
            obj.children.push(subObj)
            secIndexCount++
          })
        }
        subIndexRes.children.push(obj)
      })
    }

    if (subBackIndex.relatedIndex.length > secIndexCount) {
      verticalLayer = subBackIndex.relatedIndex.length
    } else {
      verticalLayer = secIndexCount
    }
    if (verticalLayer === 1) {
      document.getElementById('subIndexChart').height = 50 * verticalLayer + 'px'
      chartHeight = 50 * verticalLayer
    } else {
      document.getElementById('subIndexChart').height = 60 * verticalLayer + 'px'
      chartHeight = 60 * verticalLayer
    }
    const graph = getTreeChart(chartWidth, chartHeight, subIndexRes)
    graph.render()
    graph.on('node:click', e => {
      const nodeItem = e.item // 获取被点击的节点元素对象
      graph.setItemState(nodeItem, 'click', true) // 设置当前节点的 click 状态为 true
      const nodeSec = (nodeItem._cfg.id.split('-')[1]).split('_')[1].indexOf('secId')
      const nodeAsset = (nodeItem._cfg.id.split('-')[1]).split('_')[1].indexOf('assetId')
      if (nodeAsset !== -1) {
        console.log('进入资产卡')
        // _self.$router.push({
        //   path: '/assetStrategy/assetStrategyDetail',
        //   query: {
        //     id: nodeItem._cfg.id.split('-')[0],
        //     type: 'smallClassAsset'
        //   }
        // })
      } else if (nodeSec !== -1) {
        console.log('进宏观卡或者底层指标卡')
        // _self.$router.push({
        //   path: '/assetStrategyDetail/indicator',
        //   query: {
        //     id: nodeItem._cfg.id.split('-')[0]
        //   }
        // })
      }
    })
    
    this.setState({
      subIndexData: subIndexRes,
      graph,
      spinning: false
    })
  }
  render() {
    const {spinning, annotation} = this.state
    return (
      <div className="macroDetail-subIndex__box">
        <div className="macroDetail-subIndex__title">关联指标</div>
        <Spin tip="Loading..." spinning={spinning}>
          <div id="subIndexChart" />
          <div className="annotation">
            {
              annotation.map(annoItem => {
                return (
                  <div className={annoItem.className} key={annoItem.title}>{annoItem.title}</div>
                )
              })
            }
          </div>
        </Spin>
      </div>
    )
  }
}
