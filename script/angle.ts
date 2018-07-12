import * as fs from "fs";
import * as path from "path";
import * as process from "process";

import { PLATFORM_WIN32, PLATFORM_LINUX, PLATFORM_DARWIN } from "./env";
import { evn_get, evn_set, exec_cmd, ROOT } from "./env";

const PRJ_GIT_URL: string = "https://chromium.googlesource.com/angle/angle.git";
const ROOT_PRJ: string = path.join(ROOT, "angle");
const ROOT_OUT: string = path.join(ROOT_PRJ, "out", "Release");

const GN_ARGS: Array<string> = [
    `is_debug=false`,
    `target_cpu="x64"`,
];

function init_win32(): void {
    console.log(`This Must Run In "Developer Command Prompt for VS 2017"\n`);
}

function init_linux(): void {
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

    if (!fs.existsSync(ROOT_OUT)) {
        fs.mkdirSync(ROOT_OUT);
    }
}

export function build() {
    exec_cmd("git", ["clone", PRJ_GIT_URL]);
    fs.createReadStream(".gclient_angle").pipe(fs.createWriteStream(path.join(ROOT_PRJ, ".gclient_angle")));
    exec_cmd("gclient", ["sync", `--gclientfile=.gclient_angle`], ROOT_PRJ);

    init();

    exec_cmd("gn", ["gen", ROOT_OUT, `--args=${GN_ARGS.join(" ")}`], ROOT_PRJ);
    exec_cmd("ninja", ["-C", ROOT_OUT], ROOT_PRJ);
}
