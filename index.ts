import { Node, Cell, Grid, Shape, Cache } from './types'

const MAX_ITERS = 50

export function generateGrid(columns: number, rows: number): Grid {
  const grid: Grid = []
  for (let column = 0; column < columns; column++) {
    const gridColumn = []
    for (let row = 0; row < rows; row++) {
      gridColumn.push({ column, row })
    }
    grid.push(gridColumn)
  }
  return grid
}

/**
 * Returns the relative positions of all cells that are
 * at a specific radius from a single cell, using integer
 * radiuses that won't overlap. Caches results because
 * since this branch should be optimizing, it seemed like
 * the best thing to do.
 * @param iter radius length
 */
function getCellsAtIteration(iter: number, cache: Cache): number[][] {
  const cached = cache[iter]
  if (cached) return cached
  const squaredIter = iter * iter
  const previousSquaredIter = (iter - 1) * (iter - 1)
  const validCells = []
  for (let i = -iter; i <= iter; i++) {
    const squaredI = i * i
    for (let j = -iter; j <= iter; j++) {
      const distance = squaredI + j * j
      if (distance > squaredIter) continue
      // too far for this round
      if (distance <= previousSquaredIter) continue
      // already part of previous round
      const couple = [i, j]
      validCells.push(couple)
    }
  }
  cache[iter] = validCells
  return validCells
}

function getGridCell(grid: Cell[][], cell: number[]): Cell | null {
  const column = grid[cell[0]]
  if (!column) return null
  return column[cell[1]] || null
}

function snapNodeToGrid(node: Node, grid: Grid, cellWidth: number, cellHeight: number) {
  const cache = [[[0, 0]]] as Cache
  let iter = 0
  // let bestDistance = Infinity
  const nodeCol = Math.floor(node.x / cellWidth)
  const nodeRow = Math.floor(node.y / cellHeight)
  outer: while (!node.cellCoords && iter < MAX_ITERS) {
    const deltasToCheck = getCellsAtIteration(iter, cache)
    for (const delta of deltasToCheck) {
      const cellCoords = [nodeCol + delta[0], nodeRow + delta[1]]
      const cell = getGridCell(grid, cellCoords)
      if (!cell || cell.nodeId) continue
      // since every cell in the same iteration are approximatively
      // at the same distance from the center cell (~±1 cell size)
      // if we feel like being imprecies is enough, any free cell
      // in an iteration works fine, so the first one will be good
      node.cellCoords = [cell.column, cell.row]
      break outer
      // if we feel like being precise (type: never) then we need to
      // find the closest cell in the iteration
      // const distance = getDistance(node, cell)
      // if (distance > bestDistance) continue
      // bestDistance = distance
      // bestCell = cell
    }
    iter += 1
  }
  if (!node.cellCoords) return
  grid[node.cellCoords[0]][node.cellCoords[1]].nodeId = node.id
}

/**
 * Snaps an ordered list of nodes in a grid: looks for the cell of the grid
 * where each node is, then if it's occupied looks for all the cells around it
 * at growing distance (euclidean) until finds an empty one. Requires the
 * array of sorted nodes and a grid or the shape of a new grid.
 * @param nodes
 * @param gridOrShape
 * @param gridWidth
 * @param gridHeight
 */
export function snapToGrid(nodes: Node[], shape: Shape, width: number, height: number): Grid {
  const grid = generateGrid(shape[0], shape[1])
  const cellWidth = width / grid.length
  const cellHeight = height / grid[0].length
  for (const node of nodes) {
    snapNodeToGrid(node, grid, cellWidth, cellHeight)
  }
  return grid
}
