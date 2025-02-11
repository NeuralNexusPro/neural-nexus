import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  parent: '#app',
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

export default NProgress;
