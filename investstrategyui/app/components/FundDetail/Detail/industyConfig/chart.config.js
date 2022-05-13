// 引入行业的颜色,accMul给数据乘以100
import { FUND_TAG_COLOR, isEmpty, accMul } from '../../../../util/fund'

// 持仓分析--行业分布（柱状图）
export const drawBar = (list) => {
  const data = []
  const xData = []
  const change = []
  list.forEach(item => {
    data.push(accMul(Math.round(accMul(item.ratio, 100)), 0.01))
    xData.push(item.chineseName)
    change.push(item.change)
  })
  const option = {
    grid: {
      top: 20,
      bottom: 30,
      left: 20,
      right: 20,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      padding: [16, 30, 16, 20],
      backgroundColor: '#fff',
      borderWidth: 0,
      textStyle: {
        fontSize: 14,
        color: '#333',
        lineHeight: 14
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);',
      formatter: function (params) {
        const val = !isEmpty(params[0].value) ? (params[0].value).toFixed(2) : '--'
        let htmlStr = '<div>'
        htmlStr += `<span style="display: inline-block;margin-right: 6px;width: 10px;height: 10px;border-radius: 2px;background: ${params[0].color}"></span>
                      <span>${params[0].name}：</span>
                      <span>${val !== '--' ? val + '%' : '--'}</span>
                    `
        htmlStr += '</div>'
        return htmlStr
      }
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        color: '#999',
        fontSize: 12,
        lineHeight: 17,
        rotate: 45,
        margin: 7
      },
      axisLine: {
        show: false
      },
      data: [...xData]
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        color: '#999',
        fontSize: 12,
        lineHeight: 14,
        margin: 10,
        formatter: '{value}%'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      }

    },
    series: [{
      data: [...data],
      type: 'bar',
      showBackground: true,
      cursor: 'default',
      barWidth: 16,
      backgroundStyle: {
        color: '#eaeaea'
      },
      itemStyle: {
        color: function (params) {
          return FUND_TAG_COLOR[params.name]
        }
      }
    }]
  }
  console.log('行业分布', option)
  return option
}
