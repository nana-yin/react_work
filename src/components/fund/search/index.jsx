import React, { Component } from 'react'
// 引入输入框
import { Input, Spin  } from 'antd'
// 引入icon
import { SearchOutlined } from '@ant-design/icons';
// 引入路由跳转
import {withRouter} from 'react-router-dom'
// 引入当前页面样式
import './index.less'
class Search extends Component {
  state = {
    list: [], // 搜索的数据列表
    operaList: [], // 处理之后的数据
    searchval: '', // 搜索的关键字
    isShowContent: false, // 搜索的内容是否需要展示
    loading: false, // 列表是否处于加载中
    hasMore: true, // 列表是否有更多内容
  }
  componentDidMount() {
    // 调用接口，为list数据赋值
    // todo....
    // 监听滚动
    const typeBoxRes = document.getElementsByClassName('assetCenter-search__content')[0]
    typeBoxRes.addEventListener('scroll', e => {
      const dom = e.target
      if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight) {
        this.onScroll()
      }
    })
  }
  /**
   * 滚动事件
   * @param event 监听的滚动事件
  */
  onScroll = () => {
    // 调用接口，为list追加数据
    // todo....
    const {list,searchval} = this.state
    this.setState({
      loading: true,
      searchval
    },() => {
      const resList = []
      for (let i = list.length; i < list.length + 10;i++) { // 假数据
        let obj = {
          name: `第${i}个基金`,
          id: 'id'+i
        }
        resList.push(obj)
      }
      this.setState({
        list: list.concat(resList)
      },() => {
        const operaList = this.highLightText('id')
        this.setState({
          operaList,
          isShowContent: true,
          loading: false
        })
      })
    })
  }
  /**
   * 输入框中按下回车或者输入框中数据进行更改时，进行数据的搜索，一次10个
   * @param e 当前输入的事件对象
  */
  handleSearch = (e) => {
    // 调用接口，为list数据赋值
    // todo....
    const searchval = e.target.value
    if (searchval.trim()) {
      this.setState({
        list: [],
        operaList: [],
        loading: true,
        searchval
      },() => {
        const resList = []
        for (let i = 0; i < 10;i++) { // 假数据
          let obj = {
            name: `第${i}个基金`,
            id: 'id'+i
          }
          resList.push(obj)
        }
        this.setState({
          list: resList,
        },() => {
          const operaList = this.highLightText('id')
          this.setState({
            operaList,
            isShowContent: true,
            loading: false
          })
        })
      })
    } else {
      this.setState({
        isShowContent: false
      })
    }
  }
  /**
   * 点击基金，进入基金详情
  */
  handleClick = (id) => {
    this.props.history.push({
      pathname: '/fund',
      state: {
        id
      }
    })
  }
  /**
   * 搜索出的列表中文字的颜色高亮
   * @param prope 需要高亮的属性
  */
  highLightText = (prope) => {
    // searchval是搜索的关键字，list是原始的数据
    const {searchval,list} = this.state
    // 最终输出的数据
    let matchVal = [];
    list.forEach((item, index) => {
      let isMatch = true, // 是否匹配
          rawVal = item[prope] // 进行匹配的原始字符串
          matchVal[index] = [] // 初始化数据
      while (isMatch) {
        // 对关键字的位置进行匹配
        let pos = rawVal.indexOf(searchval)
        if (pos === -1) { // 没有匹配到关键字
          isMatch = false
          matchVal[index].push({ [prope]: rawVal.substring(0, rawVal.length),name: item.name })
        } else {
          // 当前匹配的位置+关键字的长度
          let matchEnd = pos + searchval.length
          // 没有匹配到的关键字
          matchVal[index].push({ [prope]: rawVal.substring(0, pos),name: item.name })
          // 匹配到的关键字
          matchVal[index].push({ [prope]: rawVal.substring(pos, matchEnd), matched: true,name: item.name })
          // 将匹配到的文字进行删除，将原始数据进行重新筛选
          rawVal = rawVal.substring(matchEnd, rawVal.length)
          // 当匹配的长度到了末尾，将不再进行匹配
          if (!rawVal && rawVal.length < 1) {
            isMatch = false
          }
        }
			}
		})
    return matchVal
  }
  render() {
    const {list, operaList, isShowContent,loading} = this.state
    return (
      <div className="assetCenter-search">
        <Input placeholder="请输入产品名称/代码" prefix={<SearchOutlined />} onChange={e => this.handleSearch(e)} onPressEnter={e => this.handleSearch(e)}/>
        <div className="assetCenter-search__content" style={{display: isShowContent ? 'block' : 'none'}}>
          <Spin spinning={loading}>
            {
              (list.length > 0) && 
              operaList.map((item,index) => {
                return(
                  <div className="fund" key={list[index].id} onClick={() => this.handleClick(list[index].id)}>
                    <span className="fundName">{list[index].name}</span>
                    {
                      item.map((subItem,subIndex) => {
                        return (
                          <span key={index + subIndex} className="fundId" style={{color: subItem.matched ? '#9b7235' : '#666'}}>
                            {subItem.id}
                          </span>
                        )
                      })
                    }
                  </div>
                )
              })
            } {
              list.length === 0 &&
              <div className="noData">暂无数据！</div>
            }
          </Spin>
        </div>
      </div>
    )
  }
}


export default withRouter(Search)