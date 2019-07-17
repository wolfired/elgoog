import * as v8 from "./v8"
import * as angle from "./angle"

import * as yargs from "yargs"


let argv = yargs.usage("Usage: $0 --target [target]").demandOption(["target"]).string(["target"]).describe("target", "Build target: v8 | angle").argv;

switch (argv.target) {
    case "v8":
        v8.build();
        break;
    case "angle":
        angle.build();
        break;
    default:
        break;
}
