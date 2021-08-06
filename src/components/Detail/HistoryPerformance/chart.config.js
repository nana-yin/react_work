export const getHistoryLine = (xData = [], seriseData = [], ySerise = [], legendData = [], status) => {
  const options = {
    tooltip: {
      trigger: 'axis',
      padding: [16, 20, 10, 20],
      backgroundColor: '#fff',
      extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.06);',
      formatter: (params) => {
        var htmlStr = '<div style="text-align: left;margin-bottom: 6px;">' + params[0].name + '</div>'
        for (let i = 0; i < params.length; i++) {
          if (params[i].value) {
            params[i].value = params[i].seriesName === '胜率' ? (Number(params[i].value) * 100).toFixed(2) + '%' : Number(params[i].value).toFixed(2)
            htmlStr += '<div style="margin-bottom: 6px;text-align: left;"><span style="width: 8px;height: 8px;display:inline-block;border-radius: 50%;background-color:' + params[i].color + ';margin-right:6px"></span><span>' + params[i].seriesName + '：</span>' +
            '<span">' + params[i].value + '</span"></div>'
          } else {
            htmlStr += ''
          }
        }
        htmlStr += '</div>'
        return htmlStr
      },
      confine: true // 超出的部分不会被遮盖
    },
    dataZoom: [{
      type: 'inside',
      left: 'center',
      height: 30,
      start: 0,
      end: 100,
    },
    {
      show: true,
      type: 'slider',
      bottom: 46,
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
    grid: {
      top: '12%',
      left: '4%',
      right: '10%',
      bottom: '25%',
      containLabel: true
    },
    legend: {
      icon: 'rect',
      data: legendData,
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 20,
      selected: {
        '胜率': false,
        '盈亏比': false
      },
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
      // position: 'bottom',
      boundaryGap: false,
      axisTick: {
        show: false,
        lineStyle: {
          color: '#999'
        }
      },
      axisLine: {
        onZero: false,
        show: false,
        lineStyle: {
          color: '#999'
        }
      },
      axisLabel: {
        color: '#999',
        fontSize: 14
      }
    },
    yAxis: ySerise,
    series: seriseData
  }
  if (status !== 0) {
    delete options.legend.selected
  }
  // y轴的名称最长的长度
  let nameLength = 0
  if (legendData.length > 0) {
    legendData.map(item => {
      if (item.length > nameLength) {
        nameLength = item.length
      }
    })
  }
  if (nameLength <= 14) {
    options.grid.left = '8%'
    options.grid.right = '10%'
  } else if (nameLength > 14) {
    options.grid.left = 8 + (nameLength - 12) + '%'
    options.grid.right = 10 + (nameLength - 14) + '%'
  }
  return options
}
