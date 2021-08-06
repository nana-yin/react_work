import React, { Component } from 'react'
import { initGraph,mockDataWin,mockDataOdd } from './chart.config'
import WinChart from './components/winChart'
import './index.less'

export default class TreeIndex extends Component {
  state = {
    macroList: [{
      name: '宏观经济',
      subset: [{
        key: 0,
        name: '总需求',
        value: '100%',
        trend: 1
      },{
        key: 1,
        name: '物价',
        value: '100%',
        trend: -1
      }]
    }, {
      name: '宏观金融',
      subset: [{
        key: 2,
        name: '总需求',
        value: '15%',
        trend: -1
      },{
        key: 3,
        name: '物价',
        value: '56%',
        trend: -1
      }]
    },{
      name: '宏观市场',
      subset: [{
        key: 4,
        name: '总需求',
        value: '5%',
        trend: 1
      },{
        key: 5,
        name: '物价',
        value: '0%',
        trend: -1
      }]
    }]
  }
  componentDidMount() {
    this.drawChart('treeDomOdd')
  }
  drawChart = (dom) => {
    const container = document.getElementById(dom)
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const props = {
      data: dom === 'treeDom' ? mockDataWin : mockDataOdd, // 默认数据
      config: {
        padding: [8, 16],
        // defaultLevel: 5, // 默认显示的层数
        defaultZoom: 1, // 默认的缩放的大小
        modes: { default: ['zoom-canvas', 'drag-canvas'] },
      },
    }
    const graph = initGraph(props,width,height,dom);
    if (typeof window !== 'undefined')
    window.onresize = () => {
      if (!graph || graph.get('destroyed')) return;
      if (!container || !container.scrollWidth || !container.scrollHeight) return;
      graph.changeSize(container.scrollWidth, container.scrollHeight);
    };
  }
  render() {
    const {macroList} = this.state
    return (
      <div className="treeBox">
        {/* 宏观环境关联指标 */}
        {/* <div className="macroIndex">
          <div className="title">宏观环境关联指标</div>
          <div className="content">
            <div className="list">
              {
                macroList.map(item => {
                  return (
                    <div className="listBox" key={item.name}>
                      <div className="listTitle">{item.name}</div>
                      <div className="singleBox">
                        {item.subset.map(subItem => {
                          return (
                            <div className="single" key={subItem.key}>
                              <div className="single_title">{subItem.name}</div>
                              <div className="valBox">
                                <span className="value">{subItem.value}</span>
                                <span className={subItem.trend > 0 ? 'upImg' : 'downImg'}></span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <div className="chart">
              <WinChart type='macroIndex'/>
            </div>
          </div>
        </div> */}
        {/* 关键指标 */}
        <div className="box">
          <WinChart type='relateIndex'/>
          <div className="loss">
            <div className="title">A股盈亏比-多维度指标</div>
            <div id="treeDomOdd"></div>
          </div>
        </div>
      </div>
    )
  }
}
