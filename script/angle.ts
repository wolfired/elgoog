import * as fs from "fs";
import * as path from "path";
import * as process from "process";

import { PLATFORM_WIN32, PLATFORM_LINUX, PLATFORM_DARWIN } from "./env";
import { git, gclient, gn, ninja } from "./env";
import { evn_get, evn_set, exec_cmd, ROOT } from "./env";

const PRJ_GIT_URL: string = "https://chromium.googlesource.com/angle/angle.git";
const ROOT_PRJ: string = path.join(ROOT, "angle");
const PRJ_OUT: string = path.join(ROOT_PRJ, "out", "Debug");

const GN_ARGS: Array<string> = [
    `is_debug=true`,
    `target_cpu="x64"`,
    `is_component_build=false`,
];

function init_win32(): void {
    console.log(`This Must Run In "Developer Command Prompt for VS 2017"\n`);
    evn_set("DEPOT_TOOLS_WIN_TOOLCHAIN", "0");
    evn_set("GYP_MSVS_VERSION", "2017");
    evn_set("GYP_MSVS_OVERRIDE_PATH", "D:\\VS2017");
    evn_set("vs2017_install", evn_get("GYP_MSVS_OVERRIDE_PATH")!);
}

function init_linux(): void {
    GN_ARGS.push(`clang=false`);
    GN_ARGS.push(`cc_wrapper="ccache"`);
}

function init(): void {
    switch (process.platform) {
        case PLATFORM_WIN32: {
            init_win32();
            break;
        }
        case PLATFORM_LINUX: {
            init_linux();
            break;
        }
    }

    let out: string = path.join(ROOT_PRJ, "out");

    if (!fs.existsSync(out)) {
        fs.mkdirSync(out);
    }

    if (!fs.existsSync(PRJ_OUT)) {
        fs.mkdirSync(PRJ_OUT);
    }
}

export function build() {
    if (!fs.existsSync(ROOT_PRJ)) {
        exec_cmd(git, ["clone", PRJ_GIT_URL]);
    }

    fs.copyFileSync(".gclient_angle", path.join(ROOT_PRJ, ".gclient_angle"));

    exec_cmd(gclient, ["sync", `--gclientfile=.gclient_angle`], ROOT_PRJ);

    init();

    exec_cmd(gn, ["gen", PRJ_OUT, `--args=${GN_ARGS.join(" ")}`], ROOT_PRJ);
    exec_cmd(ninja, ["-C", PRJ_OUT, "libEGL", "libGLESv2"], ROOT_PRJ);
}
