export const columns = [
  {
    title: '指数名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Wind代码',
    key: 'id',
    dataIndex: 'id',
    render: (text, record) => (
      <span className="indexId">{ record.id }</span>
    )
  }
]

export const explainText = {
  '中小市值': {
    data: [
      {
        key: '000852.SH',
        id: '000852.SH',
        name: '中证1000'
      },
      {
        key: '000903.SH',
        id: '000903.SH',
        name: '中证100'
      }
    ],
    makeClearText: '以总市值（股票收盘价乘以总股本）为排序变量构建的因子，使用中证1000指数减去中证100指数的日收益率来解释中小市值股票的超额收益情况。'
  },
  '大市值': {
    data: [
      {
        key: '000852.SH',
        id: '000852.SH',
        name: '中证1000'
      },
      {
        key: '000903.SH',
        id: '000903.SH',
        name: '中证100'
      }
    ],
    makeClearText: '以总市值（股票收盘价乘以总股本）为排序变量构建的因子，使用中证100指数减去中证1000指数的日收益率来解释大市值股票的超额收益情况。'
  },
  '成长': {
    data: [
      {
        key: 'CIS08302R.WI',
        id: 'CIS08302R.WI',
        name: '中信证券大盘成长因子全收益指数'
      },
      {
        key: 'CIS08322R.WI',
        id: 'CIS08322R.WI',
        name: '中信证券中盘成长因子全收益指数'
      },
      {
        key: 'CIS08342R.WI',
        id: 'CIS08342R.WI',
        name: '中信证券小盘成长因子全收益指数'
      },
      {
        key: 'CIS08200R.WI',
        id: 'CIS08200R.WI',
        name: '中信证券大盘综合beta全收益指数'
      },
      {
        key: 'CIS08201R.WI',
        id: 'CIS08201R.WI',
        name: '中信证券中盘综合beta全收益指数'
      },
      {
        key: 'CIS08202R.WI',
        id: 'CIS08202R.WI',
        name: '中信证券小盘综合beta全收益指数'
      }
    ],
    makeClearText: '以ROE等收益增长指标为排序变量构建的因子，因子值较大的股票往往存在上市时间较短，公司整体业务增长潜力较大的特点。计算时综合考虑中信证券大中小盘因子全收益指数以剔除市值影响。'
  },
  '价值': {
    data: [
      {
        key: 'CIS08301R.WI',
        id: 'CIS08301R.WI',
        name: '中信证券大盘价值因子全收益指数'
      },
      {
        key: 'CIS08321R.WI',
        id: 'CIS08321R.WI',
        name: '中信证券中盘价值因子全收益指数'
      },
      {
        key: 'CIS08341R.WI',
        id: 'CIS08341R.WI',
        name: '中信证券小盘价值因子全收益指数'
      },
      {
        key: 'CIS08200R.WI',
        id: 'CIS08200R.WI',
        name: '中信证券大盘综合beta全收益指数'
      },
      {
        key: 'CIS08201R.WI',
        id: 'CIS08201R.WI',
        name: '中信证券中盘综合beta全收益指数'
      },
      {
        key: 'CIS08202R.WI',
        id: 'CIS08202R.WI',
        name: '中信证券小盘综合beta全收益指数'
      }
    ],
    makeClearText: '以账面市值比（BM）为排序变量构建的因子，计算时综合考虑中信证券大中小盘因子全收益指数以剔除市值影响。'
  }
}
