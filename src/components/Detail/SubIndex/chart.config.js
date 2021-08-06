
import G6 from '@antv/g6'
import { fittingString } from '../../../utils/assetRequest.js'
import winDown from '../../../../public/images/winDown.png'
import winUp  from '../../../../public/images/winUp.png'
// import trendUnchange2 from '../../../../public/images/marketPerspectiveUnchang2.png'
import relationAdd from '../../../../public/images/relationAdd.png'
import relationSub from '../../../../public/images/relationSub.png'

G6.registerNode(
  'dom-node',
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
          text: fittingString(cfg.name, 150, 14),
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
            y: bbox.minY,
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
            y: bbox.minY,
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

// 指标驱动关系
export const getTreeChart = (width, height, dataList = []) => {
  const graph = new G6.TreeGraph({
    container: 'subIndexChart',
    width: width,
    height,
    fitView: true,
    fitCenter: true,
    // renderer: 'svg',
    defaultNode: {
      type: 'dom-node',
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
        return 20;
      },
      getHGap: function getHGap() {
        return 115;
      },
    }
  })
  graph.data(dataList)
  return graph
}
