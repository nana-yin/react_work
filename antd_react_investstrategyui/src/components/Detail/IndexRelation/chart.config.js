/* eslint-disable */
import G6 from '@antv/g6'
import { fittingString } from '../../../utils/assetRequest.js'
import winDown from '../../../../public/images/winDown.png'
import winUp from '../../../../public/images/winUp.png'
import relationAdd from '../../../../public/images/relationAdd.png'
import relationSub from '../../../../public/images/relationSub.png'
import {colorMap, changNunToText} from '../../../utils/asset.js'
// 资产卡胜率的树图的节点的定义(只针对除了cta之外的资产进行绘制)
G6.registerNode(
  'tree-node',
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
      // const content = cfg.name.replace(/(.{19})/g, '$1\n');
      const text = group.addShape('text', {
        attrs: {
          text: fittingString(cfg.name, 180, 14),
          x: 0,
          y: 0,
          labelCfg: {
            position: 'center'
          },
          fontSize: 14,
          lineHeight: 20,
          textAlign: 'left',
          // textBaseline: 'middle',
          fill: '#666',
          cursor: 'pointer'
        },
        name: 'text-shape',
      });
      const bbox = text.getBBox();
      
      // 只给胜率的最后一层节点加上趋势
      if (cfg.img) {
        group.addShape('image', {
          attrs: {
            x: bbox.maxX + 10,
            y: bbox.maxY - 13,
            width: 14,
            height: 14,
            cursor: 'pointer',
            img: cfg.img > 0 ? winUp : cfg.img < 0 ? winDown : ''
          },
          name: 'image-shape',
          draggable: true
        })
      }
      // 给node添加驱动关系
      if (cfg.relation) {
        group.addShape('image', {
          attrs: {
            x: bbox.minX -25,
            y: bbox.maxY - 13,
            width: 14,
            height: 14,
            cursor: 'pointer',
            img: cfg.relation === '+' ? relationAdd : cfg.relation === '-' ? relationSub : ''
          },
          name: 'relation-shape',
          draggable: true
        })
      }
      rect.attr({
        x: cfg.img ? bbox.minX - 35 : bbox.minX - 12,
        y: bbox.minY - 10,
        width: cfg.img ? bbox.width + 73 : bbox.width + 24,
        height: bbox.height + 17,
      });
      return rect;
    }
  },
  'single-node',
)

// 资产卡胜率的树图的节点的定义(只针对cta进行绘制)
G6.registerNode(
  'cta-node',
  {
    drawShape: function drawShape(cfg, group) {
      const rect = group.addShape('rect', {
        attrs: {
          fill: '#f9fcff',
          stroke: '#d8e9ff',
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
      // console.log('1111', cfg.img)
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

// 盈亏比
G6.registerNode(
  'tree-node-loss',
  {
    drawShape: function drawShape(cfg, group) {
      const rect = group.addShape('rect', {
        attrs: {
          fill: '#fbfbfb',
          stroke: '#d4d4d4',
          radius: [4,4],
          cursor: 'pointer'
        },
        name: 'rect-shape-loss',
      });
      const text = group.addShape('text', {
        attrs: {
          text: fittingString(cfg.name, 150, 14),
          x: 0,
          y: 0,
          labelCfg: {
            position: 'center'
          },
          textAlign: 'left',
          fontSize: 14,
          fill: '#666',
          cursor: 'pointer'
        },
        name: 'rect-shape-loss',
      });
      const bbox = text.getBBox()
      rect.attr({
        x: bbox.minX - 12,
        y: bbox.minY -6,
        width:  bbox.width + 24,
        height: bbox.height + 12,
      });
      return rect;
    }
  },
  'single-node-loss',
)

// 指标驱动关系
export const getTreeChart = (width, height, dataList = [], dom, type) => {
  const graph = new G6.TreeGraph({
    container: dom,
    width: width,
    height,
    fitView: true,
    fitCenter: true,
    // renderer: 'svg',
    defaultNode: {
      type: dom === 'indicatorChart' ? 'tree-node-loss' : type === 'cta' ? 'cta-node' : 'tree-node',
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
      ],
    },
    defaultEdge: {
      type: 'cubic-horizontal',
      style: {
        stroke: '#eee',
      },
    },
    layout: {
      type: 'compactBox',
      direction: 'LR',
      getId: function getId(d) {
        return d.id;
      },
      getHeight: function getHeight() {
        return 16;
      },
      getVGap: function getVGap() {
        return 16;
      },
      getHGap: function getHGap() {
        return 120;
      },
    }
  })
  graph.data(dataList)
  return graph
}
