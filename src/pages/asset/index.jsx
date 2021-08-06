import React, { PureComponent } from 'react'
import { Spin,Row,Col } from 'antd';
import PieChart from '../../components/Asset/PieChart'
import LineChart from '../../components/Asset/LineChart'
import CircleChart from '../../components/Asset/CircleChart'
import './index.less'
// import PropTypes from 'prop-types'
// import { connect } from 'umi'
// @connect(({ post, loading }) => ({ post, loading }))

class Asset extends PureComponent {
  state = {
    backList: [], // 资产策略中心的tab数据
    requsetId: [], // 资产中心数据
    requestStyle: { // 行业策略参数
      strategyIdList: []
    },
    requestMacro: { // 宏观指标参数
      idList: []
    },
    spinning: true,
    tabList: [{
      name: '策略库',
      icon: 'https://attractor-1.oss-cn-hangzhou.aliyuncs.com/Aurora/web/Line/Glowworm/Img/image/strategy.png',
      children: [{
        name: '风格策略'
      }, {
        name: '行业策略'
      }]
    }, {
      name: '中国宏观指标',
      icon: 'https://attractor-1.oss-cn-hangzhou.aliyuncs.com/Aurora/web/Line/Glowworm/Img/image/macroChina.png'
    }, {
      name: '全球宏观指标',
      icon: 'https://attractor-1.oss-cn-hangzhou.aliyuncs.com/Aurora/web/Line/Glowworm/Img/image/macroGlobal.png'
    }, {
      name: '资产中心',
      icon: 'https://attractor-1.oss-cn-hangzhou.aliyuncs.com/Aurora/web/Line/Glowworm/Img/image/assetCenter.png',
      children: [{
        name: '权益'
      }, {
        name: '固收'
      }, {
        name: '另类'
      }]
    }], // 左侧tab栏的标题
    chartTabList: [],
    isClick: false,
    typeBox: null,
    rightTitleList: [],
    tabChildrenList: []
  }
  componentDidMount() {
    const {chartTabList} = this.state
    // 请求接口, 用于更新数据
    // this.processCenterInfoList()
    if (chartTabList.length > 0) {
      this.setState({
        spinning: false
      })
    }
    this.fetchEveryCenterData()
  }
  fetchEveryCenterData = async() => {
    // 请求策略中心的列表数据
    await this.fetchCenterInfoList()
    this.setState({
      spinning: false
    })
  }
  fetchCenterInfoList = () => { // 获取整体的tab数据
    return new Promise(resolve => {
      fetch('./json/tab.json', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
      })
      .then(response => response.json())//解析为Promise
      .then(data => {
        this.setState({
          backList: data
        },function() {
          this.processCenterInfoList()
        })
        resolve()
      })
    })
  }
  processCenterInfoList = () => { // 将列表数据进行整理
    const {backList, requestStyle, requestMacro} = this.state
    if (backList.largeClassAsset === undefined) return
    const asseetCenterList = []
    let ids = []
    // console.log(backList.largeClassAsset)
    backList.largeClassAsset.map(item => {
      asseetCenterList.push({
        assetId: item.assetId,
        assetName: item.assetName,
        children: item.smallClassAsset
      })
      ids = ids.concat(item.smallClassAsset)
    })
    ids = ids.concat(backList.styleStrategy)
    this.setState({
      requsetId: ids
    }, function() {
      this.getReqId(backList.industryStrategy, requestStyle.strategyIdList, 'strategyId')
      this.getReqId(backList.chinaMacro, requestMacro.idList, 'secId')
      this.getReqId(backList.globalMacro, requestMacro.idList, 'secId')
      // 将列表的标题等数据进行处理
      const chartTabListRes = [{
        type: '策略库',
        children: [{
          type: '风格策略',
          realType: 'styleStrategy',
          children: backList.styleStrategy
        }, {
          type: '行业策略',
          realType: 'industryStrategy',
          children: backList.industryStrategy
        }]
      }, {
        type: '中国宏观指标',
        realType: 'macro',
        children: backList.chinaMacro
      }, {
        type: '全球宏观指标',
        realType: 'macro',
        children: backList.globalMacro
      }, {
        type: '资产中心',
        realType: 'smallClassAsset',
        children: asseetCenterList
      }]
      this.setState({
        chartTabList: chartTabListRes
      }, function() {
        this.setupTab()
      })
    })
  }
  getReqId = (val, arr, id) => { // id参数的获取
    val.map(subItem => {
      arr.push(subItem[id])
    })
    this.setState({
      [arr]:arr
    })
  }
  setupTab = () => { // 定位左侧tab
    // 数据刷新后, dom 有可能改变, 需要重新定位元素
    const typeBoxRes = document.getElementById('typeBox')
    const rightTitleListRes = document.getElementsByClassName('rightTitle')
    const tabChildrenListRes = document.getElementsByClassName('tabChildren')
    this.setState({
      typeBox: typeBoxRes,
      rightTitleList: rightTitleListRes,
      tabChildrenList: tabChildrenListRes
    })
    // 监听滚动事件
    if (rightTitleListRes.length > 0) {
      typeBoxRes.addEventListener('scroll', this.onScroll)
    }

    //  重定位到上次浏览的位置
    const oldName = sessionStorage.getItem('assetTabName')
    sessionStorage.removeItem('assetTabName')
    if (oldName) {
      this.clickTab(oldName, false)
    }
  }
  clickTab = (name, state) => { // 点击左侧导航，添加样式，并且滑动条滑到相应的模块
    this.setState({
      isClick: state // 点击了
    })
    // console.log('点击左侧tab', name, state)
    this.tabActiveStyle(name)
    const {rightTitleList, typeBox} = this.state
    // //获取显示器的高度
    for (let j = 0; j < rightTitleList.length; j++) {
      const item = rightTitleList[j]
      if (item.innerText === name) {
        typeBox.scrollTo(0, item.offsetTop)
        break
      }
    }
  }
  onScroll = (event) => { // 滚动的时候，左侧导航跟着变化
    const {typeBox, rightTitleList,isClick} = this.state
    let name = ''
    // 当 typeBox 滚动到底部时, 高亮显示最后一个标题
    const scrollTop = parseInt(typeBox.scrollTop) + 1
    if (scrollTop + typeBox.clientHeight >= typeBox.scrollHeight) {
      name = rightTitleList[rightTitleList.length - 1].innerText
    } else if (scrollTop <= 100) {
      name = rightTitleList[0].innerText
    } else {
      for (let k = 0; k < rightTitleList.length - 1; k++) {
        const item = rightTitleList[k]
        const itemNext = rightTitleList[ k + 1]
        // console.log(item.offsetTop, typeBox.scrollTop, itemNext.offsetTop)
        // item 滚动到 typeBox 顶部时, 左侧栏高亮显示该 item 标题
        if (item.offsetTop <= scrollTop && scrollTop < itemNext.offsetTop) {
          name = item.innerText
        }
      }
    }
    if (!isClick) { // 如果点击了左侧的导航（就不必二次渲染导航样式了）
      this.tabActiveStyle(name)
    }
    this.setState({
      isClick: false
    })
  }
  tabActiveStyle = (name) => { // 左侧导航栏高亮显示当前栏目
    const oldName = sessionStorage.getItem('assetTabName')
    if (name === oldName) { return } // 如果已高亮, 则不需要再改样式
    sessionStorage.setItem('assetTabName', name) // 记录当前浏览的位置
    const {tabChildrenList} = this.state
    for (let i = 0; i < tabChildrenList.length; i++) {
      const item = tabChildrenList[i]
      if (item.innerText === name) {
        item.classList.add('tabActive')
      } else {
        item.classList.remove('tabActive')
      }
    }
  }
  assetStrategyDetail = (value, type) => { // 点击进入详情
    this.props.history.push({
      pathname: '/detail',
      state: {
        id: value.assetId === undefined ? value.strategyId === undefined ? value.secId === undefined ? null : value.secId : value.strategyId : value.assetId,
        type: type.realType ? type.realType : type.children[0].realType
      }
    })
  }
  render() {
    const {tabList, spinning, chartTabList} = this.state
    return (
      <div className="assetStrategy">
        <div className="assetStrategy-box">
          <div className="assetStrategy-box__tab">
              {
                tabList.map(item => {
                  let result = null
                  if (!item.children) {
                    result = (
                      <div key={item.name}>
                        <div className="tabChildren" onClick={()=> this.clickTab(item.name,true)}>
                          <img src = {item.icon} />{ item.name }
                        </div>
                      </div>
                    )
                  } else {
                    result = (
                      <div key={item.name}>
                        <div className="tabChildrenBox">
                          <div className="tabhasChild">
                            <img src={item.icon} />
                            { item.name }
                          </div>
                          {
                            item.children.map(subItem => {
                              return (
                                <div key={subItem.name}>
                                  <div className="tabChildren tabSub" 
                                    onClick={()=> this.clickTab(subItem.name,true)}>
                                    { subItem.name }
                                  </div>
                                </div>
                              )
                            }) 
                          }
                        </div>
                      </div>
                    )
                  }
                  return result
                })
              }
          </div>
          <Spin spinning={spinning}>
            <div className="assetStrategy-box__content">
              <div id="typeBox" className="typeBox" onScrollCapture={() => this.onScroll()}>
                <div className="rightContent">
                  {
                    chartTabList.map((item, index) => {
                      let res = null
                      if (item.children[0].children) {
                        res = (
                          <div key={item.type} className="rightChart">
                            <div className="contentTitle" style={index === 0 ? {marginTop: '30px'} : {marginTop: 0 }}>{ item.type }</div>
                                {
                                  item.children.map((subItem, subIndex) => {
                                    return (
                                      <div key={subIndex} className="rightBox">
                                        {
                                          subItem.children ? 
                                          <div className="rightBox-content">
                                            <div className="rightTitle">{ subItem.assetName === undefined ? subItem.type : subItem.assetName }</div>
                                            <Row gutter="[20,20]" className="rightBox-imgBox">
                                              {
                                                subItem.children.map(subItemSub => {
                                                  return (
                                                    <Col key={subItemSub.assetName === undefined ? subItemSub.strategyName : subItemSub.assetName} span="8">
                                                      <div className="classifyBox">
                                                        {
                                                          subItem.type !== '行业策略' ? 
                                                            <div className="classifyBox-img" onClick={()=> this.assetStrategyDetail(subItemSub, item)}>
                                                              <PieChart chartInfo={subItemSub} />
                                                            </div>
                                                          :
                                                            <div className="classifyBox-img" onClick={() => this.assetStrategyDetail(subItemSub, subItem)}>
                                                              <LineChart chartInfo={subItemSub} />
                                                            </div>
                                                        }
                                                        <div className="classifyBox-text">
                                                          <span onClick={() => this.assetStrategyDetail(subItemSub, subItem.type !== '行业策略' ? item : subItem)}>{ subItemSub.assetName === undefined ? subItemSub.strategyName : subItemSub.assetName }</span>
                                                        </div> 
                                                    </div>
                                                  </Col>
                                                  )
                                                })
                                              }
                                            </Row>
                                          </div>
                                          : <div></div>
                                        }
                                      </div>
                                    )
                                  })
                                }
                          </div>
                        )
                      } else {
                        res = (
                          <div key={item.type} className="rightChart">
                            <div className="rightTitle macroTitle">{ item.type }</div>
                            <Row gutter="[20,20]" className="rightBox-imgBox">
                              {
                                item.children.map(subItem => {
                                  return (
                                    <Col key={subItem.secName} span="8">
                                      <div className="classifyBox">
                                        <div className="classifyBox-img macroImg" onClick={() => this.assetStrategyDetail(subItem, item)}>
                                          <CircleChart chartInfo={subItem} />
                                        </div>
                                        <div className="classifyBox-text">
                                          <span onClick={() => this.assetStrategyDetail(subItem, item)}>{ subItem.secName }</span>
                                        </div>
                                      </div>
                                    </Col>
                                  )
                                })
                              }
                            </Row>
                          </div>
                        )
                      }
                      return res
                    })
                  }
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    )
  }
}

// Asset.propTypes = {
//   post: PropTypes.object,
//   loading: PropTypes.object,
//   location: PropTypes.object,
//   dispatch: PropTypes.func,
// }

export default Asset
