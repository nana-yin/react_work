// 引入判断为空的方法
import { isEmpty } from '@/utils/fund.js'
/**
 * 规模分析--柱状图
 * @param dom 当前绘图的dom
 * @param seriseData 当前绘图的serise数据
 * @param xData 当前绘图的x轴数据
 * @param data 当前绘图的数据，持有人结构中才有数据
 **/
export const drawScaleBar = (dom, seriseData, xData, data) => {
  const option = {
    grid: {
      top: dom === 'structureBar' ? 6 : 50,
      bottom: dom === 'structureBar' ? 44 : 20,
      left: dom === 'structureBar'? 28 : 20,
      right: dom === 'structureBar' ? 21: 13,
      containLabel: true
    },
    legend: {
      show: dom === 'structureBar',
      bottom: 0,
      right: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      padding: [6,10],
      backgroundColor: '#fbfbfb',
      borderColor: '#d4d4d4',
      borderWidth: 1,
      borderRadius: 4,
      textStyle: {
        color: '#666',
        fontSize: 12,
        lineHeight: 17
      }
    },
    tooltip: {
      trigger: 'axis',
      padding: [16, 30, 16, 20],
      backgroundColor: '#fff',
      textStyle: {
        fontSize: 14,
        color: '#333',
        lineHeight: 14
      },
      borderWidth: 0,
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      formatter: function(params) {
        var htmlStr = '<div>'
        if (dom === 'structureBar') { // 持有人结构
          htmlStr = '<div><div style="font-weight: 300;">' + params[0].name + '</div>'
          params.map((item, index) => {
            const val = item.seriesName === '个人持有' ? data[item.dataIndex].per : data[item.dataIndex].inst
            const valPercent = item.seriesName === '个人持有' ? data[item.dataIndex].perPercente : data[item.dataIndex].instPercente
            if (!isEmpty(item.value[1])) {
              htmlStr += `<div style="margin-top: 6px;">
                            <span style="display: inline-block;width: 10px;height: 10px;border-radius: 2px;margin-right: 6px;background:${item.color}"></span>
                            <span style="display: inline-block;">${item.seriesName}：${val}亿份，占比${valPercent}%</span>
                          </div>`
            }
            if (index === (params.length - 1)) {
              htmlStr += `<div style="margin-top: 6px;">户均基金份额为：${data[item.dataIndex].total}万份</div>`
            }
          })
        } else { // 产品规模
          if (!isEmpty(params[0].value[1])) {
            htmlStr += '<div style="margin-bottom: 6px;font-weight: 300;">' + params[0].name + '</div>' +
          '<span>产品规模：' + (params[0].value[1]).toFixed(2) + '亿元</span><br/>'
          } else {
            htmlStr += '<div style="margin-bottom: 6px;font-weight: 600;">' + params[0].name + '：</div>' + '<span>--</span><br/>'
          }
        }
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
        showMinLabel: true,
        showMaxLabel: true,
        fontSize: 12,
        lineHeight: 17,
        margin: 11
      },
      axisLine: {
        show: false
      },
      data: xData
    },
    yAxis: {
      type: 'value',
      name: '亿元',
      nameTextStyle: {
        color: '#9b7235',
        fontSize: 14,
        lineHeight: 20
      },
      nameGap: 12,
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        color: '#999',
        fontSize: 12,
        lineHeight: 17,
        margin: 10,
        formatter: function(value, index) {
          return dom === 'structureBar' ? value + '%' : value.toFixed(2)
        }
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
    series: seriseData
  }
  return option
}

/**
 * 规模分析--持有人结构（饼图）
 * @param seriseData 当前绘图的serise数据
 * @param tradeDate 日期
 * @param totalVal 总份额
 **/
export const drawScalePie = (seriseData, tradeDate, totalVal) => {
  const option = {
    color: ['#faf3ea','#dcae73'],
    legend: {
      orient: 'vertical',
      bottom: 18,
      left: '33%',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 18,
      textStyle: {
        color: '#666',
        fontSize: 14,
        lineHeight: 20
      }
    },
    series: [
      {
        type: 'pie',
        silent: true,
        legendHoverLink: false,
        radius: ['40%', '52%'],
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: [`{a|${totalVal}亿份}`, `{b|总份额}`, `{c|${tradeDate}}`].join('\n'),
          position: 'center',
          rich: {
            a: {
              height: 30,
              fontSize: 22,
              color: '#333',
              fontWeight: 600,
              textAlign: 'center',
              padding: [0, 0, 2, 0]
            },
            b: {
              height: 25,
              fontSize: 18,
              color: '#999',
              padding: [0, 0, 2, 0]
            },
            c: {
              height: 17,
              fontSize: 12,
              lineHeight: 14,
              color: '#999'
            }
          }
        },
        labelLine: {
          show: false
        },
        data: seriseData
      }
    ]
  }
  return option
}
