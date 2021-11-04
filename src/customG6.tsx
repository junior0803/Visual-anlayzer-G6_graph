import  * as G6 from '@antv/g6';
import { LabelStyle } from '@antv/g6';

export interface MyNodeModelConfig extends G6.NodeConfig {
    glyphs: {
        color: string,
        position: string,
        size: number
    },
    donut: {
        color: string,
        size: number
    },
}

const donutShape: G6.ShapeOptions = {
    draw(cfg, group) {
        const mycfg = cfg as MyNodeModelConfig;

        let  r = Number(cfg!.size!)/2;
        const { style, color, donut, img, glyphs } = mycfg;

        // halo for hover
        group!.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: r + 5,
                fill: '#29870c',
                opacity: 0.9,
                lineWidth: 0,
            },
            name: 'halo-shape',
            visible: false,
        });
  
        // focus stroke for hover
        group!.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: r + 5,
                fill:'#a81d5b',
                stroke: '#fff',
                strokeOpacity: 0.85,
                lineWidth: 1,
            },
            name: 'stroke-shape',
            visible: false,
        });
  
      
        group!.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: r + donut.size,
                fill: donut.color,
                lineWidth: 0.5,
                stroke: '#FFFFFF',
            },
            name: 'border-radius',
        });
    
        //ping android begin
        group!.addShape('circle', {
            attrs: {
            x: 0,
            y: 0,
            r: r + donut.size,
            fill: donut.color,
            lineWidth: 0.5,
            stroke: '#FFFFFF',
            },
            name: 'ping-radius',
        });
        //ping android end
    
        group!.addShape('circle', {
            attrs: {
            ...style,
            x: 0,
            y: 0,
            r,
            fill: color,
            stroke: '#ffffff',
            lineWidth: 1,
            cursor: 'pointer',
            },
            name: 'aggregated-node-keyShape',
        });
  
        const keyShape = group!.addShape('image', {
            attrs: {
                ...style,
                x: -r,
                y: -r,
                r,
                img:img,
                cursor: 'pointer',
                width: 2*r,
                height: 2*r,
            },
            name: 'image-node',
        });
    
        if (!!mycfg.label) {
            const text = cfg!.label;
            let labelStyle: LabelStyle = {};
            let refY = 0;
            if (mycfg.labelCfg) {
            labelStyle = Object.assign(labelStyle, mycfg.labelCfg.style);
            refY += mycfg.labelCfg.refY || 0;
            }
            let offsetY = 0;
            const fontSize = (labelStyle.fontSize ?? 0) < 10 ? 10 : labelStyle.fontSize;
            const lineNum = 1;
            offsetY = lineNum * (fontSize || 12);
            group!.addShape('text', {
                attrs: {
                    text,
                    x: 0,
                    y: r + refY + offsetY + 5,
                    textAlign: 'center',
                    textBaseLine: 'alphabetic',
                    cursor: 'pointer',
                    fontSize,
                    fill: '#473837',
                    opacity: 0.85,
                    fontWeight: 400,
                    stroke: '#473837',
                },
                name: 'text-shape',
                className: 'text-shape',
            });
        }
        // tag for new node
      
        group!.addShape('circle', {
            attrs: {
                x: r + glyphs.size/2,
                y: 0,
                r: glyphs.size,
                fill: glyphs.color,
                lineWidth: 0.5,
                stroke: '#FFFFFF',
            },
            name: 'typeNode-tag-circle',
        });
      
        return keyShape;
    },
  
    setState(name, value, item) {
        const group = item!.get<G6.IGroup>('group');
        const border = group.find((e) => e.get('name') === 'border-radius')
        const radius = border.attr('r');
        if (name === 'layoutEnd' && value) {
            const labelShape = group.find((e) => e.get('name') === 'text-shape');
        
        if (border) border.set('visible', true);
        if (labelShape) labelShape.set('visible', true);
        } else if (name === 'hover') {
            if (item!.hasState('active')) {
            return
            }
        } else if (name === 'active') {
            const label = group.find((e) => e.get('name') === 'text-shape');
            if (value) {
            label && label.attr('fontWeight', 800);
            } else {       
            label && label.attr('fontWeight', 400);
            }
        } else if (name === 'selected') {
            const stroke = group.find((e) => e.get('name') === 'stroke-shape');
            const label = group.find((e) => e.get('name') === 'text-shape');
            const ping = group.find((e) => e.get('name') === 'ping-radius')
            console.log(radius);
        if (value) {
            stroke && stroke.show();
            border && border.hide();
            label && label.attr('fontWeight', 800);
            // ping animation begin
            ping && ping.animate(
                {
                // Magnifying and disappearing
                r: radius + 15,
                opacity: 0,
                },
                {
                duration: 500,
                easing: 'easeCubic',
                delay: 0,
                repeat: false, // repeat
                },
            ); // no delay
            // ping animation stop
        } else {
            stroke && stroke.hide();
            border && border.show();
            // ping animation begin
            ping && ping.stopAnimate();   
            ping.attr('opacity', 1)
            ping.attr('r', radius)
            // ping animation stop
            label && label.attr('fontWeight', 400);
        }
      }
    },
    update: undefined,
}

const defaultLine: G6.EdgeConfig = {
    options:{
        style: {
        stroke: '#ccc',
        }
    },
    labelAutoRotate: true,
    
    draw(cfg?: G6.ModelConfig, group?: G6.IGroup) {
        const { startPoint, endPoint, color: stroke } = cfg!;
        const lineWidth = Number(cfg!.size);

        const shape = group!.addShape('path', {
            attrs: {
                stroke,
                lineWidth,
                path: [
                    ['M', startPoint!.x, startPoint!.y],
                    ['L', endPoint!.x, endPoint!.y],
                ],
                startArrow: {
                    path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
                    fill: stroke,
                },
                endArrow: {
                    path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
                    fill: stroke,
                },
            },
            name: 'path-shape',
        });        
        
        // return the keyShape
        return shape;
    },
}

const activeLine: G6.EdgeConfig = {
    labelAutoRotate: true,

    draw(cfg?: G6.ModelConfig, group?: G6.IGroup) {
        const {startPoint, endPoint} = cfg!;
        const lineWidth = Number(cfg!.size)
        const shape = group!.addShape('path', {
            attrs: {
                lineWidth,
                path: [
                    ['M', startPoint!.x, startPoint!.y],
                    ['L', endPoint!.x, endPoint!.y],
                ],
                startArrow: {
                    path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
                    fill: '#e01032',
                },
                endArrow: {
                    path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
                    fill: '#e01032',
                },
            },
            name: 'path-shape',
        });        
      
      // return the keyShape
      return shape;
    },
    afterDraw(cfg?: G6.EdgeConfig, group?:G6.IGroup){
        const shape = group!.get('children')[0]
        const sPoint = shape.getPoint(0.15)
        const midPoint = shape.getPoint(0.5)
        const ePoint = shape.getPoint(0.85)

        group!.addShape('circle',{
            attrs: {
                r:8,
                fill:'#e01032',
                x: midPoint.x,
                y: midPoint.y,
            },
            name:"midpoint"
        })

        // the left label
        group!.addShape('text', {
            attrs: {
                text: 'start',
                fill: '#595959',
                textAlign: 'start',
                textBaseline: 'middle',
                x: sPoint.x,
                y: sPoint.y - 10,
            },
            name: 'left-text-shape',
        });
      
        // the right label
        group!.addShape('text', {
            attrs: {
                text: 'end',
                fill: '#595959',
                textAlign: 'end',
                textBaseline: 'middle',
                x: ePoint.x,
                y: ePoint.y - 10,
            },
            name: 'right-text-shape',
        });

        const label = `${cfg!.source}-${cfg!.target}`; 
        // the right label
        group!.addShape('text', {
            attrs: {
                text: label,
                fill: '#595959',
                textAlign: 'end',
                textBaseline: 'middle',
                x: midPoint.x,
                y: midPoint.y - 5,
            },
            name: 'middle-text-shape',
        });
    },
    update: undefined,
}

export function initialize() {
  G6.registerNode('real-node', donutShape, 'aggregated-node');

  G6.registerEdge('default-line', defaultLine, 'single-edge');
  
  G6.registerEdge('active-line', activeLine, 'single-edge');
}
