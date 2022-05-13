import { isEmpty } from '../../../../util/fund'

/**
 * 七日年化收益绘图
 * @param xAxisData  x轴的数据
 * @param seriesData  serise数据
 * @param currentBtn  当前的按钮
*/
export const drawLine = (xAxisData, seriesData, currentBtn) => {
  const options = {
    color: ['#9b7235'],
    grid: {
      bottom: 0,
      left: 39,
      right: 32,
      top: 8,
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      padding: [16, 20],
      backgroundColor: '#fff',
      textStyle: {
        fontSize: 14,
        color: '#333',
        lineHeight: 14,
        fontWeight: 600
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
        let date = params[0].axisValue
        if (date !== '') {
          date = date.split('-')[0] + '/' + date.split('-')[1] + '/' + date.split('-')[2]
        }
        let htmlStr = '<div><div style="text-align: left;margin-bottom: 6px;font-weight: 500;">' + date + '</div>'
        for (let i = 0; i < params.length; i++) {
          let val = params[i].value[1]
          if (!isEmpty(val)) {
            val = currentBtn === '七日年化收益率' ? (parseFloat(val)).toFixed(2) + '%' : (parseFloat(val)).toFixed(4)
            htmlStr += `<div>
                          <span style="display: inline-block;width: 10px;height: 10px;border-radius: 2px;margin-right: 6px;background: ${params[i].color}"></span>
                          <span>${currentBtn === '七日年化收益率' ? '七日年化：' : '万份收益：'}</span>
                          <span>${val}</span>
                        </div>`
          } else {
            htmlStr += `<div>
                          <span style="display: inline-block;width: 10px;height: 10px;border-radius: 2px;margin-right: 6px;background: ${params[i].color}"></span>
                          <span>${currentBtn === '七日年化收益率' ? '七日年化：' : '万份收益：'}--</span>
                        </div>`
          }
        }
        htmlStr += '</div>'
        return htmlStr
      },
      confine: true // 超出的部分不会被遮盖
    },
    xAxis: {
      data: xAxisData,
      axisLabel: {
        show: true,
        fontSize: 12,
        lineHeight: 17,
        color: '#999',
        margin: 11,
        showMinLabel: true,
        showMaxLabel: true,
        formatter: function (value, index) {
          const data = []
          data.push(index)
          const count = data[data.length - 1]
          if (index === 0) {
            return '     ' + value
          }
          if (index === count) {
            return value + '                '
          }
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        },
        onZero: false
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
          const val = currentBtn === '七日年化收益率' ? value.toFixed(2) + '%' : value.toFixed(4)
          return val
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
    series: [
      {
        type: 'line',
        showSymbol: false,
        symbolSize: 9,
        connectNulls: true,
        data: seriesData,
        emphasis: {
          // 鼠标hover上去的时候，拐点的颜色和样式
          itemStyle: {
            borderWidth: 3, // 描边的线宽
            shadowBlur: 5, // 图形的阴影大小
            shadowColor: 'rgba(155,114,53,0.25)' // 图形的阴影颜色
          }
        }
      }
    ]
  }
  // console.log('折线图', options)
  return options
}
