const { snapToGrid } = require('./dist/index')

test('correctly snaps two nodes', () => {
  const nodes = [
    { x: 95, y: 75, id: 'a' },
    { x: 5, y: 25, id: 'b' },
  ]
  snapToGrid(nodes, [100, 100], 100, 100)

  expect(JSON.stringify(nodes[0].cellCoords)).toBe(JSON.stringify([95, 75]))
  expect(JSON.stringify(nodes[1].cellCoords)).toBe(JSON.stringify([5, 25]))
})
