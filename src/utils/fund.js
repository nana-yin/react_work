// 基金详情的tab列表
export const TABS = {
  '普通股票型' : [{
    key: '1',
    name: '业绩表现'
  }, {
    key: '2',
    name: '投资组合'
  }, {
    key: '3',
    name: '基金经理'
  }, {
    key: '4',
    name: '规模分析'
  }, {
    key: '5',
    name: '情景分析'
  }, {
    key: '6',
    name: '产品报告'
  }],
  '货币型基金': [{
    key: '1',
    name: '业绩表现'
  }, {
    key: '2',
    name: '产品报告'
  }]
}

// 基金详情--业绩表现
export const MOVEMENTS_TIME_CARD = [
  {
    key: '1',
    name: '近一月'
  },
  {
    key: '3',
    name: '近三月'
  },
  {
    key: '0',
    name: '今年以来'
  },
  {
    key: '12',
    name: '近一年'
  },
  {
    key: '36',
    name: '近三年'
  },
  {
    key: '1220',
    name: '成立以来'
  }
]


// 基金类型处理
export const FUND_TYPE = {
  '股票型': {
    'A0101': '普通股票型',
    'A0102': '被动指数型',
    'A0103': '增强指数型'
  },
  '混合型': {
    'A0201': '偏股混合型',
    'A0202': '股债配置型',
    'A0203': '偏债混合型'
  },
  '债券型': {
    'A0301': '纯债型债基',
    'A0302': '混合型债基',
    'A0303': '被动指数型债基',
    'A0304': '增强指数型债基'
  },
  '货币市场型': {
    'A0401': '货币市场型基金'
  }
}
/**
 * 比较基准的名称处理
 * @param investType 当前的基金的类型
*/
export const handleBenckmarkName = (investType) => {
  const arr = ['A0102', 'A0103', 'A0303', 'A0304']
  const showbackBenchmarkName = arr.find(item => { return item === investType })
  return showbackBenchmarkName
}

// 基金卡中标签的类型颜色
export const FUND_TAG_COLOR = {
  'A股': '#5b94f6',
  a_share: '#5b94f6',
  '港股': '#702ef6',
  hk_stocks: '#702ef6',
  '可转债': '#a857ff',
  credit_bond: '#fbc65a',
  '高收益信用债': '#ff8bf7',
  high_yield_bond: '#ff8bf7',
  '信用债': '#f8c65a',
  interest_bond: '#fd8889',
  '利率债': '#fd8889',
  convert_bond: '#a857ff',
  '商品CTA': '#f85c56',
  cta: '#f85c56',
  '贵金属': '#fe925d',
  market_neutral: '#53dafc',
  '市场中性': '#53dafc',
  precious_metal: '#fe925d',

  // 策略-行业
  '石油石化': '#FAA756',
  's_0005': '#FAA756',
  '煤炭': '#fece79',
  's_0006': '#fece79',
  '有色金属': '#f66c22',
  's_0007': '#f66c22',
  '电力及公用事业': '#bb8346',
  's_0008': '#bb8346',
  '钢铁': '#009bd4',
  's_0009': '#009bd4',
  '基础化工': '#295da9',
  's_0010': '#295da9',
  '建筑': '#e2702e',
  's_0011': '#e2702e',
  '建材': '#ea7c28',
  's_0012': '#ea7c28',
  '轻工制造': '#f3705d',
  's_0013': '#f3705d',
  '机械': '#6f6e83',
  's_0014': '#6f6e83',
  '电力设备及新能源': '#8352a1',
  '电力设施及新能源': '#8352a1',

  's_0015': '#8352a1',
  '电力设备': '#8352a1',
  // 's_0016': '#8352a1',
  '国防军工': '#806a5a',
  's_0016': '#806a5a',
  '汽车': '#8c8c8c',
  's_0017': '#8c8c8c',
  '商贸零售': '#64c295',
  's_0018': '#64c295',
  '消费者服务': '#595eac',
  's_0019': '#595eac',
  '餐饮旅游': '#595eac',

  '家电': '#95d6d9',
  's_0020': '#95d6d9',
  '纺织服装': '#c67eb2',
  's_0021': '#c67eb2',
  '医药': '#a3cd64',
  's_0022': '#a3cd64',
  '食品饮料': '#ffc412',
  's_0023': '#ffc412',
  '农林牧渔': '#ea66a7',
  's_0024': '#ea66a7',
  '银行': '#f7abbc',
  's_0025': '#f7abbc',
  '非银行金融': '#494f8c',
  's_0026': '#494f8c',
  '房地产': '#fcb018',
  's_0027': '#fcb018',
  '交通运输': '#2190bf',
  's_0028': '#2190bf',
  '电子': '#ed1943',
  's_0029': '#ed1943',
  '电子元器件 ': '#ed1943',
  '通信': '#694ea0',
  's_0030': '#694ea0',
  '计算机': '#ef5c74',
  's_0031': '#ef5c74',
  '传媒': '#d0c7b8',
  's_0032': '#d0c7b8',
  '综合': '#ef5c9d ',

  '低风险': '#1677ff',
  '中低风险': '#ffc057',
  '中风险': '#ff8400',
  '中高风险': '#e8541e',
  '高风险': '#f4333c',
  'A1-低风险': '#1677ff',
  'A2-中低风险': '#ffc057',
  'A3-中风险': '#ff8400',
  'A4-中高风险': '#e8541e',
  'A5-高风险': '#f4333c',

  '大市值': '#ed4c7e',
  's_0001': '#ed4c7e',
  '中小市值': '#ff8897',
  's_0002': '#ff8897',
  '成长': '#9cdcd7',
  's_0003': '#9cdcd7',
  '价值': '#d1a0fb',
  's_0004': '#d1a0fb'
}

/**
 * 判断是否为空
 *
 * @params {} value  需要校验的数据
 *
 * @return {boolean} 是否为空, 默认false
 *  null, '', undefined, [], {} 返回为true
 *  0 返回false
 */
export function isEmpty (value) {
  // 0
  // console.log('----', value, String(value))
  if (String(value) === 0) {
    return false
  }
  // null
  if (!value && typeof value === 'object') {
    return true
  }
  // undefined
  if (typeof value === 'undefined') {
    return true
  }
  // ''
  if (typeof value === 'string' && value === '') {
    return true
  }
  // []
  if (Array.isArray(value)) {
    return !value.length
  }
  // {}
  if (Object.prototype.toString.call(value) === '[object Object]') {
    return !Object.keys(value).length
  }
  return false
}

/**
 * 乘法函数，用来得到精确的乘法结果
 * 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 * 调用：accMul(arg1,arg2)
 * 返回值：arg1乘以 arg2的精确结果
*/
export function accMul (arg1, arg2 = 100) {
  let m = 0
  let s1 = arg1.toString()
  let s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}


// 基金经理的颜色
export const MANAGER_COLOR = [
  '#fde2e2',
  '#bdc1cf',
  '#9edfc8',
  '#e2c5a7',
  '#c8d7ff',
  '#9fdfc7',
  '#c6ece6',
  '#afdde4',
  '#88c5d7',
  '#c8afe4',
  '#e9bee3',
  '#ece4c6',
  '#e2c5a7',
  '#b4df8f',
  '#9cbede',
  '#e4afb6',
  '#dfab9f'
]

/**
 * 十六进制颜色转换为rgba
 * @param hex 十六进制颜色
 * @param opacity 颜色的不透明度
*/
export const bgColor = (hex, opacity) => {
  return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')'
}