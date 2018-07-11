export const PLATFORM_WIN32: string = "win32";
export const PLATFORM_LINUX: string = "linux";
export const PLATFORM_DARWIN: string = "darwin";

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
