import React, { Component } from 'react'
// 引入表格、分页组件
import { Table,Pagination,ConfigProvider} from 'antd';
// 引入中文显示
import zh_CN from 'antd/lib/locale-provider/zh_CN';
// 引入表格的表头
import {columns} from './table.config'
// 引入历史收益数据
import {historyEarn} from '../../../../mock/fund'
// 引入当前页面的样式
import './index.less'

export default class HistoryEarn extends Component {
  state = {
    loading: true, // 表格是否处于加载中
    listData: [], // 表格的数据初始化
    columns, // 表格的列数据初始化
    pageSize: 10, // 表格的每一页数据
    currentPage: 1, // 当前的页码
    total: 0, // 总的数据长度
    params: {} // 请求的参数
  }
  componentDidMount() {
    const {pageSize,currentPage} = this.state
    const params = {
      FundId: '111',
      pageSize,
      pageIndex: currentPage
    }
    this.setState({
      params,
      pageSize,
      currentPage
    }, () => {
      this.featchInit(params)
    })
  }
  /**
     * 数据是否为后端给的初始值 aliceV6.0版本
     * @param data 判定的值
     * return false表示不是
    */
  isOriginal = (data) => {
    return (data && (data !== -999))
  }
  /**
   * 请求历史收益
   * @param params 给后端传的参数
  */
  featchInit = () => {
    const { count, hisList } = historyEarn
    let listData = []
    if (hisList && (hisList.length > 0)) {
      hisList.map((item, index) => {
        // 七日年化
        const yearlyRot = this.isOriginal(item.yearlyRot) ? `${parseFloat(item.yearlyRot).toFixed(2)}%` : '--'
        // 万份收益
        const dailyProfit = this.isOriginal(item.dailyProfit) ? item.dailyProfit.toFixed(4) + '元' : '--'
        // 日期
        const tradeDate = item.tradeDate || '--'
        const obj = {
          key: `${index}`,
          date: tradeDate,
          netVal: yearlyRot,
          totalVal: dailyProfit
        }
        listData.push(obj)
      })
    }
    this.setState({
      listData,
      loading: false,
      total: count
    })
  }
  /**
   * 切换页码
   * @param pageNumber 改变后的页码
  */
  onChange = (pageNumber) => {
    const {params} = this.state
    const pageIndex = params.pageIndex
    this.setState({
      [pageIndex]: pageNumber,
      loading: true,
      currentPage: pageNumber
    }, () => {
      this.featchInit()
    })
  }
  /**
   * 切换页数
   * @param pageSize 改变后的页数
  */
  handleShowSizeChange = (_, pageSize) => {
    const {params} = this.state
    const pageIndex = params.pageSize
    this.setState({
      [pageIndex]: pageSize,
      loading: true
    }, () => {
      this.featchInit()
    })
  }
  render() {
    const {listData,loading,currentPage,total} = this.state
    return (
      <div className="historyEarn">
        <div className="historyEarn-title">历史收益</div>
        <div className="historyEarn-val">
          <Table columns={columns} dataSource={listData} pagination={false} loading={loading} />
          {
            total > 0 &&
            <ConfigProvider locale={zh_CN}>
              <Pagination
                current={currentPage}
                total={total}
                showSizeChanger
                showQuickJumper
                showTotal={total => `共 ${total} 条`}
                onChange={this.onChange}
                onShowSizeChange={this.handleShowSizeChange}
              />
            </ConfigProvider>
          }
        </div>
      </div>
    )
  }
}
