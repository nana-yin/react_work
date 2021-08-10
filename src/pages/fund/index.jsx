import React, { PureComponent } from 'react'
// 引入加载中、栅格、导航、评分组件
import { Spin, Row, Col,Tabs,Rate } from 'antd';
// 请求基金详情页面的基础信息
import {fundBasic} from '../../../mock/fund'
// 业绩表现组件
import MovementsChart from '@/components/fund/detail/movementsChart'
// 业绩表现的日期tab,引入风险等标签的颜色,accMul给数据乘以100
import { MOVEMENTS_TIME_CARD, FUND_TAG_COLOR,FUND_TYPE,isEmpty, accMul,TABS } from '@/utils/fund.js'
// 历史胜率组件
import Historical from '@/components/fund/detail/historical'
// 资产分布
import AssetProtfolio from '@/components/fund/detail/assetProtfolio'
// 行业配置
import IndustyConfig from '@/components/fund/detail/industyConfig'
// 重仓股票
import HeavyStock from '@/components/fund/detail/heavyStock'
// 缺省页
// import Empty from '@/components/empty'
// 引入投资风格组件
// import InvestmentStyle from '@/components/fund/detail/investmentStyle'
// // 引入基金经理组件
// import FundManager from '@/components/fund/detail/fundManager'
// // 引入规模分析组件
// import ScaleAnalysis from '@/components/fund/detail/scaleAnalysis'
// // 货币型基金的历史收益
// import HistoryEarn from '@/components/fund/detail/historyEarn'
// // 货币型基金的七日年化收益
// import Annual from '@/components/fund/detail/annual'
// 引入当前页面的样式
import './index.less'
const { TabPane } = Tabs
// import PropTypes from 'prop-types'
// import { connect } from 'umi'
// @connect(({ post, loading }) => ({ post, loading }))

class Fund extends PureComponent {
  state = {
    isNav: false, // 是否是货币型基金，false表示是非货币
    isShowCoe: true, // 抱团系数是否显示，普通股票型、偏股混合型、股债配置型页面显示
    detail: {}, // 基金卡详情数据
    tagList: [], // 标签列表
    tabs: TABS['普通股票型'],
    activeTab: '2', // 当前活跃的基金的表现形式tab中的key
    activeScore: 0, // 当前活跃的业绩评分的日期
    movementsTime: MOVEMENTS_TIME_CARD, // 业绩表现中的时间选择tab
    activeMonth: 1, // 业绩表现中活跃的tab
    activeMonthCurrency: 1, // 七日年化收益的活跃数据
    visible: false, // 加入组合按钮的弹窗
    joinItem: {}, // 添加到组合的数据
    movementsHasData: false, // 业绩表现的数据是否是空
    performanceData: [], // 业绩表现数据
    isConcern: false, // 页面点击关注按钮的状态
    basicLoading: true, // 基础信息是否处于加载中
    fundId: '11',
    // fundId: this.$route.params.id, // 基金id
    rawInvestType: '', // 从后端拿到的基金类型的代号
    modelIsShow: true // 行业分布、重仓股票、持仓分析模块是否显示,true表示显示
  }
  componentDidMount() {
    this.init()
  }
  /**
   * 对业绩表现等tab进行切换
  */
  onChange = activeTab => {
    this.setState({ activeTab })
  }
  /**
   * 对基金的规模进行亿元的计算
  */
  filterFundScale = (value) => {
    return (Number(value) / 100000000).toFixed(2)
  }
  /**
   * 数据是否为后端给的初始值
   * @param data 判定的值
   * return false表示不是
  */
  isOriginal = (data) => {
    let hasData = true
    if (!isEmpty(data)) {
      hasData = data !== -999
    } else {
      hasData = false
    }
    return hasData
  }
  /**
   * 基金卡-基金信息详情
  */
  init = () => {
    // 数据返回正确
    const { fundManager, industryLablesList, investType, setupDate, assetTotalAmount, managementComp, assetTotalAmountTradeDate } = fundBasic
    // 混合型债基、纯债型债基、被动指数型债基、增强指数型债基都不显示--->行业分布、重仓股票、持仓分析
    const arr = ['A0302', 'A0303', 'A0301', 'A0304']
    const modelIsShow = arr.find(item => { return investType === item })
    // 普通股票型、偏股混合型、股债配置型显示--->抱团系数
    const arrCoe = ['A0101', 'A0201', 'A0202']
    const isShowCoe = arrCoe.find(item => { return investType === item })
    const detail = JSON.parse(JSON.stringify(fundBasic))
    // 基金类型
    let investTypeOpera = ''
    for (let i = 0; i < Object.entries(FUND_TYPE).length; i++) {
      const item = Object.entries(FUND_TYPE)[i]
      if (item[1][investType]) {
        investTypeOpera = `${item[0]}-${item[1][investType]}`
        break
      }
    }
    detail.investType = investTypeOpera || '--'
    this.setState({
      rawInvestType: investType,
      modelIsShow,
      isShowCoe,
      detail,
      tagList: []
    },() => {
      // 招行中加了一个 行内资产子类的标签，此标签用蓝色，例如：对冲型FOF
      industryLablesList.push({industryLable: '对冲型FOF'}) // 假数据
      this.tagInit(industryLablesList)
      if (fundBasic.fundNavS && (fundBasic.fundNavS.length > 0)) { // 非货币型基金
        const { chg, navUnit, tradeDate, accumNav } = fundBasic.fundNavS[0]
        // 日涨跌,保留两位小数
        const chgOpera = this.isOriginal(chg) ? accMul(chg).toFixed(2) : '--'
        detail.chg = chgOpera !== '--' ? chgOpera > 0 ? `+${chgOpera}%` : `${chgOpera}%` : '--'
        // 单位净值,保留四位小数
        detail.navUnit = this.isOriginal(navUnit) ? navUnit.toFixed(4) : '--'
        // 净值日期
        detail.tradeDate = tradeDate || '--'
        // 累计净值,保留四位小数
        detail.accumNav = this.isOriginal(accumNav) ? accumNav.toFixed(4) : '--'
        // 近一年涨跌幅
        const chgOperaYear = fundBasic.chgType === 1 ? this.isOriginal(fundBasic.chg) ? fundBasic.chg.toFixed(2) : '--' : '--'
        detail.chgYear = chgOperaYear !== '--' ? chgOperaYear > 0 ? `+${chgOperaYear}%` : `${chgOperaYear}%` : '--'
        // 成立日期
        detail.setupDate = setupDate || '--'
        // 基金经理
        detail.fundManager = (fundManager && (fundManager.length > 0)) ? fundManager.join('、') : '--'
        // 最新规模
        const newTotalAmount = this.isOriginal(assetTotalAmount) ? assetTotalAmount : '--'
        detail.assetTotalAmount = newTotalAmount !== '--' ? this.filterFundScale(assetTotalAmount) + '亿元' : '--'
        // 最新规模对应的日期
        detail.assetTotalAmountDate = assetTotalAmountTradeDate || '--'
        // 基金公司
        detail.managementComp = managementComp || '--'
        this.setState({
          isNav: false
        })
      } else { // 货币型
        const { yearlyRot, dailyProfit, endDate } = fundBasic.fundDivmS[0]
        // 七日年化收益
        detail.yearlyRot = this.isOriginal(yearlyRot) ? `${parseFloat(yearlyRot).toFixed(2)}%` : '--'
        // 万份收益
        detail.dailyProfit = this.isOriginal(dailyProfit) ? dailyProfit.toFixed(4) : '--'
        // 日期
        detail.endDate = endDate || '--'
        this.setState({
          isNav: true
        })
      }
      this.setState({
        detail,
        basicLoading: false
      })
    })
  }
  /**
   * 行业标签名称提取
   * @param data 行业标签的数组
  */
  tagInit = (data) => {
    const {tagList}= this.state
    if (data && (data.length > 0)) {
      data.map(item => {
        const label = item.industryLable
        if (label) {
          tagList.push(label)
        }
      })
    }
    this.setState({
      tagList
    })
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
    const {detail, basicLoading, isNav, tagList, tabs, activeTab, movementsTime, fundId,activeMonth, rawInvestType} = this.state
      return (
        <div className="fundDetail">
          <div className="middle-top">
            <Spin
              spinning={basicLoading}
              tip="Loading..."
            >
              {
                Object.keys(detail).length > 0 &&
                <div>
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
                  {/* 标签  非货币型基金显示 */}
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
                  {/* 基金基础数据 */}
                  <Row gutter={[106,0]} type="flex">
                    {/* 非货币型基金显示 */}
                    {
                      !isNav &&
                      <div className="data">
                        <Col>
                          <div className="data__top">
                          {/* detail.chg.indexOf('+') !== -1 */}
                            <span className={detail.chg ? 'posVal' : 'negVal'}>{ detail.chg }</span>
                            <span className="navUnit">{ detail.navUnit }</span>
                          </div>
                          <div className="data__bottom">
                            <span className="cn">日涨跌/单位净值</span>
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
                            {/* detail.chgYear.indexOf('+') !== -1 */}
                            <span className={detail.chgYear ? 'posVal' : 'negVal'}>{ detail.chgYear }</span>
                          </div>
                          <div className="data__bottom">
                            <span className="cn">近一年涨跌幅</span>
                          </div>
                        </Col>
                      </div>
                    }
                    {/* 货币型基金显示 */}
                    {
                      isNav &&
                      <div className="currency-data">
                        <Col>
                          <div className="data__top">
                            <span className="accVal">{ detail.yearlyRot }</span>
                          </div>
                          <div className="data__bottom">
                            <span className="cn">七日年化收益率</span>
                          </div>
                        </Col>
                        <Col>
                          <div className="data__top">
                            <span className="accVal">{ detail.dailyProfit }</span>
                          </div>
                          <div className="data__bottom">
                            <span className="cn">万份收益({ detail.endDate })</span>
                          </div>
                        </Col>
                      </div>
                    }
                  </Row>
                  {/* 基金相关数据  非货币型基金显示 */}
                  {
                    !isNav &&
                    <div className="relateData">
                      <Row gutter={[72,0]} type="flex">
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
                        <Col>
                          <div className="relateData-top">
                            <span>基金经理</span>
                            <span className="text">
                              { detail.fundManager }
                            </span>
                          </div>
                          <div className="relateData-bottom">
                            <span>基金公司</span>
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
                  }
                </div>
              }
              {/* <Empty empty-text="暂无数据" /> */}
            </Spin>
          </div>
          {/* 业绩表现、持仓分析、基金经理、规模分析  非货币基金进行显示 */}
          {
            !isNav && 
            <div className="middle-content">
              <Tabs activeKey={activeTab} onChange={this.onChange}>
                {
                  tabs.map(item => {
                    return (
                      <TabPane key={item.key} tab={item.name} />
                    )
                  })
                }
              </Tabs>
              {
                activeTab==='1' &&
                <div>
                  {
                    detail.secName && 
                    <MovementsChart fundId={fundId} field={activeMonth} fundName={detail.secName} investType={rawInvestType} />
                  }
                  <div className="historical">
                    <div className="title">
                      历史胜率
                      <span className="date">（成立以来）</span>
                    </div>
                    <Historical fundId={fundId} investType={rawInvestType} />
                  </div>
                </div>
              }
              {
                activeTab ==='2' &&
                <div className="position">
                  <AssetProtfolio fundId={fundId} />
                  <IndustyConfig fundId={fundId} />
                  <HeavyStock fundId={fundId} />
                </div>
              }
              {
                activeTab ==='3' &&
                <div className="fundManage">
                  基金经理
                  {/* <FundManager v-if="detail.secName" :fund-name="detail.secName" :invest-type="rawInvestType" /> */}
                </div>
              } {
                activeTab ==='4' &&
                <div className="scaleAnalysis">
                  规模分析
                  {/* <ScaleAnalysis /> */}
                </div>
              }
            </div>
          }
          {/* 七日年化收益、历史收益  货币型基金进行显示 */}
          {
            isNav &&
            <div className="currency">
              <div className="score">
                <div className="score-top">
                  <span className="title">七日年化收益</span>
                  <Tabs v-model="activeMonthCurrency" type="card">
                    {
                      movementsTime.map(item => {
                        return (
                          <TabPane key={item.key} tab={item.tab}/>
                        )
                      })
                    }
                  </Tabs>
                </div>
                <div className="performance-content">
                  七日年化
                  {/* <Annual :field="activeMonthCurrency" /> */}
                </div>
              </div>
              <div className="score historical">
                <div className="score-top">
                  <span className="title">历史收益</span>
                </div>
                <div className="historical-content">
                  历史收益
                  {/* <HistoryEarn /> */}
                </div>
              </div>
            </div>
          }
        </div>
      )
  }
}

// Fund.propTypes = {
//   post: PropTypes.object,
//   loading: PropTypes.object,
//   location: PropTypes.object,
//   dispatch: PropTypes.func,
// }

export default Fund
