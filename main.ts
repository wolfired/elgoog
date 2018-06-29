import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import { checkServerIdentity } from "tls";

const PLATFORM_WIN32: string = "win32";
const PLATFORM_LINUX: string = "linux";
const PLATFORM_DARWIN: string = "darwin";

function evn_get(key: string, def?: string): string | undefined {
    if (void 0 !== process.env[key]) {
        def = process.env[key];
    }

    return def;
}

function evn_set(key: string, val: string): void {
    if (void 0 === process.env[key]) {
        process.env[key] = val;
    }
}

const ENV_DEPOT_TOOLS_ROOT = "DEPOT_TOOLS_ROOT";

if (
    2 < process.argv.length
    || void 0 === evn_get(ENV_DEPOT_TOOLS_ROOT)
) {
    console.log(`
${ENV_DEPOT_TOOLS_ROOT}: 
`);
    process.exit(0);
}

const ROOT_DEPOT_TOOLS: string = evn_get(ENV_DEPOT_TOOLS_ROOT)!;

const ROOT: string = process.cwd();
const ROOT_BUILT: string = path.join(ROOT, "built");
const ROOT_V8: string = path.join(ROOT, "v8");

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

    if (!fs.existsSync(ROOT_BUILT)) {
        fs.mkdirSync(ROOT_BUILT);
    }
}

function depot_tools_exec(cmd: string, args?: Array<string>, cwd?: string): void {
    if (PLATFORM_WIN32 === process.platform) {
        if (fs.existsSync(path.join(ROOT_DEPOT_TOOLS, cmd + ".bat"))) {
            cmd += ".bat";
        } else if (fs.existsSync(path.join(ROOT_DEPOT_TOOLS, cmd + ".exe"))) {
            cmd += ".exe";
        }
    }

    if (void 0 === cwd) {
        cwd = ROOT;
    }

    spawnSync(path.join(ROOT_DEPOT_TOOLS, cmd), args, { cwd: cwd, stdio: [null, process.stdout, process.stderr], env: process.env });
}

function write_pc(): void {
    let name: string = "v8";
    let desc: string = "v8";
    let vers: string = "x.xx.xxx"
    let libs: string = "-lv8 -lv8_libbase -lv8_libplatform";

    let pc: string = `Name: ${name}\nDescription: ${desc}\nVersion: ${vers}\nCflags: ${"-I" + path.join(ROOT_V8, "include")}\nLibs: ${"-L" + ROOT_BUILT} ${libs}`;

    fs.writeFileSync(path.join(ROOT, "v8.pc"), pc);
}

init();
depot_tools_exec("gclient", ["sync"]);
depot_tools_exec("gn", ["gen", ROOT_BUILT, `--args=${GN_ARGS.join(" ")}`], ROOT_V8);
depot_tools_exec("ninja", ["-C", ROOT_BUILT, "v8_monolith"], ROOT_V8);
write_pc();
