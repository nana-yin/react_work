import { standard } from '../../../utils/asset.js'

const colorTemplate1 = [
  [0.142, '#87b9ff'],[0.284, '#67a7ff'],[0.426, '#4f96fa'],
  [0.568, '#438ff7'],[0.710, '#3988f6'],[0.852, '#2d80f3'],[1, '#2279f2']
]
const colorTemplate2 = [
  [0.142, '#b192f4'],[0.284, '#a87ff6'],[0.426, '#9e6df7'],
  [0.568, '#945af9'],[0.710, '#8b49fa'],[0.852, '#8137fb'],[1, '#7927fd']
]

const percentData = [0, 14, 28, 42, 57, 71, 85, 100]
const numericalData = [-3, -2.15, -1.29, -0.5, 0.3, 1.28, 2.14, 3]
export const getDashChart = (realData, type) => {
  let arr1 = [-3, -1.5, -1, -0.5, 0.5, 1, 1.5, 3]
  let arr2 = [0, 20, 35, 45, 55, 65, 80, 100]
  let fakeData1 = [-2.57, -1.72, -0.895, 0, 0.79, 1.71, 2.57]
  let fakeData2 = [7, 21, 37, 50, 64, 78, 95]
  let fakeData = null
  if (realData === null && type == 1) {
    realData = '--'
    if (type == 1) {
      fakeData = -3
    } else {
      fakeData = 0
    }
  } else {
    if (type == 1) { // 拥挤度,即小数
      if (realData > arr1[arr1.length - 1]) {
        fakeData = 2.57
      }
      if (realData <= arr1[0]) {
        fakeData = -2.57
      }
      for (let i = 0; i< arr1.length; i++) {
        if (realData > arr1[i] && realData <= arr1[i+1]) {
          fakeData = fakeData1[i]
        }
      }
    } else { // 趋势强度,百分比
        if (realData > arr2[arr2.length - 1]) {
          fakeData = 95
        }
        if (realData <= arr2[0]) {
          fakeData = 7
        }
      for (let i = 0; i< arr2.length; i++) {
        if (realData > arr2[i] && realData <= arr2[i+1]) {
          fakeData = fakeData2[i]
        }
      }
    }
  }
  
  const options = {
    tooltip: {
      show: false,
      formatter: '{a} <br/>名称 : {c}%'
    },
    series: [{
      type: 'gauge',
      radius: '100%',
      min: -3,
      max: 3,
      detail: {
        formatter: `拥挤度：${realData}`,
        offsetCenter: [0, '52%'],
        fontSize: 12,
        color: colorTemplate1[6][2]
      },
      startAngle: 200,
      endAngle: -20,
      splitNumber: 7,
      data: [fakeData],
      axisLine: {
        show: true,
        lineStyle: {
          color: colorTemplate1,
          width: 11,
        }
      },
      splitLine:{
        show: true,
        distance: -11,
        length: 11,
        lineStyle: {
          width: 1,
          color: '#fff'
        }
      },
      axisTick: {show: false},			// 刻度(线)样式。
      axisLabel: {show: false},
      pointer: {
        show: true,
        width: 2,
        itemStyle: {
          color: colorTemplate1
        },
        length: 62
      },
      animationDuration:2500,
    },
    {
      type: 'gauge',
      radius: '115%',
      min: -3,
      max: 3,
      detail: {show: false},
      startAngle: 185,
      endAngle: -7,
      splitNumber: 6,
      axisLine: {show: false},
      splitLine:{show:false},
      axisTick: {show: false},			// 刻度(线)样式。
      axisLabel: {
          show: true,
          distance: 8,
          formatter: (val) => {
            val = Number(val)
            for (let i = 0; i < numericalData.length; i++) {
              if (val > numericalData[i] && val <= numericalData[i + 1]) {
                return standard[i]
              }
              if (val === numericalData[0]) {
                return standard[0]
              }
            }
          },         
          color: '#333',
          fontSize: 12
      },
      animationDuration:2500,
      pointer: {show: false}
    }
  ]
  }
  if (type == 2) {
    options.series[0].detail.formatter =  realData === null ? `趋势强度：--` : `趋势强度：${realData}%`
    options.series[0].detail.color = colorTemplate2[6][2]
    options.series[0].axisLine.lineStyle.color = colorTemplate2
    options.series[0].min = options.series[1].min = 0
    options.series[0].max = options.series[1].max = 100
    options.series[1].axisLabel.formatter = function(val) {
      val = Number(val)
      for (let i = 0; i < percentData.length; i++) {
        if (val > percentData[i] && val <= percentData[i + 1]) {
          return standard[i]
        }
        if (val === percentData[0]) {
          return standard[0]
        }
      }
    }
  }
  return options
}
  