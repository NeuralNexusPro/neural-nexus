export default (className: string, flag: boolean, el: HTMLElement = document.body) => {
  el.classList[flag ? 'add' : 'remove'](className);
}