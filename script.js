const $ = el => document.getElementById(el)

let canvas, context, cell, cellStroke, strokeWidth, cellBoundings

let areaSize = document.body.getBoundingClientRect()

let units = []

let cells = []

function gameOfLife() {

    canvas = $('area')

    //ширина и высота каждой клетки. количество клеток зависит от размера экрана и клетки.
    cell = 10
    cellStroke = "#8c8c8c"
    strokeWidth = 1
    cellBoundings = cell - strokeWidth * 2

    canvas.setAttribute('width', Math.floor(areaSize.width * 0.8 / cell) * cell)
    canvas.setAttribute('height', Math.floor(areaSize.height * 0.8 / cell) * cell)

    context = canvas.getContext('2d')


    function renderCells(size, color, stroke) {
        for (let x = 0; x < canvas.width; x += size) {
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
        }

        for (let y = 0; y < canvas.height; y += size) {
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
        }
        context.lineWidth = stroke
        context.strokeStyle = color
        context.stroke()

        let filledCellsByX = 0
        let stepDownByY = 0

        for (let c = 0; c < canvas.height / cell * canvas.width / cell; c++) {
            cells.push(`[${filledCellsByX * cell + strokeWidth}, ${stepDownByY * cell + strokeWidth}]`)
            filledCellsByX++
            if (filledCellsByX >= canvas.width / cell) {
                filledCellsByX = 0
                stepDownByY++
            }
        }

        $('all').textContent = canvas.height / cell * canvas.width / cell
        $('xDim').textContent = canvas.width / cell
        $('yDim').textContent = canvas.height / cell
    }

    canvas.addEventListener('click', evt => {
        let mouseX = Math.floor((evt.pageX - canvas.offsetLeft) / cell) * cell + strokeWidth,
            mouseY = Math.floor((evt.pageY - canvas.offsetTop) / cell) * cell + strokeWidth
        if (units.includes(`[${mouseX}, ${mouseY}]`)) {
            units.splice(units.indexOf(`[${mouseX}, ${mouseY}]`), 1)
            context.clearRect(mouseX, mouseY, cellBoundings, cellBoundings)
        } else {
            units.push(`[${mouseX}, ${mouseY}]`)
            context.fillRect(mouseX, mouseY, cellBoundings, cellBoundings)
        }
    })

    const getRandomCoordinate = multiplier => Math.floor(Math.random() * multiplier / cell) * cell + strokeWidth

    function renderRandomUnits() {
        removeUnits()
        let resultUnitArray = new Set()
        for (let i = 0; i <= canvas.height / cell * canvas.width / cell; i++) {
            if (!!Math.floor(Math.random() * 2)) {
                resultUnitArray.add(`[${getRandomCoordinate(canvas.width)}, ${getRandomCoordinate(canvas.height)}]`)
            }
        }
        resultUnitArray.forEach(unit => {
            let [x, y] = [JSON.parse(unit)[0], JSON.parse(unit)[1]]
            context.fillRect(x, y, cellBoundings, cellBoundings)
        })
        units = Array.from(resultUnitArray)
    }

    function removeUnits() {
        units.forEach(unit => {
            let [x, y] = [JSON.parse(unit)[0], JSON.parse(unit)[1]]
            context.clearRect(x, y, cellBoundings, cellBoundings)
        })
        clearInterval(() => calculateNextGeneration(), 100)
        units = []
    }

    $('generate').addEventListener('click', () => renderRandomUnits())
    $('clear').addEventListener('click', () => removeUnits())

    renderCells(cell, cellStroke, strokeWidth)

    let cellsCollection = new Set(cells)

    function checkNeighbour(dimension, step, canvasSide) {
        if ((dimension - step * cell).toFixed(1) <= 0) return canvasSide - cell + strokeWidth
        if ((dimension - step * cell).toFixed(1) >= canvasSide) return 0 + strokeWidth
        return +(dimension - step * cell).toFixed(1)
    }


    function calculateNextGeneration() {
        let unitsCollection = new Set(units)
        if (units.length) {
            for (let unit of cellsCollection) {
                let [x, y] = [JSON.parse(unit)[0], JSON.parse(unit)[1]]
                let countOfAliveNeighbours = 0, stepX = 1, stepY = 1
                for (let c = 0; c < 9; c++) {
                    if (stepX <= -2) {
                        stepX = 1
                        stepY--
                    }
                    if (c !== 4 && unitsCollection.has(`[${checkNeighbour(x, stepX, canvas.width)}, ${checkNeighbour(y, stepY, canvas.height)}]`)) {
                        countOfAliveNeighbours++
                    }
                    stepX--
                }

                if (!unitsCollection.has(unit) && countOfAliveNeighbours === 3) {
                    units.push(unit)
                    context.fillRect(x, y, cellBoundings, cellBoundings)
                }

                if (unitsCollection.has(unit) && (countOfAliveNeighbours < 2 || countOfAliveNeighbours > 3)) {
                    units.splice(units.indexOf(unit), 1)
                    context.clearRect(x, y, cellBoundings, cellBoundings)
                }
            }
        }
    }

    function startCalculating() {
        setInterval(() => calculateNextGeneration(), 100)
    }

    $('start').addEventListener('click', () => startCalculating())
}

gameOfLife()
