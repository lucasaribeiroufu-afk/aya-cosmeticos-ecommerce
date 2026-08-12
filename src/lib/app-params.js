const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;

const getAppParams = () => {
  return {
    appId: storage.getItem('app_id') || 'aya-cosmeticos-ecommerce',
    token: storage.getItem('access_token') || null,
    fromUrl: isNode ? '' : window.location.href,
    functionsVersion: 'v1',
    appBaseUrl: isNode ? '' : window.location.origin,
  };
};

export const appParams = { ...getAppParams() };
