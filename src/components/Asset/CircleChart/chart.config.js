import imgUp from '../../../../public/images/macroUp.png'
import imgDown from '../../../../public/images/macroDown.png'
import imgUnchange from '../../../../public/images/macroUnchange.png'
import { accMul } from '../../../utils/asset.js'

// 圆环图
export const getCircle = (value, trend) => {
  console.log('数据', value, trend)
  const imgsrc = trend === 1 ? imgUp : trend === -1 ? imgDown : trend === 0 ? imgUnchange : null
  const options = {
    title: [{
      text: accMul(value).toFixed(0) + '%',
      left: '44%',
      top: '40%',
      textStyle: {
        fontSize: '16',
        fontWeight: '600',
        color: '#333',
        textAlign: 'center'
      }
    }],
    graphic: {
      elements: [{
        type: 'image',
        z: 3,
        style: {
          image: imgsrc,
          width: trend === 0 ? 12 : 8,
          height: trend === 0 ? 8 : 12
        },
        left: '40%',
        top: 'middle'
      }]
    },
    series: [
      {
        type: 'pie',
        radius: ['80%', '70%'],
        center: ['50%', '50%'],
        data: [{
          // hoverOffset: 1,
          value: Math.floor((Math.abs(value) * 100)),
          itemStyle: {
            // borderColor: '#1d76f1',
            // color: '#fff',
            color: '#1d76f1'
          },
          label: {
            show: false
          },
          labelLine: {
            normal: {
              smooth: true,
              lineStyle: {
                width: 0
              }
            }
          },
          hoverAnimation: false
        },
        {
          label: {
            show: false
          },
          labelLine: {
            normal: {
              smooth: true,
              lineStyle: {
                width: 0
              }
            }
          },
          value: 100 - Math.floor((Math.abs(value) * 100)),
          hoverAnimation: false,
          itemStyle: {
            color: '#eee',
            emphasis: { // 鼠标移入不高亮
              color: '#eee'
            }
          }
        }
        ]
      },
      {
        type: 'pie',
        radius: ['100%', '90%'],
        center: ['50%', '50%'],
        data: [{
          label: {
            show: false
          },
          labelLine: {
            normal: {
              smooth: true,
              lineStyle: {
                width: 0
              }
            }
          },
          value: 0,
          hoverAnimation: false,
          itemStyle: {
            color: '#eee',
            emphasis: { // 鼠标移入不高亮
              color: '#eee'
            }
          }
        }]
      }
    ]
  }
  if (value < 0) {
    options.series[0].data[0].itemStyle = {
      borderColor: '#1d76f1',
      color: '#fff'
    }
  } else {
    options.series[0].data[0].itemStyle = {
      color: '#1d76f1'
    }
  }
  return options
}
