import React, { Component } from 'react'
import {Spin} from 'antd'
import EchartDetail from '../EchartDetail'
import SubIndex from '../SubIndex'
import {getIndicateCardChart, getIndicateCard} from '../../../../mock/macroDetail'
import './index.less'
export default class MacroDetail extends Component {
  state = {
    state: '',
    macroTab: [],
    idList: ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8', 'id9', 'id10', 'id11'],
    echartDataList: [],
    result: {},
    spinning: true,
    subItemState: true
  }
  componentDidMount() {
    this.indicateInit()
  }
  indicateInit = () => { // 指标详情页面
    const {id, getMacroSingleList, pageTitle} = this.props
    // this.fetchIndicateChart({
    //   id: id
    // }).then(() => {
      if (getIndicateCardChart.member) {
        const chartRes = JSON.parse(JSON.stringify(getIndicateCardChart.member))
        const idList = []
        let ids = []
        chartRes.map((item, index) => {
          idList.push(item.id)
          item.member.map(merb => {
            if (merb.secId.includes('att')) {
              ids.push(merb.secId)
            }
          })
        })
        ids = Array.from(new Set(ids))

    //     this.fetchIndicateData({
    //       idList: ids
    //     }).then(() => {
          const dataList = JSON.parse(JSON.stringify(getIndicateCard))
          const dataArr = []
          chartRes[0].member.map((item, index) => {
            dataList.map(itemData => {
              if (item.secId === itemData.id) {
                dataArr.push(itemData.member[0])
              }
            })
          })
          const echartDataListRes = chartRes
          echartDataListRes[0].data = {
            id: chartRes[0].id,
            member: dataArr
          }
          this.setState({
            result: chartRes,
            echartDataList: echartDataListRes,
            spinning: false
          })
          // if (pageTitle === '') {
          //   this.$emit('changePageTitle', { title: this.echartDataListRes[0].name })
          // }
      //   })
      }
    // })
  }
  render() {
    const {spinning, echartDataList, idList, subItemState} = this.state
    const {getMacroSingleList,type} = this.props
    return (
      <Spin style={{minHeight:'500px',width:'100%'}} tip="Loading..." spinning={spinning}>
        {
          echartDataList.map((subItem, index) => {
            return (
              <div key={subItem.id} className="macroDetail-content">
                <EchartDetail getMacroSingleList={getMacroSingleList} 
                id={idList[index]} options={subItem} type={type}/>
                <div className="macroDetail-subIndex">
                  {
                    subItemState &&
                    <SubIndex getMacroSingleList={getMacroSingleList}/>
                  }
                </div>
              </div>
            )
          })
        }
      </Spin>
    )
  }
}
