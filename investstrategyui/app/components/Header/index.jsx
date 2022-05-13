import React, { Component } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import ProductCenter from '../../pages/ProductCenter'
import FundDetail from '../../pages/FundDetail'
import './index.less'

export default class Header extends Component {
  render () {
    return (
      <div>
        <Link to="/">
          <div className="head">
            <div className="tab">
              <span className="icon"></span>
              <span className="title">产品中心</span>
            </div>
          </div>
        </Link>
        <Switch>
          <Route path="/" exact component={ProductCenter}/>
          <Route path="/fundDetail" component={FundDetail}/>
        </Switch>
      </div>
    )
  }
}
