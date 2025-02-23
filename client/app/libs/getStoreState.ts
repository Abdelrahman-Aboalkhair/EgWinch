let storeInstance: any = null;

export const setStore = (store: any) => {
  storeInstance = store;
};

export const getStoreState = () => {
  return storeInstance?.getState();
};
