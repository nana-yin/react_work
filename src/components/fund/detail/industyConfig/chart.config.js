// 引入行业的颜色
import { FUND_TAG_COLOR } from '@/utils/fund.js'
// accMul给数据乘以100
import { accMul } from '@/utils/fund.js'

// 持仓分析--行业分布（柱状图）
export const drawBar = (list) => {
  const data = []
  const xData = []
  const change = []
  list.map(item => {
    data.push(accMul(Math.round(accMul(item.ratio, 100)), 0.01))
    xData.push(item.chineseName)
    change.push(item.change)
  })
  const option = {
    grid: {
      top: 10,
      bottom: 0,
      left: 22,
      right: 20,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      padding: [16, 20],
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderWidth: 0,
      textStyle: {
        fontSize: 14,
        color: '#fff',
        lineHeight: 14
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      formatter: function(params) {
        var htmlStr = '<div>'

        htmlStr += '<div style="margin-bottom: 6px;font-weight: 600;">' + params[0].name + '</div>' +
          '<span>行业占比：' + (params[0].value).toFixed(2) + '%</span><br/>'
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
        color: function(params) {
          return FUND_TAG_COLOR[params.name]
        }
      }
    }]
  }
  console.log('行业分布', option)
  return option
}

