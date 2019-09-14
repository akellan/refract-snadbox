import { Observable } from "rxjs";

export function registerGlobalFunction(name: string) {
  const windowRecord = window as Record<string, any>;

  return new Observable((subscriber) => {
    windowRecord[name] = () => {
      subscriber.next();
      subscriber.complete();
    };
  });
}
