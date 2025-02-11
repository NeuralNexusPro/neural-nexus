export function importScript(url: string, name?: string) {
  return new Promise((resolve, reject) => {
    if(window[name]) return;
    const script = document.createElement('script');
    script.async = false;
    script.crossOrigin = 'anonymous';
    script.src = url;
    document.head.appendChild(script);

    const destroy = (destroy?:boolean) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (destroy && name && window[name]) {
        delete window[name];
      }
    };

    script.onload = () => {
      resolve(window[name]);
      if(!name) {
        destroy();
      }
    };

    script.onerror = () => {
      reject(new Error(`Failed to import: ${url}`));
      destroy(true);
    };
  });
}