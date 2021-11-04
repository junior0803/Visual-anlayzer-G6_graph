import React from 'react';
import 'antd/dist/antd.css';
import G6 from '@antv/g6';
import insertCss from 'insert-css';


insertCss(`
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);

function refreshDrageNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
}



function scaleNodeProp(nodes, propName, refPropName, dataRange, outRange) {
    const outLength = outRange[1] - outRange[0];
    const dataLength = dataRange[1] - dataRange[0];
    nodes.forEach((n) => {
        n[propName] = ((n[refPropName] - dataRange[0]) * outLength) / dataLength + outRange[0];
    });
}


const DegreeGraph = (props) => {
  const ref = React.useRef(null);

  console.log('degree')

  React.useEffect(() => {
    const graph = new G6.Graph({
        container: ref.current,
        width:1600,
        height:900,
        fitView: true,
        fitpadding: [20, 20, 40, 30],
        layout: {
            type: 'default',
            linkDistance: 300,
            nodeStrength: -100,
            edgeStrength: 0.1,
            //gpuEnabled: true     // Whether to enable the GPU parallel computing, supported by G6 4.0,
            // type: 'fruchterman',
            // maxIteration: 300,
            // gravity: 10,
            // speed: 5,
            // clustering: true,
        },
        defaultEdge: {
            type:"default-degree-line",
            
        },
        modes: {
            default: [
                'drag-canvas', 
                'drag-node', 
                'drag-combo', 
                'collapse-expand-combo',
                {
                    type: 'tooltip',
                    formatText(model) {
                        const text = `<p align="left">
                        id : ${model.id} <br/>
                        color : ${model.color} <br/>
                        size : ${model.size} <br/>
                        x : ${model.x} <br/>
                        y : ${model.y} <br/>
                        label : ${model.label} <br/>
                        degree : ${model.degree} <br/>
                        dount : <br/>
                            { <br/>
                                &nbsp;&nbsp;size: ${model['donut'].size} <br/>
                                &nbsp;&nbsp;color: ${model['donut'].color} <br/>
                            } </br>
                        glyphs : <br/>
                        { <br/>
                            &nbsp;&nbsp;size: ${model['glyphs'].color} <br/>
                            &nbsp;&nbsp;color: ${model['glyphs'].size} <br/>
                            &nbsp;&nbsp;color: ${model['glyphs'].position} <br/>
                        }
                        </p>
                        `;
                        return text;
                    },
                    shouldUpdate: (e) => true,
                },
            ],

        },
        
        
        defaultNode: {
            type: 'real-node',
            labelCfg: {
                style:{
                fill: '#000000',
                fontSize: 8,
                
                },
                position: 'bottom',
            },
        },
        defaultCombo: {
            type: 'circle',
            /* style for the keyShape */
            // style: {
            //   lineWidth: 1,
            // },
            labelCfg: {
              /* label's offset to the keyShape */
              // refY: 10,
              /* label's position, options: center, top, bottom, left, right */
              position: 'top',
              /* label's style */
              // style: {
              //   fontSize: 18,
              // },
            },
        },
        nodeStateStyles: {
            active: {
                fill: '#c5f567',
                stroke: '#c5f567',
            },
        },
    });

      const data = props.data

      const nodes = data.nodes;
      const edges = data.edges;
      nodes.forEach((n) => {
        //n.y = -n.y;
        n.degree = 0;
        n.inDegree = 0;
        n.outDegree = 0;
      });
      // compute the degree of each node
      const nodeIdMap = new Map();
      nodes.forEach((node) => {
        node.label = node.id
        nodeIdMap.set(node.id, node);
      });
      edges.forEach((e) => {
        const source = nodeIdMap.get(e.source);
        const target = nodeIdMap.get(e.target);
        source.outDegree++;
        target.inDegree++;
        source.degree++;
        target.degree++;
      });
      let maxDegree = -9999;
      let minDegree = 9999;
      nodes.forEach((n) => {
        if (maxDegree < n.degree) maxDegree = n.degree;
        if (minDegree > n.degree) minDegree = n.degree;
      });
      const sizeRange = [10, 70];
      const sizeDataRange = [minDegree, maxDegree];
      scaleNodeProp(nodes, 'size', 'degree', sizeDataRange, sizeRange);

    graph.data({
        nodes,
        edges: props.data.edges.map(function (edge, i) {
        edge.id = 'edge' + i;
        return Object.assign({}, edge);
        }),
    });
    graph.render();

    // setTimeout(()=>{
    //     graph.updateLayout('default')
    // }, 1500)

    const clearFocusItemState = (graph) => {
        if (!graph) return;
        clearFocusNodeState(graph);
        clearFocusEdgeState(graph);
      };
      
      // Clear the focus state and corresponding style of all nodes on the graph
      const clearFocusNodeState = (graph) => {
        const focusNodes = graph.findAllByState('node', 'selected');
        focusNodes.forEach((fnode) => {
          graph.setItemState(fnode, 'selected', false); // false
        });
      };
      
      // Clear the focus state and corresponding styles of all edges on the graph
      const clearFocusEdgeState = (graph) => {
        const focusEdges = graph.findAllByState('edge', 'selected');
        focusEdges.forEach((fedge) => {
          graph.setItemState(fedge, 'selected', false);
          graph.updateItem(fedge, {
            type:'default-degree-line',
          });
        });
      };


    // node active
    graph.on('node:mouseenter', (e) => {
        graph.getNodes().forEach((node) => {
          graph.setItemState(node, 'active', false);
        });
        graph.setItemState(e.item, 'active', true);
      });
      
    graph.on('node:mouseleave', (e) => {
      graph.setItemState(e.item, 'active', false);
    });
      
    graph.on('node:click', (e) => {
      clearFocusItemState(graph);
      graph.setItemState(e.item, 'selected', true);
      
      // Also highlight the relevant edges
      const relatedEdges = e.item.getEdges();
      relatedEdges.forEach((edge) => {
        graph.setItemState(edge, 'selected', true);
        graph.updateItem(edge, {
          type:'active-degree-line',
        });
     });

    });
      
    graph.on('canvas:click', (e) => {
      clearFocusItemState(graph);
    });

    graph.on('node:dragstart', function (e) {
        graph.layout();
        refreshDrageNodePosition(e);
    });
    graph.on('node:drag', function (e) {
        //const forceLayout = graph.get('layoutController').layoutMethods[0];
        //forceLayout.execute();
        refreshDrageNodePosition(e);
    });

    //edge selection
    graph.on('edge:mouseenter', (evt) => {
      const { item } = evt;
      graph.setItemState(item, 'active', true);
    });
    
    graph.on('edge:mouseleave', (evt) => {
      const { item } = evt;
      graph.setItemState(item, 'active', false);
    });
    
    graph.on('edge:click', (evt) => {
      clearFocusItemState(graph);
      const { item } = evt;
      graph.setItemState(item, 'selected', true);
      graph.updateItem(item, {
        type:'active-degree-line',
      });
    });
    //edge selection
    return () => {
        graph.changeData(props.data);
    };
  });

  return <>
      <div ref={ref}></div>
  </>;
}

export default DegreeGraph