import { Node, Grid, Shape } from './types';
export declare function generateGrid(columns: number, rows: number): Grid;
export declare function snapToGrid(nodes: Node[], shape: Shape, width: number, height: number): Grid;
