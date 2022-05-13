import React, { Component } from 'react'
import { initGraph,mockDataWin,mockDataOdd } from '../chart.config'
import './index.less'

export default class WinChart extends Component {
  state = {
    ctaTips: [{
      title: '管理期货-胜率：',
      content: '商品期货波动率和股指期货波动率等权加权后的方向的置信度；'
    }, {
      title: '商品CTA胜率：',
      content: '商品期货加权波动率方向的置信度；'
    }, {
      title: '股指CTA胜率：',
      content: '股指期货加权波动率方向的置信度。'
    }],
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
    const {type} = this.props
    const chartDom = type === 'relateIndex' ? 'treeDomWin' : 'treeDom'
    this.drawChart(chartDom)
  }
  drawChart = (dom) => {
    const {type} = this.props
    const container = document.getElementById(dom)
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const props = {
      data: (dom === 'treeDom') || (dom === 'treeDomWin') ? mockDataWin : mockDataOdd, // 默认数据
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
    const {ctaTips,annotation} = this.state
    const {type} = this.props
    return (
      <div className={type === 'relateIndex' ? 'win' : 'macroTree'}>
        {
          type === 'relateIndex' && 
          <div className="title">A股胜率-驱动指标</div>
        }
        <div className="winIndex">
          {
            ctaTips.map(item => {
              return (
                <div key={item.title} className="ctaTips">
                  <span className="tipsTitle">{item.title}</span>
                  <span>{item.content}</span>
                </div>
              )
            })
          }
        </div>
        <div id={type === 'macroIndex' ? 'treeDom' : 'treeDomWin'}></div>
        <div className="annotation">
          {
            annotation.map(annoItem => {
              return (
                <div key={annoItem.title} className={annoItem.className} key={annoItem.title}>{annoItem.title}</div>
              )
            })
          }
        </div>
        <div className="tips">注：通过鼠标滚轮可放大缩小树状图，按住鼠标左键可拖动树状图位置。</div>
      </div>
    )
  }
}
