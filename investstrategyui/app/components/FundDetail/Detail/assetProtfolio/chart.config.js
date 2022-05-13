// 资产分布
export const drawPie = (val) => {
  const option = {
    color: ['#aa86e0', '#fdd34d', '#83c6c7', '#48a1ff'],
    grid: {
      top: 0,
      bottom: 0,
      left: 20,
      right: 20
    },
    legend: {
      top: '16%',
      left: '62%',
      orient: 'vertical',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 14,
      bottom: 0,
      textStyle: {
        color: '#666',
        fontSize: 14,
        lineHeight: 20
      }
    },
    series: [
      {
        type: 'pie',
        height: 220,
        center: ['50%', '38%'],
        legendHoverLink: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          { value: val.stockToTotal < 0 ? 0 : val.stockToTotal, name: '股票', itemStyle: { color: '#aa86e0' } },
          { value: val.cashToTotal < 0 ? 0 : val.cashToTotal, name: '银行存款', itemStyle: { color: '#fdd34d' } },
          { value: val.bondToTotal < 0 ? 0 : val.bondToTotal, name: '债券', itemStyle: { color: '#83c6c7' } },
          { value: val.otherTotal < 0 ? 0 : val.otherTotal, name: '其他资产', itemStyle: { color: '#48a1ff' } }
        ],
        emphasis: {
          scale: false
        }
      }
    ]
  }

  return option
}
