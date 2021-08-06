import { Constant } from './_utils'
const { ApiPrefix } = Constant

const database = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    zh: {
      name: '仪表盘'
    },
    'pt-br': {
      name: 'Dashboard'
    },
    route: '/dashboard',
  },
  {
    id: '2',
    breadcrumbParentId: '1',
    name: 'Asset',
    zh: {
      name: '资产策略中心'
    },
    'pt-br': {
      name: 'Asset'
    },
    icon: 'shopping-cart',
    route: '/asset',
  },
  {
    id: '3',
    breadcrumbParentId: '1',
    name: 'Detail',
    zh: {
      name: '卡片详情'
    },
    'pt-br': {
      name: 'Detail'
    },
    icon: 'shopping-cart',
    route: '/detail',
  },
  {
    id: '5',
    breadcrumbParentId: '1',
    name: 'Charts',
    zh: {
      name: 'Charts'
    },
    'pt-br': {
      name: 'Graficos'
    },
    icon: 'shopping-cart',
  },
  {
    id: '51',
    breadcrumbParentId: '5',
    menuParentId: '5',
    name: 'Tree',
    zh: {
      name: '树图'
    },
    'pt-br': {
      name: 'Tree'
    },
    icon: 'shopping-cart',
    route: '/chart/tree',
  },
  {
    id: '52',
    breadcrumbParentId: '5',
    menuParentId: '5',
    name: 'assetFourIndex',
    zh: {
      name: '底层指标'
    },
    'pt-br': {
      name: 'assetFourIndex'
    },
    icon: 'shopping-cart',
    route: '/assetFourIndex',
  }
  
]

module.exports = {
  [`GET ${ApiPrefix}/routes`](req, res) {
    res.status(200).json(database)
  },
}
