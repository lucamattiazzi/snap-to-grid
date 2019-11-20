"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MAX_ITERS = 50;
function generateGrid(columns, rows) {
    const grid = [];
    for (let column = 0; column < columns; column++) {
        const gridColumn = [];
        for (let row = 0; row < rows; row++) {
            gridColumn.push({ column, row });
        }
        grid.push(gridColumn);
    }
    return grid;
}
exports.generateGrid = generateGrid;
function getCellsAtIteration(iter, cache) {
    const cached = cache[iter];
    if (cached)
        return cached;
    const squaredIter = iter * iter;
    const previousSquaredIter = (iter - 1) * (iter - 1);
    const validCells = [];
    for (let i = -iter; i <= iter; i++) {
        const squaredI = i * i;
        for (let j = -iter; j <= iter; j++) {
            const distance = squaredI + j * j;
            if (distance > squaredIter)
                continue;
            if (distance <= previousSquaredIter)
                continue;
            const couple = [i, j];
            validCells.push(couple);
        }
    }
    cache[iter] = validCells;
    return validCells;
}
function getGridCell(grid, cell) {
    const column = grid[cell[0]];
    if (!column)
        return null;
    return column[cell[1]] || null;
}
function snapNodeToGrid(node, grid, cellWidth, cellHeight) {
    const cache = [[[0, 0]]];
    let iter = 0;
    const nodeCol = Math.floor(node.x / cellWidth);
    const nodeRow = Math.floor(node.y / cellHeight);
    outer: while (!node.cellCoords && iter < MAX_ITERS) {
        const deltasToCheck = getCellsAtIteration(iter, cache);
        for (const delta of deltasToCheck) {
            const cellCoords = [nodeCol + delta[0], nodeRow + delta[1]];
            const cell = getGridCell(grid, cellCoords);
            if (!cell || cell.nodeId)
                continue;
            node.cellCoords = [cell.column, cell.row];
            break outer;
        }
        iter += 1;
    }
    if (!node.cellCoords)
        return;
    grid[node.cellCoords[0]][node.cellCoords[1]].nodeId = node.id;
}
function snapToGrid(nodes, shape, width, height) {
    const grid = generateGrid(shape[0], shape[1]);
    const cellWidth = width / grid.length;
    const cellHeight = height / grid[0].length;
    for (const node of nodes) {
        snapNodeToGrid(node, grid, cellWidth, cellHeight);
    }
    return grid;
}
exports.snapToGrid = snapToGrid;
