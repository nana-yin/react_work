// isEmpty对数据为空进行处理
import { isEmpty } from '../../../../util/fund'
/**
 * 基金经理的图表绘制
 * @param legendData 图例
 * @param xAxisData x轴数据
 * @param seriesData serise数据
*/
export const drawManager = (legendData, xAxisData, seriesData) => {
  const options = {
    color: ['#9b7235', '#ffb984'],
    grid: {
      top: 54,
      left: 28,
      right: 28,
      bottom: 36,
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
        type: 'line',
        lineStyle: {
          color: 'rgba(155,114,53,0.7)',
          type: 'dashed'
        }
      },
      extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);',
      formatter: (params) => {
        const { name, date } = params[0].data.managerData
        const startDate = date.length > 0 ? date[0] : '--'
        const leaveDate = date.length > 0 ? date[1] : '--'
        let dateRes = null
        let htmlStr = `<div style="margin-bottom: 6px;">
                          <span style="display: inline-block;width: 10px;height: 10px;background: #9b7235;border-radius: 10px;margin-right: 6px;"></span>
                          <span style="color: #9b7235;">${name || '--'}</span>
                        </div>`
        if (startDate === '--' && leaveDate === '--') { // 当基金经理的任职不存在，则显示当前的x轴日期
          dateRes = params[0].value[0]
        } else {
          dateRes = startDate + '~' + leaveDate
        }
        htmlStr += `<div style="margin-left: 14px;margin-bottom: 6px;">${dateRes}</div>
                    <div style="margin-left: 14px;">`
        params.forEach(item => {
          const val = !isEmpty(item.value[1]) ? parseFloat(item.value[1]) > 0 ? `+${item.value[1]}%` : `${item.value[1]}%` : '--'
          htmlStr += `<div style="margin-bottom: 6px;">${item.seriesName}：<span style="color: ${val !== '--' ? parseFloat(item.value[1]) > 0 ? '#f24724' : '#0ba194' : '#333'}">${val}</span></div>`
        })
        htmlStr += '</div>'
        return htmlStr
      },
      confine: true // 超出的部分不会被遮盖
    },
    legend: {
      data: legendData,
      itemWidth: 10,
      itemHeight: 2,
      itemGap: 20,
      bottom: 0,
      icon: 'rect',
      textStyle: {
        color: '#666',
        fontSize: 12,
        lineHeight: 17
      }
    },
    xAxis: {
      data: xAxisData,
      axisLabel: {
        show: true,
        fontSize: 12,
        lineHeight: 17,
        color: '#999',
        showMinLabel: true,
        showMaxLabel: true,
        margin: 11,
        formatter: function (value, index) {
          const data = []
          data.push(index)
          const count = data[data.length - 1]
          if (index === 0 && value !== '') {
            return '                ' + value
          }
          if (index === count && value !== '') {
            return value + '               '
          }
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      name: '累计收益（%）',
      nameGap: 16,
      nameTextStyle: {
        color: '#9b7235',
        fontSize: 12,
        lineHeight: 17
      },
      axisLabel: {
        show: true,
        margin: 11,
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

// 基金经理的表格
