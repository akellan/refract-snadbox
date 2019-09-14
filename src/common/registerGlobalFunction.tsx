export function registerGlobalFunction(name: string, func: () => void) {
  const windowRecord = window as Record<string, any>;
  windowRecord[name] = func;
}
