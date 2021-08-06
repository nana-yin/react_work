import React, { PureComponent } from 'react'
import LeftBack from '../../components/Detail/Left'
import AssetDetail from '../../components/Detail/AssetDetail'
import MacroDetail from '../../components/Detail/MacroDetail'
import {getAssetStrategy} from '../../../mock/styleCard'
import {getAssetSmall, getMacroSingleList} from '../../../mock/detail'
import RightSide from '../../components/Detail/RightSide'
import './index.less'

class Detail extends PureComponent {
  state = {
    pageTitle: '资产卡',
    stateName: '',
    rightShow: false,
    assetTab: [] // 大类资产卡tab栏的名称数组
  }
  componentDidMount() {
    this.pageInit()
  }
  clickName = (key) => { // 点击小类资产的名称
    this.stateName = key
    this.setState({
      state: key
    }, () => {
      this.getSmallData(key)
    })
  }
  pageInit = () => { // 请求数据的初始化
    const {id, type} = this.props.location.state
    // 大类资产-》largeClassAsset  小类资产-》smallClassAsset  A股风格-》styleStrategy  A股行业-》industryStrategy
    // 宏观指标-》macro   中国宏观分类-》chinaMacro    全球宏观分类-》globalMacro
    if (type === 'smallClassAsset') {
      this.getSmallData(id)
    } else if (type.indexOf('Strategy') !== -1) {
      this.getStrategyAsset(id)
    } else if (type === 'macro') {
      this.macroSingleInit(id)
    }
  }
  getSmallData() { // 获取小类资产数据
      if (Object.keys(getAssetSmall).length > 0) {
        if (this.props.location.state.type === 'smallClassAsset') {
          this.setState({
            pageTitle: getAssetSmall.detail.name,
            rightShow: false
          })
        }
      }
  }
  getStrategyAsset() { // 获取策略卡的数据
    if (Object.keys(getAssetStrategy).length > 0) {
      this.setState({
        pageTitle: getAssetStrategy.detail.name,
        rightShow: true
      })
    }
  }
  macroSingleInit() { // 获取宏观指标卡的数据
    // this.fetchMacroData({
    //   secId: id
    // }).then(() => {
      if (Object.keys(getMacroSingleList).length > 0) {
        if (this.props.location.state.type === 'macro') {
          this.setState({
            pageTitle: getMacroSingleList.name
          })
        }
      }
    // })
  }
  render() {
    const {pageTitle, rightShow} = this.state
    const {id, type} = this.props.location.state
    const history = this.props.history
    return (
      <div className="assetStrategyDetail">
        <div className="assetStrategyDetail-left">
          <LeftBack />
        </div>
        <div className="assetStrategyDetail-center">
          <div className="assetStrategyDetail-center__name">{ pageTitle }详情</div>
            <div className="assetStrategyDetail-center__tabs">
              {
                (type && type.indexOf('macro') !== -1)
                ?
                  <MacroDetail pageTitle={pageTitle} getMacroSingleList={getMacroSingleList} 
                  id={id} type={type}/>
                :
                  <AssetDetail pageTitle={pageTitle} id={id} type={type} history={history}/>
              } 
            </div>
        </div>
        <div className="assetStrategyDetail-right">
          {
            rightShow &&
            <RightSide pageTitle={pageTitle} type={type} />
          }
        </div>
        <div className="clear" />
      </div>
    )
  }
}

export default Detail
