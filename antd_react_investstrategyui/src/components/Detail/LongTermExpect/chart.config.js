export const getLongTerm = (seriseList = [], nameList = []) => {
  // console.log(seriseList)
  const options = {
    grid: {
      top: '6%',
      left: '1%',
      right: 100,
      bottom: '0%',
      containLabel: true // grid区域是否包含坐标轴的刻度标签,防止标签溢出
    },
    tooltip: {
      trigger: 'item', // 触发类型:轴触发，axis表示鼠标hover显示全部数据，item表示鼠标hover显示相应数据
      padding: [10, 20],
      backgroundColor: 'rgba(0,0,0,0.75)',
      extraCssText: 'box-shadow: 0px 0px 13px 0px rgba(141, 146, 169, 0.44);',
      formatter: function(params) {
        const paramsValue = params.marker + params.seriesName + '<br/>' + '长期预期波动率：' + params.value[0] + '%<br/>' + '长期预期收益率：' + params.value[1] + '%'
        return paramsValue
      },
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        show: true,
        type: 'cross', // 默认为line，line直线，cross十字准星，shadow阴影
        lineStyle: {
          type: 'dashed',
          width: 1
        }
      },
      confine: true // 超出的部分不会被遮盖
    },
    xAxis: {
      name: '长期预期波动率',
      splitLine: { // 网格线
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      },
      axisLabel: {
        formatter: '{value} %',
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#999',
          fontSize: 12
        }
      },
      axisTick: {
        lineStyle: {
          color: '#999',
          fontSize: 12
        }
      },
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    yAxis: {
      name: '长期预期收益率',
      splitLine: { // 网格线
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      },
      axisLabel: {
        formatter: '{value} %',
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#999',
          fontSize: 12
        }
      },
      axisTick: {
        lineStyle: {
          color: '#999',
          fontSize: 12
        }
      },
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    series: seriseList,
    legend: {
      show: false,
      width: '80%',
      left: 'center',
      bottom: 0,
      data: nameList,
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 6,
      textStyle: {
        color: '#999',
        fontSize: 12
      }
    }
  }
  // console.log('长期风险收益图', options)
  return options
}
