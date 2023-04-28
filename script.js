const $ = el => document.getElementById(el)

let canvas, context, cell, cellStroke, strokeWidth, cellBoundings

let areaSize = document.body.getBoundingClientRect()

let units = []

function gameOfLife() {

    canvas = $('area')

    canvas.setAttribute('width', Math.floor(areaSize.width * 0.8 / 100) * 100)
    canvas.setAttribute('height', Math.floor(areaSize.height * 0.8 / 100) * 100)

    context = canvas.getContext('2d')

    cell = 20
    cellStroke = "#8c8c8c"
    strokeWidth = .7
    cellBoundings = cell - strokeWidth * 2

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
        context.strokeStyle = color;
        context.stroke();
    }

    canvas.addEventListener('click', evt => {
        let mouseX = Math.floor((evt.pageX - canvas.offsetLeft) / cell) * cell + strokeWidth,
            mouseY = Math.floor((evt.pageY - canvas.offsetTop) / cell) * cell + strokeWidth
        console.log(mouseX, mouseY)
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
            let x = JSON.parse(unit)[0], y = JSON.parse(unit)[1]
            context.fillRect(x, y, cellBoundings, cellBoundings)
        })
        units = Array.from(resultUnitArray)
    }

    function removeUnits() {
        units.forEach(unit => {
            let x = JSON.parse(unit)[0], y = JSON.parse(unit)[1]
            context.clearRect(x, y, cellBoundings, cellBoundings)
        })
    }

    $('generate').addEventListener('click', () => renderRandomUnits())
    $('clear').addEventListener('click', () => removeUnits())

    renderCells(cell, cellStroke, strokeWidth)
}

gameOfLife()