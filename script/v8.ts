import * as fs from "fs";
import * as path from "path";
import * as process from "process";

import { PLATFORM_WIN32, PLATFORM_LINUX, PLATFORM_DARWIN } from "./env";
import { evn_get, evn_set, exec_cmd, ROOT } from "./env";

const PRJ_GIT_URL: string = "https://chromium.googlesource.com/v8/v8.git";
const ROOT_PRJ: string = path.join(ROOT, "v8");
const ROOT_OUT: string = path.join(ROOT_PRJ, "out", "Release");

const GN_ARGS: Array<string> = [
    `is_debug=false`,
    `v8_target_cpu="x64"`,
    `is_component_build=false`,
    `v8_static_library=false`,
    `symbol_level=1`,
    `treat_warnings_as_errors=false`,
    `v8_deprecation_warnings=false`,
    `v8_embedder_string="v8er"`,
    `v8_enable_i18n_support=false`,
    `v8_enable_test_features=false`,
    `v8_experimental_extra_library_files=[]`,
    `v8_extra_library_files=[]`,
    `v8_imminent_deprecation_warnings=false`,
    `v8_monolithic=true`,
    `v8_untrusted_code_mitigations=false`,
    `v8_use_external_startup_data=false`,
    `v8_use_snapshot=true`,
];

function init_win32(): void {
    console.log(`This Must Run In "Developer Command Prompt for VS 2017"\n`);
    evn_set("DEPOT_TOOLS_WIN_TOOLCHAIN", "0");
    evn_set("GYP_MSVS_VERSION", "2017");
    evn_set("GYP_MSVS_OVERRIDE_PATH", "D:\\VS2017");
    evn_set("vs2017_install", evn_get("GYP_MSVS_OVERRIDE_PATH")!);
}

function init_linux(): void {
    GN_ARGS.push(`use_sysroot=false`);
    GN_ARGS.push(`use_custom_libcxx=false`);
    GN_ARGS.push(`libcpp_is_static=false`);
    GN_ARGS.push(`v8_enable_gdbjit=false`);
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

function write_pc(): void {
    let name: string = "v8";
    let desc: string = "v8";
    let vers: string = "x.xx.xxx"
    let libs: string = "-lv8_monolith";

    let pc: string = `Name: ${name}\nDescription: ${desc}\nVersion: ${vers}\nCflags: ${"-I" + path.join(ROOT_PRJ, "include")}\nLibs: ${"-L" + ROOT_OUT} ${libs}`;

    fs.writeFileSync(path.join(ROOT_OUT, "v8.pc"), pc);
}

export function build() {
    exec_cmd("gclient", [`--gclientfile=${path.join(ROOT, ".gclient_v8")}`, "sync"]);

    init();

    exec_cmd("gn", ["gen", ROOT_OUT, `--args=${GN_ARGS.join(" ")}`], ROOT_PRJ);
    exec_cmd("ninja", ["-C", ROOT_OUT, "v8_monolith"], ROOT_PRJ);
    write_pc();
}
