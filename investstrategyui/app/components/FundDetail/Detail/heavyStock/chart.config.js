
// 判断当前的数据是否是空, accMul给数据乘以100
import { isEmpty, accMul } from '../../../../util/fund'

// 重仓股票
export const drawTreeMap = (val) => {
  const seriseData = []
  val.forEach(item => {
    const seriseObj = {
      id: item.fundId,
      name: item.secName,
      value: item.rate,
      configData: item,
      label: {
        show: true,
        verticalAlign: 'top',
        align: 'center',
        // position: ['40%', '50%'],
        formatter: function (params) {
          let value = (accMul(Math.round(accMul(item.pctChange, 100)), 0.01)).toFixed(2)
          value = item.pctChange < 0 ? `${value}` : `+${value}`
          return ['{a|' + params.name + '}', '{b|' + value + '%}'].join('\n')
        },
        rich: {
          a: {
            color: '#333',
            fontSize: 12,
            lineHeight: 17,
            align: 'center'
          },
          b: {
            color: item.pctChange < 0 ? '#0ba194' : '#f24724',
            fontSize: 12,
            lineHeight: 17,
            align: 'center'
          }
        }
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: '#fff',
        color: item.pctChange < 0 ? 'rgba(11,161,148,0.1)' : 'rgba(242,71,36,0.1)'
      }
    }
    seriseData.push(seriseObj)
  })
  const option = {
    tooltip: {
      show: true,
      padding: [16, 30, 16, 20],
      backgroundColor: '#fff',
      borderWidth: 0,
      textStyle: {
        fontSize: 14,
        color: '#333',
        lineHeight: 14
      },
      extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);',
      formatter: function (params) {
        const configData = params.data.configData
        let htmlStr = '<div>'
        // 涨跌幅
        let val = !isEmpty(configData.pctChange) ? (accMul(Math.round(accMul(configData.pctChange, 100)), 0.01)).toFixed(2) : '--'
        val = val !== '--' ? parseFloat(val) < 0 ? `${val}%` : `+${val}%` : '--'
        // 占净值比例
        const netVal = !isEmpty(configData.mktToNav) ? (accMul(Math.round(accMul(configData.mktToNav, 100)), 0.01)).toFixed(2) + '%' : '--'
        htmlStr += '<div style="font-weight: 600;margin-bottom: 6px;">' + configData.secName + `（${configData.stockCode}）</div>` +
                  '<div style="font-weight: 400;margin-bottom: 6px;">涨跌幅：' +
                  `<span style="color: ${(val !== '--') && parseFloat(val) < 0 ? '#0ba194' : '#f24724'}">` + val +
                  '</span></div><div style="font-weight: 400;">占净值比例：' + netVal + '</div>'
        htmlStr += '</div>'
        return htmlStr
      }
    },
    series: [{
      type: 'treemap',
      width: '100%',
      height: '100%',
      breadcrumb: {
        show: false
      },
      nodeClick: false,
      roam: false,
      data: seriseData
    }]
  }
  return option
}
