
import * as path from 'path';

export const APP_NAME: string = 'nodtes';
export const APP_ROOT: string = path.normalize(__dirname + '/..');
export const APP_PORT: number = process.env.PORT || 3000;
export const REMOTE_ROOT: string = 'https://raw.githubusercontent.com/skijit/notes/master/';
export const ENV_NAME : string = process.env.NODE_ENV || 'development';

