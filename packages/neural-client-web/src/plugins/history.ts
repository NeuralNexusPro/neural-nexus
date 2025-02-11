import VueRouter from 'vue-router';

export default class History extends VueRouter {
  browserHistory: any;
  current: any;
  currentPage: any;
  direction: any;
  stack: any;
  constructor(options: any) {
    super(options);
    this.stack = [];
    this.current = null;
    this.browserHistory = null;
    // forward 1 backward 0;
    this.direction = 1;
  }

  push(location: any, onComplete: any, onAbort: any) {
    const curentLocation = this.getCurrentLocation();
    if (curentLocation && location.path === curentLocation.path) return;
    if (this.current < this.stack.length - 1) {
      Array(this.stack.length - 1 - this.current).forEach(() => {
        this.stack.pop();
      });
    }
    this.stack.push(location);
    this.current = this.stack.length - 1;
    super.push(location, onComplete, onAbort).catch((e: any) => console.log(e));
    this.browserHistory = history.state.key;
  }

  back() {
    this.current = this.current - 1;
    this.direction = 0;
    super.back();
    this.browserHistory = history.state.key;
  }

  forward() {
    const isLast = this.current === this.stack.length - 1;
    if (!isLast) {
      this.current = this.current + 1;
    }
    this.direction = 1;
    super.forward();
    this.browserHistory = history.state.key;
  }

  replace(location: any, onComplete: any, onAbort: any) {
    this.stack[this.currentPage] = location;
    super.replace(location, onComplete, onAbort);
    this.browserHistory = history.state.key;
  }

  go(n: any) {
    if (n !== 0) {
      super.go(n);
    } else {
      window.location.reload();
    }
    this.browserHistory = history.state.key;
  }

  getCurrentLocation() {
    return this.stack[this.current];
  }

  getStack() {
    return this.stack;
  }

  historyChange = (event: any) => {
    if (event.state < this.browserHistory) {
      // back
      this.back();
    } else {
      this.forward();
    }
  };
}
