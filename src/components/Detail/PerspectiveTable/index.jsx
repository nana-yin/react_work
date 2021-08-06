import React, { Component } from 'react'
import {Spin} from 'antd'
import trendDown from '../../../../public/images/marketPerspectiveDown.png'
import trendUnchange from '../../../../public/images/marketPerspectiveUnchang.png'
import trendUp from '../../../../public/images/marketPerspectiveUp.png'
import './index.less'

export default class PerspectiveTable extends Component {
  state = {
    trendUp: trendUp,
    trendDown: trendDown,
    trendUnchange: trendUnchange,
    perspectiveList: [],
    spinning: true
  }
  componentDidMount() {
    const {perspectiveData} = this.props
    const perspectiveListRes = JSON.parse(JSON.stringify(perspectiveData.marketPerspective))
    this.setState({
      perspectiveList: perspectiveListRes,
      spinning: false
    })
  }
  goUnderIndicator = (item) => {
    console.log('跳转页面', item.secId)
    // this.$router.push({
    //   path: '/assetStrategyDetail/indicator',
    //   query: {
    //     id: item.secId
    //   }
    // })
  }
  render() {
    const {spinning, perspectiveList, trendUp, trendUnchange, trendDown} = this.state
    return (
      <Spin tip="Loading..." spinning={spinning}>
        <div className="assetStrategy-perspectiveChart">
          {
            perspectiveList.map(item => {
              return (
                <div key={item.name} className="assetStrategy-perspectiveChart__item">
                  <div className="assetStrategy-perspectiveChart__title">{ item.name }</div>
                  {
                    item.subset.length > 0 &&
                    item.subset.map(value => {
                      return (
                        <div key={value.name} className="assetStrategy-perspectiveChart__valueBox">
                          <div className="assetStrategy-perspectiveChart__value" onClick={() => {this.goUnderIndicator(value)}}>
                            <span className="name">{ value.name }</span>
                            <img src={value.trend == 1 ? trendUp : value.trend == 0 ? trendUnchange : value.trend == -1 ? trendDown : 'null'} className="assetStrategy-perspectiveChart__img"></img>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }
        </div>
      </Spin>
    )
  }
}
