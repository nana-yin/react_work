/**
 * 业绩表现的图表绘制
 * @param legendData 图例
 * @param xAxisData x轴数据
 * @param seriesData serise数据
*/
export const drawLineChart = (legendData, xAxisData, seriesData) => {
  const options = {
    color: ['#9b7235', '#a4caff'],
    grid: {
      bottom: 44,
      left: 32,
      right: 34,
      top: 50,
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
        var htmlStr = '<div style="text-align: left;margin-bottom: 6px;font-weight: 500;">' + params[0].axisValue + '</div>'
        for (let i = 0; i < params.length; i++) {
          const val = params[i].value[1]
          if (val) {
            htmlStr += `<div>
                          <span style="display: inline-block;width: 10px;height: 10px;border-radius: 2px;margin-right: 6px;background: ${params[i].color}"></span>
                          <span>${params[i].seriesName}：${val}%</span>
                        </div>`
          } else {
            htmlStr += `<div>
                          <span style="display: inline-block;width: 10px;height: 10px;border-radius: 2px;margin-right: 6px;background: ${params[i].color}"></span>
                          <span>${params[i].seriesName}：--</span>
                        </div>`
          }
        }
        htmlStr += '</div>'
        return htmlStr
      },
      confine: true // 超出的部分不会被遮盖
    },
    legend: {
      data: legendData,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      bottom: 0,
      icon: 'roundRect',
      backgroundColor: '#fbfbfb',
      borderWidth: 1,
      borderColor: '#d4d4d4',
      borderRadius: 4,
      padding: [9,10],
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
        margin: 11
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      name: '收益率',
      nameGap: 12,
      nameTextStyle: {
        color: '#9b7235',
        fontSize: 12,
        lineHeight: 17
      },
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
    series: [
      {
        type: 'line',
        cursor: 'default',
        name: legendData[0],
        showSymbol: false,
        symbolSize: 9,
        connectNulls: true,
        data: seriesData[0],
        emphasis: {
          // 鼠标hover上去的时候，拐点的颜色和样式
          itemStyle: {
            borderWidth: 3, // 描边的线宽
            shadowBlur: 5, // 图形的阴影大小
            shadowColor: 'rgba(155,114,53,0.25)' // 图形的阴影颜色
          }
        }
      },
      {
        type: 'line',
        cursor: 'default',
        name: legendData[1],
        showSymbol: false,
        connectNulls: true,
        data: seriesData[1],
        symbolSize: 9,
        emphasis: {
          // 鼠标hover上去的时候，拐点的颜色和样式
          itemStyle: {
            borderWidth: 3, // 描边的线宽
            shadowBlur: 5, // 图形的阴影大小
            shadowColor: 'rgba(164,202,255,0.25)' // 图形的阴影颜色
          }
        }
      }
    ]
  }
  return options
}

// 业绩表现的表格表头
export const columns = [
  {
    title: '基金简称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '区间收益率',
    dataIndex: 'rateReturn',
    key: 'rateReturn',
    align: 'center'
  },
  {
    title: '年化收益率',
    dataIndex: 'rateReturn',
    key: 'rateReturn',
    align: 'center'
  },
  {
    title: '年化波动率',
    dataIndex: 'vol',
    key: 'vol',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '年化夏普率',
    dataIndex: 'sharpe',
    key: 'sharpe',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '最大回撤',
    dataIndex: 'maxDraw',
    key: 'maxDraw',
    ellipsis: true,
    align: 'right'
  }
]

