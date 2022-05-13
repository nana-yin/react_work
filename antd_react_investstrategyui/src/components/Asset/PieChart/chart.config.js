
const colorMap = {
  '极低': '#1677ff',
  '较低': '#507bff',
  '中低': '#ffc057',
  '中性': '#ff8400',
  '中高': '#ff703b',
  '较高': '#e8541e',
  '极高': '#f4333c'
}

// 饼图
export function getPie (value, text) {
  const pieColor = colorMap[text] || '#1677ff'
  const options = {
    // animationDuration: 500,
    title: [{
      text: text,
      left: 'center',
      top: 'middle',
      textStyle: {
        fontSize: '14',
        color: pieColor,
        textAlign: 'center'
      }
    }],
    series: [
      {
        type: 'pie',
        radius: ['100%', '80%'],
        center: ['50%', '50%'],
        data: [{
          hoverOffset: 1,
          value: value,
          itemStyle: {
            color: pieColor
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
          silent: true,
          hoverAnimation: false
        },
        {
          label: {
            show: false
          },
          silent: true,
          labelLine: {
            normal: {
              smooth: true,
              lineStyle: {
                width: 0
              }
            }
          },
          value: 100 - value,
          hoverAnimation: false,
          itemStyle: {
            color: '#eee',
            emphasis: { // 鼠标移入不高亮
              color: '#eee'
            }
          }
        }
        ]
      }
    ]
  }
  return options
}

