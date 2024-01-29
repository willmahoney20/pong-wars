const colorPalette = {
    red: '#ef233c',
    white: '#fff'
}

const canvas = document.getElementById('pongCanvas')
const ctx = canvas.getContext('2d')
const score = document.getElementById('score')

// calculate the size of the canvas, based on the screen size
const screenWidth = window.innerWidth
let canvasSize = screenWidth >= 800 ? 600 : Math.floor(screenWidth * 0.75 / 50) * 50

// set the width and height of the canvas
canvas.width = canvasSize
canvas.height = canvasSize

const squareSize = 25

// calculate how many squares fit in the canvase
const numSquares = Math.floor(canvasSize / squareSize)

let squares = [] // an array for keeping track of the squares colors

const white = colorPalette.white
const red = colorPalette.red

// draw the initial squares
for(let x = 0; x < numSquares; x++){
    squares[x] = []
    for(let y = 0; y < numSquares; y++){
        squares[x][y] = x < numSquares / 2 ? white : red
    }
}

// ball properties
const ballRadius = squareSize / 2
let x1 = canvasSize * 0.25 // x position of ball 1
let y1 = canvasSize / 2 // y position of ball 1
let dx1 = 0.75 * ballRadius // the change in the x position of ball 1
let dy1 = -(0.75 * ballRadius) // the change in the y position of ball 1

let x2 = canvasSize * 0.75 // x position of ball 2
let y2 = canvasSize / 2 // y position of ball 2
let dx2 = -(0.75 * ballRadius) // the change in the x position of ball 2
let dy2 = 0.75 * ballRadius // the change in the y position of ball 2

// function for drawing the squares on the canvas
const drawSquares = () => {
    for(let x = 0; x < numSquares; x++){
        for(let y = 0; y < numSquares; y++){
            ctx.fillStyle = squares[x][y]
            ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize)
        }
    }
}

// funciton for adding the ball to each side
const drawBall = (x, y, color) => {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
}

// function for checking if the ball has collided with the edges of its space
const checkEdgeCollision = (x, y, dx, dy, color) => {
    // x and y are the cooridnates of the center of the ball
    let newDx = dx
    let newDy = dy

    const degreesInterval = 30
    for(let degrees = 0; degrees < 360; degrees += degreesInterval){
        // calculate the coordinates of the ball for every degreesInterval
        let radians = degrees * Math.PI / 180
        let circX = x + ballRadius * Math.sin(radians)
        let circY = y - ballRadius * Math.cos(radians)
        
        let squareX = Math.floor(circX / squareSize)
        let squareY = Math.floor(circY / squareSize)

        if(squareX >=0 && squareX < numSquares && squareY >= 0 && squareY < numSquares){
            if(squares[squareX][squareY] !== color){
                squares[squareX][squareY] = color

                // check collision direction and reverse velocity accordingly
                if(squareX !== Math.floor(x / squareSize)){
                    newDx = -dx // Reverse x direction if collision is horizontal
                }
                if(squareY !== Math.floor(y / squareSize)){
                    newDy = -dy // Reverse y direction if collision is vertical
                }

                // add random numbers to prevent the game from getting stuck in a loop
                newDx += Math.random() * 0.5 - 0.25
                newDy += Math.random() * 0.5 - 0.25
            }
        }
    }

    return { dx: newDx, dy: newDy }
}

const updateScore = () => {
    red_count = 0
    white_count = 0

    for(let x = 0; x < squares.length; x++){
        for(let y = 0; y < squares[x].length; y++){
            if(squares[x][y] === red){
                red_count++
            } else if(squares[x][y] === white) {
                white_count++
            }
        }
    }

    score.textContent = `white ${white_count} | red ${red_count}`
}

const drawCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawSquares()

    drawBall(x1, y1, red)
    const bounce1 = checkEdgeCollision(x1, y1, dx1, dy1, white)
    dx1 = bounce1.dx
    dy1 = bounce1.dy

    drawBall(x2, y2, white)
    const bounce2 = checkEdgeCollision(x2, y2, dx2, dy2, red)
    dx2 = bounce2.dx
    dy2 = bounce2.dy

    // check for collisions
    if(x1 + dx1 > canvas.width - ballRadius || x1 + dx1 < ballRadius) dx1 = -dx1
    if(y1 + dy1 > canvas.width - ballRadius || y1 + dy1 < ballRadius) dy1 = -dy1

    if(x2 + dx2 > canvas.width - ballRadius || x2 + dx2 < ballRadius) dx2 = -dx2
    if(y2 + dy2 > canvas.width - ballRadius || y2 + dy2 < ballRadius) dy2 = -dy2

    // Update ball position
    x1 += dx1
    y1 += dy1
    x2 += dx2
    y2 += dy2

    updateScore()

    requestAnimationFrame(drawCanvas) // request to do this again ASAP
}

drawCanvas()