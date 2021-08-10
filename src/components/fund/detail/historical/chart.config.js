/**
 * 历史胜率的图表绘制
 * @param legendData 图例
 * @param xAxisData x轴数据
 * @param seriesData serise数据
*/
export const drawHistorical = (legendData, xAxisData, seriesData) => {
  const options = {
    color: ['#dcae73', '#55adf6'],
    grid: {
      bottom: 44,
      left: 0,
      right: 0,
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
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0,0,0,0.05)'
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
    xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisLabel: {
              show: true,
              fontSize: 12,
              lineHeight: 14,
              color: '#666',
              margin: 11,
              showMinLabel: true,
              showMaxLabel: true,
          },
          axisTick: {
              show: false
          },
          axisLine: {
              show: true,
              lineStyle: {
                  type: 'dashed',
                  color: '#ddd'
              }
          }
      }
    ],
    yAxis: [{
      name: '累计收益率(%)',
        nameGap: 12,
        nameTextStyle: {
          color: '#af8e5d',
          fontSize: 12,
          lineHeight: 14
        },
        axisLabel: {
          show: true,
          margin: 10,
          fontSize: 12,
          lineHeight: 14,
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
      }
    ],
    series: seriesData
};
  return options
}