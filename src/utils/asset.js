export const  percentData = [0, 20, 35, 45, 55, 65, 80, 100]
export const  numericalData = [-3, -1.5, -1, -0.5, 0.5, 1, 1.5, 3]
export const standard = ['极低', '较低', '中低', '中性', '中高', '较高', '极高']

// 把 胜率 盈亏比 市场趋势强度 市场拥挤度 的数字转化为文字 
export function changNunToText (type, value){
  if(isNull(value)){
    return '--'
  }
  let stateRes = ''
  let realData = []
  if (type === 'fmtWinRate' || type === 'mktTrend' || type === '胜率' || type === '趋势强度') {
    realData = percentData
    value = accMul(value, 100)
  } else {
    realData = numericalData
  }
  for (let i = 0; i < realData.length; i++) {
    value = Number(value)
    if (value > realData[i] && value <= realData[i + 1]) {
      stateRes = standard[i]
    }
    if (value > realData[realData.length - 1]) {
      stateRes = standard[standard.length - 1]
    }
    if (value <= realData[0]) {
      stateRes = standard[0]
    }
  }
  return stateRes
}

export function isNull (value) {
  if (!value && typeof value === 'object') {
    return true
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


// 资产的状态颜色
export const colorMap = {
  '极低': '#1677ff',
  '较低': '#507bff',
  '中低': '#ffc057',
  '中性': '#ff8400',
  '中高': '#ff703b',
  '较高': '#e8541e',
  '极高': '#f4333c'
}

export const colorConfig = [
  '#e2702e',
  '#fece79',
  '#bb8346',
  '#8352a1',
  '#295da9',
  '#009bd4',
  '#ef5c9d',
  '#d0c7b8',
  '#806a5a',
  '#694ea0',
  '#c67eb2',
  '#95d6d9',
  '#ef5c74',
  '#2190bf',
  '#494f8c',
  '#ffc412',
  '#64c295',
  '#ed1943',
  '#ea66a7',
  '#a3cd64',
  '#fcb018',
  '#f7abbc',
  '#CAFF70',
  '#C71585',
  '#707070',
  '#cc80ff',
  '#ffdd48',
  '#6279fe',
  '#9fff9c',
  '#f66c22',
  '#faa756',
  '#ea7c28',
  '#f3705d'
]


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
  '管理期货': '#f85c56',
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
 * 处理路由上携带的参数
 * @param name 路由上面的参数名称
 * @param str  路由的字符串
 */
export const getUrlParams = (name, str) => {
  const reg  = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = str.substr(1).match(reg)
  if (r !== null) return decodeURIComponent(r[2])
}
