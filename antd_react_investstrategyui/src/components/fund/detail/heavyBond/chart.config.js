// accMul给数据乘以100
import { isEmpty,accMul } from '@/utils/fund.js'
/**
 * 重仓债券（柱状图）
 * @param xData x轴的数据
 * @param listData 绘图的数据
*/
export const drawBar = (xData, listData) => {
  const color = ['#985fea', '#f99e70', '#FDD34D', '#4fccce','#ff7965']
  const option = {
    grid: {
      top: 28,
      bottom: 20,
      left: 32,
      right: 32,
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
      formatter: function(params) {
        const val = !isEmpty(params[0].value) ? (params[0].value).toFixed(2) : '--'
        var htmlStr = `<div><span style="display: inline-block;margin-right: 6px;width: 10px;height: 10px;border-radius: 2px;background: ${params[0].color}"></span>
                        <span>${params[0].name}</span>
                        <span>（${params[0].data.fundId}）</span>
                      </div>`
        htmlStr += `<div style="margin: 0 0 6px 0;">占净值比：${ val !== '--' ? val + '%' : '--'}<div>`
        htmlStr += `<div>券种类型：${params[0].data.fundType}<div>`
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
        margin: 11
      },
      axisLine: {
        show: false
      },
      data: xData
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
      data: listData,
      type: 'bar',
      showBackground: true,
      cursor: 'default',
      barWidth: 32,
      backgroundStyle: {
        color: '#eaeaea'
      },
      itemStyle: {
        color: function(params) {
          return color[params.dataIndex]
        }
      }
    }]
  }
  return option
}

