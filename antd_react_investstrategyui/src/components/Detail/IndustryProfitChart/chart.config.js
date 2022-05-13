
export const getIndustryEarn = (xData = [], seriseData = [], nameArr) => {
  const options = {
    tooltip: {
      trigger: 'axis',
      padding: [16, 20],
      backgroundColor: '#fff',
      extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.06);'
    },
    grid: {
      top: '10%',
      left: '13%',
      right: '15%',
      bottom: '30%'
    },
    dataZoom: [{
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      show: true,
      type: 'slider',
      bottom: 36,
      start: 0,
      end: 100,
      left: 'center',
      backgroundColor: '#fafafa',
      borderColor: '#fafafa',
      dataBackground: {
        lineStyle: {
          width: 0
        },
        areaStyle: {
          color: '#efefef',
          opacity: '1'
        }
      },
      selectedDataBackground: {
        lineStyle: {
          width: 0
        },
        areaStyle: {
          color: '#efefef',
          opacity: '1'
        }
      },
      fillerColor: 'rgba(51,51,51, 0.05)',
      brushSelect: false,
      handleStyle:{ /*手柄的样式*/ 
        color:"#fff", 
        borderWidth: 3,
        borderColor:"#e5eaf2"
      },
      handleIcon: "path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z"
    }],
    legend: {
      icon: 'rect',
      data: nameArr,
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 20,
      textStyle: {
        color: '#666',
        fontSize: 16,
        lineHeight: 14,
        padding: [5, 10, 3, 6]
      },
      inactiveColor: '#c6c6c6',
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false,
      axisTick: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        show: true,
        color: '#999',
        fontSize: 12
      }
    },
    yAxis: [{
      show: true,
      type: 'value',
      name: nameArr[0],
      nameTextStyle: {
        color: '#9b7235'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f3f3f3'
        }
      }
    }],
    series: [{
      name: nameArr[0],
      type: 'line',
      data: seriseData,
      connectNulls: true,
      lineStyle: {
        width: 1,
        color: '#9b7235'
      },
      itemStyle: {
        color: '#9b7235',
        shadowColor: '#9b7235',
        shadowBlur: 8
      }
    }]
  }
  // console.log('相对超额收益', options)
  return options
}
