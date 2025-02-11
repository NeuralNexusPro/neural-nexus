import { useStore, mapActions } from 'vuex';
export default function (Actions: any) {
  const store = useStore();
  const actions = mapActions(Actions);
  const newActions = {};
  Object.keys(actions).forEach(key => {
    newActions[key] = actions[key].bind({ $store: store });
  });
  return newActions;
}
