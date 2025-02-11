import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import store from '@/store';
const myStore: any = store;
import { OperationManagerInstance, OperationType } from '@/plugins/operationManager';

let router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((_, __, next) => {
  const operationManager: OperationManagerInstance = myStore.state.operationManager;
  operationManager.pushOperation(OperationType.Route, { from: __.fullPath, to: _.fullPath });
  next();
});

export default router;
