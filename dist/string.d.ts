import { Parser } from "./core";
export declare const token: <T extends string>(word: T) => Parser<string, T>;
export declare const regexp: (reg: RegExp) => Parser<string, string>;
