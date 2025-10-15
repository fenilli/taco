import { env } from './env';
import app from './app';
import db from './db';
import client from './client';
import jwt from './jwt';
import cookie from './cookie';

const config = { app, db, client, jwt, cookie };

type Config = typeof config;

type NestedPaths<T, Path extends string = ""> = {
    [K in keyof T & (string | number)]: T[K] extends object
    ?
    NestedPaths<T[K], `${Path}${Path extends "" ? "" : "."}${K}`>
    :
    `${Path}${Path extends "" ? "" : "."}${K}`;
}[keyof T & (string | number)];

type PathValue<T, P extends string> = P extends keyof T
    ? T[P]
    : P extends `${infer K}.${infer R}`
    ? K extends keyof T
    ? PathValue<T[K], R>
    : never
    : never;

export default {
    get<P extends NestedPaths<Config>>(path: P): PathValue<Config, P> {
        return path.split('.').reduce((acc, key) => (acc as any)?.[key], config) as PathValue<Config, P>;
    },
    env,
};