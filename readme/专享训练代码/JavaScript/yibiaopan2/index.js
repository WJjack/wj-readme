class Yibiaopan {
    constructor(containerId, timeSpanNum = 100, textId) {
        this.textId = textId;
        this.textDom = document.getElementById(textId);
        this.containerDom = document.getElementById(containerId);
        this.timeSpansNum = timeSpanNum;
        this.timeSpansDom = this.genSpan(timeSpanNum);
        this.initSpan();
        this.setText(0);
        this.render(this.timeSpansDom);
    }
    initSpan() {
        for (let i = 0; i < this.timeSpansNum; i++) {
            this.timeSpansDom.children[i].style.transform = `rotate(${i / this.timeSpansNum * 360}deg)`
        }
    }
    setText(value) {
        this.textDom.innerText = value + '%';
    }
    changeRange(num) {
        console.log(num)
        for (let i = 0; i < this.timeSpansNum; i++) {
            if (i <= num) {
                this.containerDom.children[i].style.setProperty('--bg', `hsl(${i / this.timeSpansNum * 360},100%,50%)`)
                this.containerDom.children[i].style.setProperty('--sg', `hsl(${i / this.timeSpansNum * 360},100%,50%)`)
            } else {
                this.containerDom.children[i].style.setProperty('--bg', 'black');
                this.containerDom.children[i].style.setProperty('--sg', 'transparent');
            }
        }
    }
    genSpan(num) {
        let fragment = document.createDocumentFragment();
        for (let i = 0; i < num; i++) {
            let spanDom = document.createElement('span');
            fragment.appendChild(spanDom);
        }
        return fragment;
    }
    render(timeSpansDom) {
        this.containerDom.appendChild(timeSpansDom);
    }
}
