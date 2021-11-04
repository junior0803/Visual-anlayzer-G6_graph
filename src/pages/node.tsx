import React from 'react';
import 'antd/dist/antd.css';
import * as G6 from '@antv/g6';
import insertCss from 'insert-css';
import { MyNodeModelConfig } from '../customG6';

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


function refreshDrageNodePosition(e : G6.IG6GraphEvent) {
    const model = e.item!.get('model');
    model.x = e.x;
    model.y = e.y;
}

export type NodeProp = {
  graphdata: G6.GraphData,
}

export type NodeModel = {
  model : MyNodeModelConfig,
}

export function NodeSample({graphdata}: NodeProp){
    const ref = React.useRef(null);
  
  
    React.useEffect(() => {
      const { nodes, edges } = graphdata;

        const graph = new G6.Graph({
            container: ref.current!,
            width:1600,
            height:900,
            fitView: true,
            layout: {
              type: 'gForce',
              center: [600, 400], // The center of the graph by default
              linkDistance: 1,
              nodeStrength: 1000,
              edgeStrength: 200,             
              workerEnabled: true, // Whether to activate web-worker
            },
            defaultEdge: {
                type:"default-line",
                
            },
            modes: {
                default: [
                    'drag-canvas', 
                    'drag-node', 
                    'drag-combo', 
                    'collapse-expand-combo',
                    {
                        type: 'tooltip',
                        formatText({model} :NodeModel) {
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
              
            nodeStateStyles: {
                active: {
                    fill: '#c5f567',
                    stroke: '#c5f567',
                },
            },
            defaultCombo: {
              type: 'circle',
              /* style for the keyShape */
               style: {
                 lineWidth: 1,
               },
              labelCfg: {
                /* label's offset to the keyShape */
                // refY: 10,
                /* label's position, options: center, top, bottom, left, right */
                position: 'top',
                /* label's style */
                 style: {
                   fontSize: 18,
               },
              },
          },
          });
    
        // randomize the node size
        nodes!.forEach((node) => {
            node.label = node.id
        });
        graph.data({
            nodes,
            edges: edges!.map(function (edge, i) {
            edge.id = 'edge' + i;
            return Object.assign({}, edge);
            }),
        });
        graph.render();
  
  
      const clearFocusItemState = (graph: G6.IGraph) => {
          if (!graph) return;
          clearFocusNodeState(graph);
          clearFocusEdgeState(graph);
        };
        
        // Clear the focus state and corresponding style of all nodes on the graph
        const clearFocusNodeState = (graph: G6.IGraph) => {
          const focusNodes = graph.findAllByState('node', 'selected');
          focusNodes.forEach((fnode) => {
            graph.setItemState(fnode, 'selected', false); // false
          });
        };
        
        // Clear the focus state and corresponding styles of all edges on the graph
        const clearFocusEdgeState = (graph: G6.IGraph) => {
          const focusEdges = graph.findAllByState('edge', 'selected');
          focusEdges.forEach((fedge) => {
            graph.setItemState(fedge, 'selected', false);
            graph.updateItem(fedge, {
              type:'default-line',
            });
          });
        };
      // node active
      graph.on('node:mouseenter', (e: G6.IG6GraphEvent) => {
          graph.getNodes().forEach((node) => {
            graph.setItemState(node, 'active', false);
          });
          graph.setItemState(e.item!, 'active', true);
        });
        
      graph.on('node:mouseleave', (e: G6.IG6GraphEvent) => {
        graph.setItemState(e.item!, 'active', false);
      });
        
      graph.on('node:click', (e : G6.IG6GraphEvent) => {
        clearFocusItemState(graph);
        graph.setItemState(e.item!, 'selected', true);
        console.log(e);
        const relatedEdges = e.item!.getEdges();
        relatedEdges.forEach((edge:G6.Edge) => {
          graph.setItemState(edge, 'selected', true);
          console.log("node click")
          graph.updateItem(edge, {
            type:'active-line',
          });
       });

      });
        
      graph.on('canvas:click', (e) => {
        clearFocusItemState(graph);
        graph.getCombos().forEach((combo) => {
          graph.clearItemStates(combo);
        });
      });
  
      graph.on('node:dragstart', function (e) {
          graph.layout();
          refreshDrageNodePosition(e);
      });
      graph.on('node:drag', function (e) {
          refreshDrageNodePosition(e);
      });
  
      graph.on('node:dragend', function (e) {
        console.log('node:dragend')
        
    });

      //edge selection
      graph.on('edge:mouseenter', (evt) => {
        const { item } = evt;
        graph.setItemState(item!, 'active', true);
      });
      
      graph.on('edge:mouseleave', (evt) => {
        const { item } = evt;
        graph.setItemState(item!, 'active', false);
      });
      
      graph.on('edge:click', (evt) => {
        clearFocusItemState(graph);
        const { item } = evt;
        graph.setItemState(item!, 'selected', true);
        console.log("edge:click")
        graph.updateItem(item!, {
          type:'active-line',
        });
      });

      graph.on('combo:mouseenter', (evt) => {
        const { item } = evt;
        graph.setItemState(item!, 'active', true);
      });
      
      graph.on('combo:mouseleave', (evt) => {
        const { item } = evt;
        graph.setItemState(item!, 'active', false);
      });
      graph.on('combo:click', (evt) => {
        const { item } = evt;
        graph.setItemState(item!, 'selected', true);
      });

      //edge selection
      return () => {
        const { nodes, edges } = graphdata;

        nodes!.forEach((node) => {
            node.label = node.id
        });
        graph.changeData({
            nodes,
            edges: edges!.map(function (edge, i) {
            edge.id = 'edge' + i;
            return Object.assign({}, edge);
            }),
        });
      };
    });
  
    return <>
        <div ref={ref}></div>
    </>;
}
