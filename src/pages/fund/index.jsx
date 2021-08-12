import React, { PureComponent } from 'react'
// 导航组件
import { Tabs } from 'antd';
// 基础信息组件
import Basic from '@/components/fund/detail/basic'
// 请求基金详情页面的基础信息
import {fundBasic} from '../../../mock/fund'
// 业绩表现组件
import MovementsChart from '@/components/fund/detail/movementsChart'
// 引入风险等标签的颜色,isEmpty判断数据是否为空、业绩表现的日期tab
import { FUND_TYPE,accMul,isEmpty,TABS } from '@/utils/fund.js'
// 历史胜率组件
import Historical from '@/components/fund/detail/historical'
// 资产分布
import AssetProtfolio from '@/components/fund/detail/assetProtfolio'
// 行业配置
import IndustyConfig from '@/components/fund/detail/industyConfig'
// 重仓股票
import HeavyStock from '@/components/fund/detail/heavyStock'
// 引入基金经理组件
import FundManagerCom from '@/components/fund/detail/fundManager'
// 引入规模分析组件
import ScaleAnalysis from '@/components/fund/detail/scaleAnalysis'
// 引入情景分析组件
import SceneAnalysis from '@/components/fund/detail/sceneAnalysis'
// 引入产品报告组件
import ProductReport from '@/components/fund/detail/productReport'
// 货币型基金的七日年化收益
import Annual from '@/components/fund/detail/annual'
// 货币型基金的历史收益
import HistoryEarn from '@/components/fund/detail/historyEarn'
// 引入当前页面的样式
import './index.less'
const { TabPane } = Tabs
// 缺省页
// import Empty from '@/components/empty'
// import PropTypes from 'prop-types'
// import { connect } from 'umi'
// @connect(({ post, loading }) => ({ post, loading }))

class Fund extends PureComponent {
  state = {
    isNav: false, // 是否是货币型基金，false表示是非货币
    detail: {}, // 基金卡详情数据
    tagList: [], // 标签列表
    activeTab: '1', // 当前活跃的基金的表现形式tab中的key
    activeMonth: 1, // 业绩表现中活跃的tab
    movementsHasData: false, // 业绩表现的数据是否是空
    performanceData: [], // 业绩表现数据
    basicLoading: true, // 基础信息是否处于加载中
    fundId: '11', // 基金id
    rawInvestType: '', // 从后端拿到的基金类型的代号
    modelIsShow: true // 行业分布、重仓股票、持仓分析模块是否显示,true表示显示
  }
  componentDidMount() {
    this.initBasic()
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
  initBasic = () => {
    // 数据返回正确
    const { fundManager, industryLablesList, investType, setupDate, assetTotalAmount, managementComp, assetTotalAmountTradeDate } = fundBasic
    // 混合型债基、纯债型债基、被动指数型债基、增强指数型债基都不显示--->行业分布、重仓股票、持仓分析
    const arr = ['A0302', 'A0303', 'A0301', 'A0304']
    const modelIsShow = arr.find(item => { return investType === item })
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
  render() {
    const {detail, basicLoading, isNav, tagList, activeTab, fundId,activeMonth, rawInvestType} = this.state
      return (
        <div className="fundDetail">
          <Basic detail={detail} basicLoading={basicLoading} isNav={isNav} tagList={tagList}/>
          {/* 非货币型基金tab显示 */}
          {
            isNav && 
            <Tabs activeKey={activeTab} onChange={this.onChange}>
              {
                TABS['普通股票型'].map(item => {
                  return (
                    <TabPane key={item.key} tab={item.name} />
                  )
                })
              }
            </Tabs>
          }
          {
            isNav &&
            <div className="middle-content">
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
              activeTab ==='3' && detail.secName &&
              <FundManagerCom fundName={detail.secName} investType={rawInvestType} />
            } {
              activeTab ==='4' &&
              <ScaleAnalysis />
            }
            {
              activeTab ==='5' &&
              <SceneAnalysis />
            }
            {
              activeTab ==='6' &&
              <ProductReport />
            }
          </div>
          }
          {/* 货币型基金tab进行显示 */}
          {
            !isNav &&
            <div className="middle-content">
              <Tabs activeKey={activeTab} onChange={this.onChange}>
                {
                  TABS['货币型基金'].map(item => {
                    return (
                      <TabPane key={item.key} tab={item.name} />
                    )
                  })
                }
              </Tabs>
              {
                activeTab ==='1' &&
                <div className="currency">
                  <Annual field={activeTab} />
                  <HistoryEarn />
                </div>
              }
              {
                activeTab ==='2' && <ProductReport />
              }
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
