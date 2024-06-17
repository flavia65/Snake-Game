const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d") //ctx == contexto

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const playButton = document.querySelector(".btn-play")

/* ctx.fillStyle = "green"
ctx.fillRect(300, 300, 50, 50) //x: 300, y: 300, largura, altura. Tamanho definido do canvas: 600, 600 */

const size = 30

const audio = new Audio('../midias/audio.mp3')
const gameOverAudio = new Audio('../midias/game-over-audio.mp3')


const initialPosition = { x: 240, y: 300 }


let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = parseInt(score.innerHTML) + 10 //poderia só por um + na frente de score
}

//criar números em um intervalo de max e min
const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min)
}

//necessario para ficar certo no grid. Apenas multiplos de 30
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction
let loopID

const drawFood = () => {
    const { x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0 //evitar que afete outros elementos
}

const drawSnake = () => {
    ctx.fillStyle = "green"
    
    snake.forEach((position, index) => {

        if(index == snake.length - 1){
            ctx.fillStyle = "#067003"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    const head = snake[snake.length - 1] //ou snake.at(-1)
    if (!direction) return


    if (direction == "right"){
        snake.push({ x: head.x + size, y: head.y})
    }

    if (direction == "left"){
        snake.push({ x: head.x - size, y: head.y})
    }

    if (direction == "down"){
        snake.push({ x: head.x, y: head.y + size})
    }

    if (direction == "up"){
        snake.push({ x: head.x, y: head.y - size})
    }

   
    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919" //apenas preencher a linha e não a area

    for (let i = 30; i < canvas.width; i += 30) {
        //verticas
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()
        //horizontais
        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
    }

const checkEat = () => {
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        //para sumir a comida e aparecer uma nova aleatória
        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = 
        head.x < 0 || head.x > canvasLimit|| head.y < 0 || head.y > canvasLimit

    const selfCollision = 
        snake.find((position, index) => {
            return index < neckIndex && position.x == head.x && position.y == head.y
        })

    if (wallCollision || selfCollision){
        gameOver()
    }
}



const gameOver = () => {
    playAudioOnce()
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(5px)"
    
}
let audioPlayed = false

const playAudioOnce = () => {
    if (!audioPlayed) {
        gameOverAudio.play()
        audioPlayed = true
    }
}



const gameLoop = () => {
    clearTimeout(loopID)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    drawSnake()
    moveSnake()
    checkEat()
    checkCollision()

    loopID = setTimeout(() => {
        gameLoop()
    }, 300)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    switch(key){
        case "ArrowRight":
            if(direction !== "left") direction = "right"
            break
        case "ArrowLeft":
            if(direction !== "right") direction = "left"
            break
        case "ArrowDown":
            if(direction !== "up") direction = "down"
            break
        case "ArrowUp":
            if(direction !== "down") direction = "up"
            break
    }
})



playButton.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    direction = undefined
    
    
    snake = [initialPosition]
    audioPlayed = false
})



