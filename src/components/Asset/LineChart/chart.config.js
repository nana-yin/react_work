
import * as echarts from 'echarts';
import { calcBoundary } from '../../../utils/assetRequest.js'

// 折线图
export const getLine = (data = [], trade = []) => {
  const calcVal = calcBoundary(data, 0.1, 0.1, 'centerPage')
  const options = {
    grid: {
      left: 0,
      right: '2%',
      top: 0,
      bottom: '28%'
    },
    xAxis: {
      type: 'category',
      data: trade,
      axisTick: {
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#999',
        showMinLabel: true,
        showMaxLabel: true,
        formatter: function(value, index) {
          if (value !== '') {
            value = value.split('-')[0] + '/' + value.split('-')[1]
          }
          const data = []
          data.push(index)
          const count = data[data.length - 1]
          if (index === 0 && value !== '') {
            return '             ' + value
          }
          if (index === count && value !== '') {
            return value + '            '
          }
        }
      },
      axisLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ececec'
        }
      },
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      min: calcVal['lowerVal'],
      max: calcVal['upperVal'],
      show: false
    },
    series: [{
      data: data,
      type: 'line',
      lineStyle: {
        color: '#1d76f1'
      },
      connectNulls: true,
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(29,118,241,0.5)'
        }, {
          offset: 1,
          color: 'rgba(29,118,241,0)'
        }])
      }
    }]
  }
  return options
}
