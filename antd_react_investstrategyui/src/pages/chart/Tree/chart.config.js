import G6 from '@antv/g6';
import { fittingString } from '../../../utils/assetRequest.js'
import winDown from '../../../../public/images/winDown.png'
import winUp from '../../../../public/images/winUp.png'
import relationAdd from '../../../../public/images/relationAdd.png'
import relationSub from '../../../../public/images/relationSub.png'
import {colorMap, changNunToText} from '../../../utils/asset.js'
import insertCss from 'insert-css';

insertCss(`
  .g6-component-tooltip {
    background-color: rgba(0, 0, 0, 0.7);
    padding: 8px 12px;
    border: none;
    font-size: 14px;
    line-height: 14px;
    color: #fff;
  }
`);
// 胜率数据
export const mockDataWin = {
  id: 'g1',
  name: 'A股-胜率',
  collapsed: false,
  children: [
    {
      id: 'g12',
      name: '中国-信用环境',
      img: -1, // 上升或者下降
      relation: '+',
      collapsed: false
    },
    {
      id: 'g13',
      name: '中国-信用数量',
      img: 1, // 上升或者下降
      relation: '-',
      collapsed: false,
      children: [
        {
          id: 'g131',
          name: 'Name10',
          img: 1, // 上升或者下降
          relation: '+',
          children: [],
        },
        {
          id: 'g132',
          name: 'Name11',
          img: 1, // 上升或者下降
          relation: '+',
          children: [],
        },
      ],
    },
    {
      id: 'g14',
      name: '中国-总需求',
      img: 1, // 上升或者下降
      relation: '+',
      children: [
        {
          id: 'g141',
          name: '外需',
          img: 1, // 上升或者下降
          relation: '+',
          collapsed: false,
          children: [
            {
              id: 'g1411',
              name: '出口交货值累计同比',
              img: -1, // 上升或者下降
              relation: '-'
            },
            {
              id: 'g1412',
              name: 'PMI新出口订单',
              img: -1, // 上升或者下降
              relation: '-'
            },
            {
              id: 'g1413',
              name: '摩根大通全球制造摩根大通全球制造',
              img: -1, // 上升或者下降
              relation: '-'
            },
          ],
        },
        {
          id: 'g142',
          name: '产出',
          collapsed: false,
          img: 1, // 上升或者下降
          relation: '+',
          children: [
            {
              id: 'g1421',
              name: '乙烯产量累计同比',
              img: -1, // 上升或者下降
              relation: '+',
              collapsed: false,
              children: [
                {
                  id: 'g12211',
                  name: 'Name6-1',
                  img: -1, // 上升或者下降
                  relation: '+',
                  children: [],
                },
              ],
            },
            {
              id: 'g1222',
              name: '发电量累计同比',
              img: 1, // 上升或者下降
              relation: '-',
              children: [],
            },
          ],
        },
        {
          id: 'g143',
          name: '交运',
          collapsed: false,
          img: -1, // 上升或者下降
          relation: '+',
          children: [
            {
              id: 'g1231',
              name: '汽车产量累计同比汽车产量累计同比-1',
              img: -1, // 上升或者下降
              relation: '-',
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 'g15',
      name: '中国-资金利率',
      img: 1, // 上升或者下降
      relation: '+',
      children: [],
    },
    {
      id: 'g16',
      name: '中国-物价',
      img: 1, // 上升或者下降
      relation: '+',
      children: [],
    },
    {
      id: 'g17',
      name: '中国-产能',
      img: 1, // 上升或者下降
      relation: '+',
      children: [],
    },
  ],
};
// 盈亏比数据
export const mockDataOdd = {
  id: 'g1',
  name: 'A股-胜率',
  collapsed: false,
  children: [
    {
      id: 'g12',
      name: '中国-信用环境',
      collapsed: false
    },
    {
      id: 'g13',
      name: '中国-信用数量',
      collapsed: false,
      children: [
        {
          id: 'g131',
          name: 'Name10',
          children: [],
        },
        {
          id: 'g132',
          name: 'Name11',
          children: [],
        },
      ],
    },
    {
      id: 'g14',
      name: '中国-总需求',
      children: [
        {
          id: 'g141',
          name: '外需',
          collapsed: false,
          children: [
            {
              id: 'g1411',
              name: '出口交货值累计同比',
            },
            {
              id: 'g1412',
              name: 'PMI新出口订单',
            },
            {
              id: 'g1413',
              name: '摩根大通全球制造摩根大通全球制造',
            },
          ],
        },
        {
          id: 'g142',
          name: '产出',
          collapsed: false,
          children: [
            {
              id: 'g1421',
              name: '乙烯产量累计同比',
              collapsed: false,
              children: [
                {
                  id: 'g12211',
                  name: 'Name6-1',
                  children: [],
                },
              ],
            },
            {
              id: 'g1222',
              name: '发电量累计同比',
              children: [],
            },
          ],
        },
        {
          id: 'g143',
          name: '交运',
          collapsed: false,
          children: [
            {
              id: 'g1231',
              name: '汽车产量累计同比汽车产量累计同比-1',
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 'g15',
      name: '中国-资金利率',
      children: [],
    },
    {
      id: 'g16',
      name: '中国-物价',
      children: [],
    },
    {
      id: 'g17',
      name: '中国-产能',
      children: [],
    },
  ],
};

// 默认配置
const configFunc = (container) => {
  const defaultConfig = {
    modes: {
      default: ['zoom-canvas', 'drag-canvas'],
    },
    fitView: true,
    animate: true,
    defaultNode: {
      type: 'flow-rect',
    },
    defaultEdge: {
      type: 'cubic-horizontal',
      style: {
        stroke: '#eee',
      },
    },
    layout: {
      type: 'indented',
      direction: 'LR',
      dropCap: false,
      indent: 300,
      getHeight: () => {
        return 60;
      },
    },
  }
  return defaultConfig
};

const registerFn = () => {
  // 定义除了cta之外的树图的节点--胜率
  G6.registerNode(
    'flow-rect',
    { // 节点的样式
      shapeType: 'flow-rect',
      draw(cfg, group) {
        const {
          name = '',
          collapsed,
          img,
          relation
        } = cfg;
        const rectConfig = {
          width: 194,
          height: 36,
          lineWidth: 1,
          fontSize: 14,
          fill: '#fbfbfb',
          radius: 4,
          stroke: '#d4d4d4',
          opacity: 1,
        };

        const nodeOrigin = {
          x: -rectConfig.width / 2,
          y: -rectConfig.height / 2,
        };

        const textConfig = {
          textAlign: 'left',
          textBaseline: 'bottom',
        };

        const rect = group.addShape('rect', {
          attrs: {
            x: nodeOrigin.x,
            y: nodeOrigin.y,
            ...rectConfig,
          },
        });

        const rectBBox = rect.getBBox();

        // 节点名称
        group.addShape('text', {
          attrs: {
            ...textConfig,
            x: 35 + nodeOrigin.x,
            y: 26 + nodeOrigin.y,
            text: name.length > 8 ? name.substr(0, 8) + '...' : name,
            fontSize: 14,
            opacity: 1,
            fill: '#666',
            cursor: 'pointer',
          },
          name: 'name-shape',
        });

        // 正负号
        group.addShape('image', {
          attrs: {
            ...textConfig,
            x: 10 + nodeOrigin.x,
            y: 12 + nodeOrigin.y,
            width: 16,
            height: 16,
            textAlign: 'left',
            img: relation === '+' ? relationAdd : relation === '-' ? relationSub : ''
          },
          name: 'plusMin-shape',
        });

        // 趋势
        group.addShape('image', {
          attrs: {
            ...textConfig,
            x: rectBBox.maxX - 34,
            y: 10 + nodeOrigin.y,
            width: 20,
            height: 20,
            textAlign: 'left',
            img: img > 0 ? winUp : img < 0 ? winDown : ''
          },
          name: 'trend-shape',
        });


        // 折叠节点
        if (cfg.children && cfg.children.length) {
          group.addShape('circle', {
            attrs: {
              x: rectConfig.width / 2,
              y: 0,
              r: 6,
              opacity: 1,
              stroke: '#d4d4d4',
              lineWidth: 2,
              cursor: 'pointer',
              fill: collapsed ? '#d4d4d4' : '#fff',
            },
            name: 'collapse-back',
            modelId: cfg.id,
          });
        }

        this.drawLinkPoints(cfg, group);
        return rect;
      },
      update(cfg, item) {
        const group = item.getContainer();
        this.updateLinkPoints(cfg, group);
      },
      setState(name, value, item) {
        if (name === 'collapse') {
          const group = item.getContainer();
          const collapseText = group.find((e) => {
            return e.get('name') === 'collapse-back'
          });
          console.log('collapseText', collapseText)
          if (collapseText) {
            if (!value) {
              collapseText.attr({
                fill: '#fff',
              });
            } else {
              collapseText.attr({
                fill: '#d4d4d4',
              });
            }
          }
        }
      },
      getAnchorPoints() {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
      },
    },
    'rect',
  );

  // 定义cta节点--胜率
  G6.registerNode(
    'cta-node',
    {
      drawShape: function drawShape(cfg, group) {
        const rect = group.addShape('rect', {
          attrs: {
            fill: '#fbfbfb',
            stroke: '#d4d4d4',
            radius: [4,4],
            cursor: 'pointer'
          },
          name: 'rect-shape',
        });
        const text = group.addShape('text', {
          attrs: {
            text: fittingString(cfg.name, 150, 14),
            x: 0,
            y: 0,
            labelCfg: {
              position: 'center'
            },
            lineHeight: 19,
            textAlign: 'left',
            fontSize: 14,
            // textBaseline: 'middle',
            fill: '#666',
            cursor: 'pointer'
          },
          name: 'rect-shape',
        });
        const bbox = text.getBBox();
        
        // 只给胜率的最后一层节点加上趋势
        // console.log('1111', cfg)
        if (cfg.img) {
          group.addShape('rect', {
            attrs: {
              stroke: '',
              cursor: 'pointer',
              x: bbox.maxX + 10,
              y: bbox.maxY - 19,
              width: 40,
              height: 22,
              fill: colorMap[changNunToText('胜率', cfg.img)],
              opacity: 0.1,
              radius: [2,2],
            },
            name: 'ip-box',
          })
          group.addShape('text', {
            attrs: {
              text: changNunToText('胜率', cfg.img),
              x: bbox.maxX + 17,
              y: bbox.maxY - 8,
              fontSize: 12,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: colorMap[changNunToText('胜率',cfg.img)],
              cursor: 'pointer',
            },
            name: 'circle-shape',
          })
        }
        rect.attr({
          x: bbox.minX - 12,
          y: bbox.minY -9,
          width: cfg.img ? bbox.width + 72 : bbox.width + 24,
          height: bbox.height + 16,
        });
        return rect;
      }
    },
    'cta-tree-node',
  )
};

G6.registerEdge(
  'flow-cubic',
  {
    getControlPoints(cfg) {
      let controlPoints = cfg.controlPoints; // 指定controlPoints
      if (!controlPoints || !controlPoints.length) {
        const { startPoint, endPoint, sourceNode, targetNode } = cfg;
        const { x: startX, y: startY, coefficientX, coefficientY } = sourceNode
          ? sourceNode.getModel()
          : startPoint;
        const { x: endX, y: endY } = targetNode ? targetNode.getModel() : endPoint;
        let curveStart = (endX - startX) * coefficientX;
        let curveEnd = (endY - startY) * coefficientY;
        curveStart = curveStart > 40 ? 40 : curveStart;
        curveEnd = curveEnd < -30 ? curveEnd : -30;
        controlPoints = [
          { x: startPoint.x + curveStart, y: startPoint.y },
          { x: endPoint.x + curveEnd, y: endPoint.y },
        ];
      }
      return controlPoints;
    },
    getPath(points) {
      const path = [];
      path.push(['M', points[0].x, points[0].y]);
      path.push([
        'C',
        points[1].x,
        points[1].y,
        points[2].x,
        points[2].y,
        points[3].x,
        points[3].y,
      ]);
      return path;
    },
  },
  'single-line',
)
registerFn();

let graph = null;

export const initGraph = (props,width,height,container) => {
  const configRes = configFunc(container)
  const { onInit, config,data} = props;
  if (!data) {
    return;
  }
  // 提示框
  const tooltip = new G6.Tooltip({
    offsetX: 8,
    offsetY: 12,
    // 允许出现 tooltip 的 item 类型
    itemTypes: ['node'],
    // 自定义 tooltip 内容
    getContent: (e) => {
      const outDiv = document.createElement('div');
      const nodeName = e.item.getModel().name;
      let formatedNodeName = '';
      for (let i = 0; i < nodeName.length; i++) {
        formatedNodeName = `${formatedNodeName}${nodeName[i]}`;
        if (i !== 0 && i % 20 === 0) formatedNodeName = `${formatedNodeName}<br/>`;
      }
      outDiv.innerHTML = `${formatedNodeName}`;
      return outDiv;
    },
    shouldBegin: (e) => {
      if (e.target.get('name') === 'name-shape') return true;
      return false;
    },
  });
  graph = new G6.TreeGraph({
    container: container,
    width,
    height,
    ...configRes,
    ...config,
    plugins: [tooltip],
  });
  if (typeof onInit === 'function') {
    onInit(graph);
  }
  graph.data(data);
  graph.render();
  graph.zoom(config.defaultZoom || 1);

  // 点击收缩节点
  const handleCollapse = (e) => {
    const target = e.target;
    const id = target.get('modelId');
    const item = graph.findById(id);
    const nodeModel = item.getModel();
    nodeModel.collapsed = !nodeModel.collapsed;
    graph.layout();
    graph.setItemState(item, 'collapse', nodeModel.collapsed);
  };
  graph.on('collapse-text:click', (e) => {
    handleCollapse(e);
  });
  graph.on('collapse-back:click', (e) => {
    handleCollapse(e);
  }); 
  return graph
};
