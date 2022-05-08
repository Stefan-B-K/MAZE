const maze = (mazeSize) => {

  const wallColor = 'darkCyan'
  const playerSpeed = 5

  const width = window.innerWidth
  const height = window.innerHeight
  
  let cellSizeX; let cellSizeY
  let mazeRows = mazeSize; let mazeColumns = mazeSize
  if (width >= height) {
    cellSizeY = height / mazeSize
    mazeColumns = Math.floor(width / cellSizeY)
    cellSizeX = width / mazeColumns
  } else {
    cellSizeX = width / mazeSize
    mazeRows = Math.floor(height / cellSizeX)
    cellSizeY = height / mazeRows
  }
  const cellSize = Math.min(cellSizeX, cellSizeY)
  const wallThickness = cellSize * 0.1
  
  const { World, Engine, Runner, Render, Bodies, Body, Mouse, MouseConstraint, Events } = Matter
  const engine = Engine.create()
  engine.gravity.y = 0.1
  const { world } = engine
  const render = Render.create({
    element: document.body,                      // element to create canvas in
    engine: engine,
    options: { width, height, wireframes: false }
  })

  Render.run(render)
  Runner.run(Runner.create(), engine)




  const frame = [
    Bodies.rectangle(width / 2, 0, width, wallThickness * 2,
      {
        isStatic: true,
        label: 'frame',
        render: { fillStyle: wallColor }
      }),
    Bodies.rectangle(width / 2, height, width, wallThickness * 2,
      {
        isStatic: true,
        label: 'frame',
        render: { fillStyle: wallColor }
      }),
    Bodies.rectangle(0, height / 2, wallThickness * 2, height,
      {
        isStatic: true,
        label: 'frame',
        render: { fillStyle: wallColor }
      }),
    Bodies.rectangle(width, height / 2, wallThickness * 2, height,
      {
        isStatic: true,
        label: 'frame',
        render: { fillStyle: wallColor }
      })
  ]
  World.add(world, frame)


  const grid = Array(mazeRows).fill()
    .map(() => (Array(mazeColumns).fill(false)))
  const verticals = Array(mazeColumns - 1).fill()
    .map(() => Array(mazeRows).fill(false))
  const horizontals = Array(mazeRows - 1).fill()
    .map(() => Array(mazeColumns).fill(false))

  const startRow = Math.floor(Math.random() * mazeRows)
  const startColumn = Math.floor(Math.random() * mazeColumns)

  const shuffle = (arr) => {
    return arr.sort(() => Math.random() - 0.5)
  }

  const stepToNextCell = (row, column) => {
    if (grid[row][column]) return
    grid[row][column] = true
    const neightbours = shuffle(
      [
        [row - 1, column], [row + 1, column], [row, column + 1], [row, column - 1]
      ]
    )
    if (neightbours.length === 0) return

    for (let neighbor of neightbours) {
      const [nextRow, nextColumn] = neighbor
      if (nextRow < 0 || nextRow >= mazeRows ||
        nextColumn < 0 || nextColumn >= mazeColumns) continue
      if (grid[nextRow][nextColumn]) continue
      if (nextRow === row) {
        verticals[nextColumn - column > 0 ? column : column - 1][row] = true
      } else if (nextColumn === column) {
        horizontals[nextRow - row > 0 ? row : row - 1][column] = true
      }
      stepToNextCell(nextRow, nextColumn)
    }
  }

  stepToNextCell(startRow, startColumn)

  horizontals.forEach((row, rowIndex) => {
    row.forEach((horizWall, columnIndex) => {
      if (horizWall) return
      const wall = Bodies.rectangle(cellSizeX * (columnIndex + 0.5), cellSizeY * (rowIndex + 1),
        cellSizeX + wallThickness * 0.5, wallThickness,
        {
          isStatic: true,
          render: { fillStyle: wallColor }
        })
      World.add(world, wall)
    })
  })
  verticals.forEach((column, columnIndex) => {
    column.forEach((vertWall, rowIndex) => {
      if (vertWall) return
      const wall = Bodies.rectangle(cellSizeX * (columnIndex + 1), cellSizeY * (rowIndex + 0.5),
        wallThickness, cellSizeY + wallThickness * 0.5,
        {
          isStatic: true,
          render: { fillStyle: wallColor }
        })
      World.add(world, wall)
    })
  })


  const goal = [
    Bodies.circle(width - cellSizeX / 2, height - cellSizeY / 2, cellSize * 0.35,
      { isStatic: true, label: "goal", render: { fillStyle: 'red' } }),
    Bodies.circle(width - cellSizeX / 2, height - cellSizeY / 2, cellSize * 0.28,
      { isStatic: true, label: "goal", render: { fillStyle: 'white' } }),
    Bodies.circle(width - cellSizeX / 2, height - cellSizeY / 2, cellSize * 0.21,
      { isStatic: true, label: "goal", render: { fillStyle: 'red' } }),
    Bodies.circle(width - cellSizeX / 2, height - cellSizeY / 2, cellSize * 0.14,
      { isStatic: true, label: "goal", render: { fillStyle: 'white' } }),
    Bodies.circle(width - cellSizeX / 2, height - cellSizeY / 2, cellSize * 0.07,
      { isStatic: true, label: "goal", render: { fillStyle: 'red' } }),
  ]
  World.add(world, goal)


  const playerStats = {
    x: cellSizeX * 0.5,
    y: cellSizeY * 0.5,
    radius: cellSize * 0.3,
    velocity: { x: 0, y: 0 }
  }
  const player = Bodies.circle(playerStats.x, playerStats.y, playerStats.radius * 0.8,
    { render: { fillStyle: 'yellow' },
    friction: 1,
    frictionStatic: Infinity })
 
  World.add(world, player)
  
  
  document.addEventListener('keydown', event => {
    const { x, y } = player.velocity
    switch (event.code) {
      case 'KeyW': Body.setVelocity(player, { x, y: y - playerSpeed }); break;
      case 'KeyS': Body.setVelocity(player, { x, y: y + playerSpeed }); break;
      case 'KeyA': Body.setVelocity(player, { x: x - playerSpeed, y }); break;
      case 'KeyD': Body.setVelocity(player, { x: x + playerSpeed, y }); break;
    }
  })

  addSwipeGesture(document.body, 50, (direction) => {
    const { x, y } = player.velocity
    switch (direction) {
      case 'up': Body.setVelocity(player, { x, y: y - playerSpeed }); break;
      case 'down': Body.setVelocity(player, { x, y: y + playerSpeed }); break;
      case 'left': Body.setVelocity(player, { x: x - playerSpeed, y }); break;
      case 'right': Body.setVelocity(player, { x: x + playerSpeed, y }); break;
    }
  })

  Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
      if (collision.bodyA.label === goal[0].label || collision.bodyB.label === goal[0].label) {
        engine.gravity.y = 1
        world.bodies.forEach(body => {
          if (body.label != 'frame' && body.label != 'goal') Body.setStatic(body, false)
        })
        World.remove(world, goal)
        
        const winner = document.createElement('div')
        winner.innerHTML = '<button id="end">You Win!</button>'
        winner.classList.add('inputs')
        document.body.append(winner)
        winner.addEventListener('click', () => {
          location.reload()
        })
      }
    })
  })


}
