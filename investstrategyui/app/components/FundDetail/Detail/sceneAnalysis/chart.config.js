// isEmpty对数据为空进行处理
import { isEmpty } from '../../../../util/fund'
/**
 * 牛熊周期的图表绘制
 * @param legendData 图例
 * @param xAxisData x轴数据
 * @param seriesData serise数据
*/
export const drawScenceChart = (legendData, xAxisData, seriesData) => {
  const options = {
    color: ['#ee8e45', '#e0e2eb'],
    grid: {
      top: 20,
      left: 20,
      right: 30,
      bottom: 163,
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      padding: [16, 30, 10, 20],
      backgroundColor: '#fff',
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
      formatter: (params) => {
        let htmlStr = `<div style="margin-bottom: 6px;">${(params[0].value)[0]}</div><div>`
        params.forEach(item => {
          const val = !isEmpty(item.value[1]) ? `${item.value[1]}%` : '--'
          htmlStr += `<div style="margin-bottom: 6px;">${item.seriesName}：${val}</div>`
        })
        htmlStr += '</div>'
        return htmlStr
      },
      extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);',
      confine: true // 超出的部分不会被遮盖
    },
    legend: {
      data: legendData,
      itemWidth: 10,
      itemHeight: 2,
      itemGap: 20,
      bottom: 20,
      icon: 'roundRect',
      backgroundColor: '#fbfbfb',
      borderWidth: 1,
      borderColor: '#d4d4d4',
      borderRadius: 4,
      padding: [6, 10, 5, 10],
      textStyle: {
        color: '#666',
        fontSize: 12,
        lineHeight: 17
      }
    },
    xAxis: {
      data: xAxisData,
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      axisLabel: {
        show: true,
        margin: 10,
        fontSize: 12,
        lineHeight: 17,
        color: '#999',
        formatter: value => {
          return value + '%'
        }
      },
      axisTick: {
        show: false
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
    series: seriesData
  }
  return options
}
