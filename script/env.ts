import { spawnSync } from "child_process";
import * as process from "process";

export const PLATFORM_WIN32: string = "win32";
export const PLATFORM_LINUX: string = "linux";
export const PLATFORM_DARWIN: string = "darwin";

export const git: string = ((): string => { return PLATFORM_WIN32 == process.platform ? "git.exe" : "git"; })();

export const gclient: string = ((): string => { return PLATFORM_WIN32 == process.platform ? "gclient.bat" : "gclient"; })();
export const gn: string = ((): string => { return PLATFORM_WIN32 == process.platform ? "gn.bat" : "gn"; })();
export const ninja: string = ((): string => { return PLATFORM_WIN32 == process.platform ? "ninja.exe" : "ninja"; })();

export const ROOT: string = process.cwd();

export function evn_get(key: string, def?: string): string | undefined {
    if (void 0 !== process.env[key]) {
        def = process.env[key];
    }

    return def;
}

export function evn_set(key: string, val: string): void {
    if (void 0 === process.env[key]) {
        process.env[key] = val;
    }
}

export function exec_cmd(cmd: string, args?: Array<string>, cwd?: string): void {
    if (void 0 === cwd) {
        cwd = ROOT;
    }

    spawnSync(cmd, args, { cwd: cwd, stdio: [null, process.stdout, process.stderr], env: process.env });
}
