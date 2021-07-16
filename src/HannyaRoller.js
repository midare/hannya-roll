import './HannyaRoller.css';
import { animate, numberToKanji } from './misc';

export default class HannyaRoller {
  /**
   * @param {IHannyaRollerProps} options
   */
  constructor({ el, text }) {
    this._el = el;
    this._text = text;

    this._buildElements();
    this._prepareElements();

    this._scrollCount = Number(window.localStorage.getItem('hannyaRollCount'));
  }

  start() {
    this._el.appendChild(this.elSpace);
    this.updateLayout();

    // move to center allow scroll left or right
    this.elScroller.scrollLeft = window.innerWidth * 3;
    this._scrollLeft = this.elScroller.scrollLeft;
    this._scrollDistance = 0;
    this._currentScrollCount = 0;
    this.elCounter.innerText = numberToKanji(Math.floor(this._scrollCount));

    this.updateCount();

    // this._startAnimation();
  }

  updateLayout() {
    const { length } = this._text;
    const screenWidth = this._el.clientWidth;
    const screenHeight = this._el.clientHeight;
    const layout = this._findBestLayout(length, screenWidth, screenHeight);
    this._render(layout);
  }

  updateCount() {
    const scrollCount = Math.floor(this._scrollDistance / window.innerWidth);
    if (scrollCount !== this._currentScrollCount) {
      this._currentScrollCount = scrollCount;
      this._scrollCount += 1;
      this.elCounter.innerText = numberToKanji(Math.floor(this._scrollCount));
      window.localStorage.setItem('hannyaRollCount', String(this._scrollCount));
    }
  }

  destroy() {
    this._el.removeChild(this.elSpace);
    this.destroyAnimation();
  }

  _buildElements() {
    this.elSpace = document.createElement('div');
    this.elSpace.classList.add('HannyaRoller-space');

    this.elRoller = document.createElement('div');
    this.elRoller.classList.add('HannyaRoller-roller');
    this.elSpace.appendChild(this.elRoller);

    this.elCounter = document.createElement('div');
    this.elCounter.classList.add('HannyaRoller-counter');
    this.elSpace.appendChild(this.elCounter);

    this.elScroller = document.createElement('div');
    this.elScroller.classList.add('HannyaRoller-scroller');
    this.elSpace.appendChild(this.elScroller);

    this.elLetterList = [...this._text].map((letter) => {
      const elLetter = document.createElement('div');
      elLetter.classList.add('HannyaRoller-letter');
      elLetter.textContent = letter;
      return elLetter;
    });
  }

  _prepareElements() {
    this.elScroller.addEventListener(
      'scroll',
      this._onScrollerScroll.bind(this),
      { passive: true },
    );
    this.elScroller.addEventListener(
      'scrollStart',
      this._onScrollerScrollStart.bind(this),
    );
    this.elCounter.addEventListener('click', this._resetCounter.bind(this));
  }

  _onScrollerScrollStart(e) {
    this._scrollLeft = this.elScroller.scrollLeft;
  }

  _onScrollerScroll(e) {
    const width = window.innerWidth;
    const distance = Math.abs(this.elScroller.scrollLeft - this._scrollLeft);

    // HACK: filter invalid scroll
    if (distance < width * 0.7) {
      this._scrollDistance += distance;
      this._scrollLeft = this.elScroller.scrollLeft;
      this.updateCount();
    }

    // infinity scroll
    if (this.elScroller.scrollLeft <= 0) {
      this.elScroller.scrollLeft = width * 6 - 1;
    }
    if (this.elScroller.scrollLeft >= width * 6) {
      this.elScroller.scrollLeft = 0;
    }

    const progress = (this.elScroller.scrollLeft % (width * 2)) / (width * 2);
    this.elRoller.style.setProperty('--rotation-progress', `${-progress}`);
  }

  _resetCounter() {
    this._scrollDistance = 0;
    this._currentScrollCount = 0;
    this._scrollCount = 0;
    this.elCounter.innerText = numberToKanji(0);
    window.localStorage.removeItem('hannyaRollCount');
  }

  /**
   * @param {number} length
   * @param {number} screenWidth
   * @param {number} screenHeight
   * @returns {IRollerLayout}
   */
  _findBestLayout(length, screenWidth, screenHeight) {
    const surfaceWidth = screenWidth * Math.PI;
    const surfaceHeight = screenHeight * 0.55 * 0.9;

    const layout = {
      fontSize: 10,
      nLettersInLine: 0,
      nLines: 0,
      surfaceHeight,
    };
    for (let fontSize = screenWidth; fontSize > 0; fontSize -= 1) {
      const nLettersInLine = Math.floor(surfaceHeight / fontSize);
      const nLines = Math.ceil(length / nLettersInLine) + 1;
      const width = nLines * fontSize;
      if (width < surfaceWidth / 2) {
        layout.fontSize = fontSize;
        layout.nLettersInLine = nLettersInLine;
        layout.nLines = nLines;
        break;
      }
    }
    return layout;
  }

  /**
   * @param {IRollerLayout} layout
   */
  _render({ fontSize, nLettersInLine, nLines, surfaceHeight }) {
    this.elRoller.style.setProperty('--surface-height', `${surfaceHeight}px`);
    this.elRoller.style.setProperty('--font-size', `${fontSize}px`);
    this.elCounter.style.setProperty('--font-size', `${fontSize}px`);
    this.elRoller.style.setProperty('--letters-in-line', `${nLettersInLine}`);
    this.elRoller.style.setProperty('--lines', `${nLines}`);
    this.elRoller.innerHTML = '';

    // faster than for()
    const elLineList = new Array(nLines).fill(0).map((_, index) => {
      const elLine = document.createElement('div');
      elLine.classList.add('HannyaRoller-line');
      elLine.style.setProperty('--line-index', `${index}`);
      this.elRoller.appendChild(elLine);

      return elLine;
    });

    this.elLetterList.forEach((elLetter, index) => {
      const lineIndex = Math.floor(index / nLettersInLine);
      const elLine = elLineList[lineIndex];
      elLine.appendChild(elLetter);
    });
  }

  _startAnimation() {
    const rpm = 2; // revolutions per minute
    const initialAnimationDuration = 3000; // from CSS
    const progressOffset = -(initialAnimationDuration / (60000 / rpm));

    const startedAt = Date.now();
    const cycle = (1000 * 60) / rpm;

    this.destroyAnimation = animate(60, () => {
      const timeProgress = ((Date.now() - startedAt) % cycle) / cycle;
      const sum = progressOffset + timeProgress;
      const progress = sum - Math.floor(sum);
      this.elRoller.style.setProperty('--rotation-progress', `${progress}`);
    });
  }
}
