export default class DnDSortingAreaAutoScroller {
  interval: NodeJS.Timer | null = null;

  clear() {
    if (this.interval == null) {
      return;
    }

    clearInterval(this.interval);
    this.interval = null;
  }

  update(translate, minTranslate, maxTranslate, width, height) {
    let direction = 0;
    let speed = 1;
    const acceleration = 10;

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } =
      this.container;

    const isTop = scrollTop === 0;
    const isBottom = scrollHeight - scrollTop - clientHeight === 0;

    if (translate.y >= maxTranslate.y - height / 2 && !isBottom) {
      // Scroll Down
      direction = 1;
      speed = acceleration * Math.abs((maxTranslate.y - height / 2 - translate.y) / height);
    } else if (translate.y <= minTranslate.y + height / 2 && !isTop) {
      // Scroll Up
      direction = -1;
      speed = acceleration * Math.abs((translate.y - height / 2 - minTranslate.y) / height);
    }

    if (this.interval) {
      this.clear();
    }

    if (direction !== 0) {
      this.interval = setInterval(() => {
        const offset = {
          top: speed * direction
        };
        this.container.scrollTop += offset.top;

        this.onScrollCallback(offset);
      }, 5);
    }
  }
}
