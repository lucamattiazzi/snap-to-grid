export interface Point {
  x: number
  y: number
}

export interface Node extends Point {
  id: string
  cellCoords?: number[]
}

export interface Cell extends Point {
  row: number
  column: number
  nodeId: string | null
}

export interface Grid extends Array<Array<Cell>> {}

export interface Shape extends Array<number> {}

export interface Cache extends Array<Array<Array<number>>> {}
