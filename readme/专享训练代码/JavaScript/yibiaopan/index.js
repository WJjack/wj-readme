let defaultValue = 40;
let maxValue = 100;
let oldCenterIndex = 0;
let box = document.getElementById('box');
let text = document.getElementById('text');

// 范围调整时执行的事件处理函数
function rangeInput(e) {
    let value = +e.value;
    box.style.transform = `rotate(${value / maxValue * 360}deg)`

    let child = box.children;
    let centerIndex = maxValue - value;
    child[maxValue - value].style.setProperty('--bg', 'red');
    child[oldCenterIndex].style.setProperty('--bg', '#999');
    text.innerText = centerIndex + 'kg';
    oldCenterIndex = centerIndex;
    // let currentIndex = value > 0 ? value - 1 : value;
    // child[value].style.setProperty('--bg', 'red');
    // child[oldCurrentIndex].style.setProperty('--bg', '#999');
    // oldCurrentIndex = value;
    // for(let i = 0; i < box.children.length; i++) {
    //     let span = box.children[i];
    //     span.style.transform = `rotate(${i / 100 * 360 + value / 100 * 360}deg)`
        // if (i < value) {
        //     span.style.setProperty('--bg', `hsl(${i / 100 * 360},100%,50%)`)
        // } else {
        //     span.style.setProperty('--bg', 'black');
        // }
    // }
}

// 生成span标签
function genSpan() {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < maxValue; i++) {
        let span = document.createElement('span');
        span.style.transform = `rotate(${i / maxValue * 360}deg)`;
        span.dataset.content = i + '';
        fragment.appendChild(span);
    }
    box.appendChild(fragment);
}

genSpan();

rangeInput({value: defaultValue})
