
import * as echarts from 'echarts';

// 决策罗盘表格的近三个月的变化 alice3.0
export const getDashChart = (data = []) => {
  // const calcVal = calcBoundary(data, 0.1, 0.1)
  const options = {
    grid: {
      left: 0,
      right: '2%',
      top: '4%',
      bottom: '0%'
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false,
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      },
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      data: data,
      type: 'line',
      lineStyle: {
        color: '#9b7235'
      },
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(155,114,53,0.5)'
        }, {
          offset: 1,
          color: 'rgba(155,114,53,0)'
        }])
      }
    }]
  }
  return options
}
