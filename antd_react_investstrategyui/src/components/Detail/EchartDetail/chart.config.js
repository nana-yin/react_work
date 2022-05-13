import { isNull,accMul } from '../../../utils/asset'

export const getChart = (legendData, seriesData, xData, multiY, dataZoom, dataSet, title, visualMap) => {
  // console.log('数据', seriesData, multiY, dataSet,)
  multiY.map(item => {
    // delete item.min
    delete item.id
    return item
  })
  seriesData.map((item, index) => {
    item.name = legendData[index]
    delete item.id
    return item
  })
  const options = {
    color: ['#af8e5d'],
    title: {
      // text: title,
      text: '历史序列',
      textStyle: {
        color: '#333',
        fontWeight: 600,
        fontSize: 16
      },
      padding: [6, 10, 30, 0]
    },
    tooltip: {
      trigger: 'axis',
      borderWidth: 1,
      padding: 10,
      textStyle: {
        color: '#fff'
      },
      backgroundColor: 'rgba(0,0,0,0.75)',
      formatter: (params) => {
        // console.log('params', params)
        // console.log('dataSet', dataSet)
        var htmlStr = '<div style="text-align: left;">' + params[0].data[0] + '</div>'
        params.map(val => {
          for (let i = 0; i < dataSet.length; i++) {
            if (val.seriesName === dataSet[i].secName) {
              const value = isNull(val.value[1]) ? '--' : Number(val.value[1]).toFixed(dataSet[i].digit)
              if (dataSet[i].region === '百分号') {
                const v = isNull(val.value[1]) ? '--' : accMul(val.value[1]).toFixed(dataSet[i].digit) + '&nbsp;%'
                htmlStr += '<div style="text-align: left;"><span style="width: 9px;height: 9px;display:inline-block;border-radius: 50%;background-color:' + (Object.keys(visualMap).length > 0 ? '#788cff' : val.color) + ';margin-right:6px"></span><span>' + val.seriesName + '：</span>' +
                '<span">' + v + '</span"></div>'
              } else {
                htmlStr += '<div style="text-align: left;"><span style="width: 9px;height: 9px;display:inline-block;border-radius: 50%;background-color:' + (Object.keys(visualMap).length > 0 ? '#788cff' : val.color) + ';margin-right:6px"></span><span>' + val.seriesName + '：</span>' +
                '<span>' + value + '</span></div>'
              }
              break
            }
          }
        })
        htmlStr += '</div>'
        return htmlStr
      }
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
      left: 'center',
      right: '4%',
      bottom: '0%'
    },
    dataZoom: [{
      show: true,
      type: 'slider',
      width: '75%',
      bottom: '10%',
      left: 'center',
      filterMode: 'empty',
      start: dataZoom,
      end: 100,
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
      top: '15%',
      left: '8%',
      right: '6%',
      bottom: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#f3f3f3'
        }
      },
      axisLabel: {
        color: '#999'
      },
      data: xData
    },
    yAxis: multiY,
    series: seriesData
  }
  if (Object.keys(visualMap).length > 0) {
    options.visualMap = visualMap
  }
  // y轴的名称最长的长度
  let nameLength = 0
  if (multiY.length > 0) {
    multiY.map(item => {
      if (item.name.length > nameLength) {
        nameLength = item.name.length
      }
    })
  }
  if (nameLength <= 14) {
    options.grid.left = '8%'
    options.grid.right = '6%'
  } else if (nameLength > 14) {
    options.grid.left = 8 + (nameLength - 12) + '%'
    options.grid.right = 6 + (nameLength - 14) + '%'
  }
  console.log('长度最长', nameLength)
  // console.log('指标组', multiY)
  return options
}