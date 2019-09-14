import { FunctionComponent } from "react";
import { PushEvent } from "refract-rxjs";

export type FCE<P = {}> = FunctionComponent<P & { pushEvent: PushEvent }>;
