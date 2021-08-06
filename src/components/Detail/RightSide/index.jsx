import React, { Component } from 'react'
import {Spin,Table} from 'antd'
import { columns, explainText } from './table.config.js'
import './index.less'

export default class RightSide extends Component {
  state = {
    factorVisible: true,
    spinning: true,
    factorName: '',
    columns: columns,
    data: [],
    makeClearText: ''
  }
  componentDidMount() {
    let factorVisibleRes = false
    const {pageTitle, type} = this.props
    if (type === 'styleStrategy') {
      factorVisibleRes = true
    } else {
      factorVisibleRes = false
    }
    const dataRes = explainText[pageTitle].data
    const makeClearText = explainText[pageTitle].makeClearText
    this.setState({
      factorName: pageTitle,
      data: dataRes,
      factorVisible: factorVisibleRes,
      makeClearText,
      spinning: false
    })
  }
  render() {
    const {factorVisible,columns,data, spinning, factorName, makeClearText} = this.state
    return (
      <div className="factorExplain">
        {
          factorVisible &&
          <Spin spinning={spinning}>
            <div className="factorExplain-title">
              <div className="factorExplain-tagImg" />
              <span>{ factorName }因子指数构建说明</span>
            </div>
            <div className="factorExplain-content">
              <div className="factorExplain-content_index">构成指数：</div>
              <Table columns={columns} dataSource={data} pagination={false} />
              <p className="factorExplain-content_makeClear">
                { makeClearText }
              </p>
            </div>
          </Spin>
        }
      </div>
    )
  }
}
