import { FunctionComponent } from "react";
import { PushEvent } from "refract-rxjs";

declare global {
  type FCE<P = {}> = FunctionComponent<P & { pushEvent: PushEvent }>;
}
