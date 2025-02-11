import { useStore, mapMutations } from 'vuex';
export default function (Mutations: any) {
  const store = useStore();
  const mutations = mapMutations(Mutations);
  const newMutations = {};

  console.log(mutations, 'mutations');
  Object.keys(mutations).forEach(key => {
    newMutations[key] = mutations[key].bind({ $store: store });
  });
  return newMutations;
}
