import React, { Component } from 'react'
// 引入加载中、栅格、评分组件
import { Spin, Row, Col,Rate } from 'antd';
// 引入风险等标签的颜色
import { FUND_TAG_COLOR} from '../../../../util/fund'
// 引入当前页面的样式
import './index.less'

export default class Basic extends Component {
  state = {
    isNav: false, // 是否是货币型基金，false表示是非货币
    detail: {}, // 基金卡详情数据
    tagList: [], // 标签列表
    basicLoading: true, // 基础信息是否处于加载中
    fundId: '11', // 基金id
    rawInvestType: '', // 从后端拿到的基金类型的代号
    modelIsShow: true // 行业分布、重仓股票、持仓分析模块是否显示,true表示显示
  }
  
  /**
     * 将十六进制的颜色转为rgba
     * @param hex 颜色的十六进制
     * @param opacity 颜色的不透明度
    */
  bgColor = (hex, opacity = 0.1) => {
    if (hex) {
      return (
        'rgba(' +
        parseInt('0x' + hex.slice(1, 3)) +
        ',' +
        parseInt('0x' + hex.slice(3, 5)) +
        ',' +
        parseInt('0x' + hex.slice(5, 7)) +
        ',' +
        opacity +
        ')'
      )
    } else {
      return 'rgba(91,148,246,0.1)'
    }
  }
  render() {
    const {detail, basicLoading, isNav, tagList} = this.props
    return (
      <div className="middle-top">
        <Spin
          spinning={basicLoading}
          tip="Loading..."
        >
          {
            Object.keys(detail).length > 0 &&
            <div>
              {/* 基金名称和评级 */}
              <div className="title">
                <div className="middle-top__left">
                  <span className="name">{ detail.secName }</span>
                  <Rate value={detail.starLevel} disabled />
                </div>
              </div>
              {/* id,type,riskTag */}
              <div className="explainTips">
                <span className="explainTips-id">{ detail.tickerCode }</span>
                <span className="explainTips-type">{ detail.investType+ '--招行的应该是股票类'}</span>
                <span className="explainTips-tag">{ detail.riskLevel }</span>
              </div>
              {
                !isNav &&
                <div className="tagBox">
                  {
                    tagList.map((item,index) => {
                      return (
                        <span key={index} className="tagDefault"
                          style={{color: FUND_TAG_COLOR[item], backgroundColor: this.bgColor(FUND_TAG_COLOR[item])}}>
                          { item }
                        </span>
                      )
                    })
                  }
                </div>
              }
              {/* 基金的基础信息 */}
              <Row gutter={[100,0]} type="flex">
                {
                  // 非货币型
                  !isNav &&
                  <div className="data">
                    <Col>
                      <div className="data__top">
                        <span className={ String(detail.chg).indexOf('+') !== -1 ? 'posVal' : 'negVal'}>{ detail.chg }</span>
                        <span className="navUnit">{ detail.navUnit }</span>
                      </div>
                      <div className="data__bottom">
                        <span className="cn">最新涨跌/单位净值</span>
                        <span className="date">({ detail.tradeDate })</span>
                      </div>
                    </Col>
                    <Col>
                      <div className="data__top">
                        <span className="accVal">{ detail.accumNav }</span>
                      </div>
                      <div className="data__bottom">
                        <span className="cn">累计净值</span>
                      </div>
                    </Col>
                    <Col>
                      <div className="data__top">
                        <span className={String(detail.chgYear).indexOf('+') !== -1 ? 'posVal' : 'negVal'}>{ detail.chgYear }</span>
                      </div>
                      <div className="data__bottom">
                        <span className="cn">近一年涨跌幅</span>
                      </div>
                    </Col>
                    {/* 只有私募基金->浮动收益类显示，代替 近一年涨跌幅 */}
                    <Col>
                      <div className="data__top">
                        <span className={('-1.56%').indexOf('+') >= 0 ? 'posVal' : 'negVal'}>-1.56%</span>
                      </div>
                      <div className="data__bottom">
                        <span className="cn">历史收益率</span>
                      </div>
                    </Col>
                    {/* 只有私募基金，固定收益类显示，代替前面所有的 */}
                    <Col>
                      <div className="data__top">
                        <span className={('+72.56%').indexOf('+') !== -1 ? 'posVal' : 'negVal'}>+72.56%</span>
                      </div>
                      <div className="data__bottom">
                        <span className="cn">业绩比较基准</span>
                      </div>
                    </Col>
                  </div>
                }
                {
                  isNav &&
                  <div className="data">
                    {/* 货币型基金 */}
                    <Col>
                      <div className="data__top">
                      <span className={('+5.23%').indexOf('+') !== -1 ? 'posVal' : 'negVal'}>+5.23%</span>
                      </div>
                      <div className="data__bottom">
                        <span className="cn">七日年化收益率</span>
                      </div>
                    </Col>
                    <Col>
                      <div className="data__top">
                        <span className="accVal">{ detail.navUnit }</span>
                      </div>
                      <div className="data__bottom">
                        <span className="cn">万份收益</span>
                        <span className="date">({ detail.tradeDate })</span>
                      </div>
                    </Col>
                  </div>
                }
              </Row>
              {/* 基金相关数据  非货币型基金-->公募 、私募基金显示 */}
              <div className="relateData">
                <Row gutter={[72,0]} type="flex">
                  {
                    // 公募基金
                    !isNav &&
                    <Col>
                      <div className="relateData-top">
                        <span>成立日期</span>
                        <span className="text">{ detail.setupDate }</span>
                      </div>
                      <div className="relateData-bottom">
                        <span>最新规模</span>
                        <span className="text">{ detail.assetTotalAmount }</span>
                        <span className="newDate">（{ detail.assetTotalAmountDate }）</span>
                      </div>
                    </Col>
                  }
                  {/* 私募基金--》浮动收益类显示，代替上面的成立日期和最新规模*/}
                  <Col>
                    <div className="relateData-top">
                      <span>成立日期</span>
                      <span className="text">{ detail.setupDate }</span>
                    </div>
                    <div className="relateData-bottom">
                      <span>到期日期</span>
                      <span className="text">{ detail.setupDate }</span>
                    </div>
                  </Col>
                  <Col>
                    <div className="relateData-top">
                      {/* 投资经理-->私募基金显示投资经理 */}
                      <span>基金经理</span>
                      <span className="text">
                        { detail.fundManager }
                      </span>
                    </div>
                    <div className="relateData-bottom">
                      <span>管理人&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <span className="text">{ detail.managementComp }</span>
                    </div>
                  </Col>
                  <Col>
                    <div className="relateData-top">
                      <span>产品状态</span>
                      <span className="text status">
                        正常开放
                      </span>
                    </div>
                    <div className="relateData-bottom">
                      <span>状态描述</span>
                      <span className="text">子产品开放；7*24小时开放。</span>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          }
          {/* <Empty empty-text="暂无数据" /> */}
        </Spin>
      </div>
    )
  }
}
