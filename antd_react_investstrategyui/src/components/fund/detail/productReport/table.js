// 产品报告的表头
import downLoad from '../../../../../public/images/downFile.png'
export const columns = [
  {
    title: '文档名称',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '发布日期',
    dataIndex: 'releseDate',
    key: 'releseDate',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: () => <img src={downLoad} className="downLoad"/>
  },
]