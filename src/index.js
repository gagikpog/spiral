const canvas = document.querySelector('#canvas');
const allNumbersNode = document.querySelector('#allNumbers');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let zoom = 1;
let count = 1000000;
const primeCache = {};
let allNumbers = false;

print(count);

function printPoint(x, y) {
    ctx.strokeRect(x / zoom + canvas.width * 0.5, y / zoom + canvas.height * 0.5, 1 / zoom, 1 / zoom);
}

function isPrime(n) {
    if (primeCache[n] === undefined) {

        let i = 3;
        let prime = !!(n % 2) || n === 2;

        while (i <= n / 2 && prime) {
            if (n % i === 0) {
                prime = false;
            }
            i += 2;
        }
        primeCache[n] = prime;
        return prime;
    } else {
        return primeCache[n];
    }
}

function polarCoordinatesToDecart(angle, lenght) {
    return {
        x: lenght * Math.cos(angle),
        y: lenght * Math.sin(angle)
    }
}

function print(n) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let gen = (print.gen || 0) + 1;
    print.gen = gen;

    const p = (i) => {
        if(gen === print.gen && i < n) {
            setTimeout(() => {
                const step = 5000;
                const delta = allNumbers ? 1 : 2;
                for (let j = i; j < i + step; j += delta) {
                    if (allNumbers || isPrime(j)) {
                        const {x, y} = polarCoordinatesToDecart(j, j);
                        printPoint(x, y);
                    }
                }
                p(i + step);
            }, 0);
        }
    }
    p(1);
}

// events
window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    print(count);
}

canvas.onmousewheel = (event) => {
    event.stopPropagation()
    const delta = (event.deltaY || event.detail) > 0 ? 0.9 : 1.1;
    const newZoom = zoom * delta;
    if (newZoom > 1) {
        zoom = newZoom;
        print(count);
    }
}

allNumbersNode.onchange = () => {
    allNumbers = allNumbersNode.checked;
    print(count);
}
