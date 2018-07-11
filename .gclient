solutions = [
  {
    "name": "v8",
    "url": "https://chromium.googlesource.com/v8/v8.git",
    "deps_file": "DEPS",
    "managed": False,
    "custom_deps": {
      "v8/test/benchmarks/data"               : None,
      "v8/testing/gmock"                      : None,
      "v8/test/mozilla/data"                  : None,
      "v8/test/test262/data"                  : None,
      "v8/test/test262/harness"               : None,
      "v8/test/wasm-js"                       : None,
      "v8/third_party/android_tools"          : None,
      "v8/third_party/catapult"               : None,
      "v8/third_party/colorama/src"           : None,
      "v8/third_party/instrumented_libraries" : None,
      "v8/tools/gyp"                          : None,
      "v8/tools/luci-go"                      : None,
      "v8/tools/swarming_client"              : None,
    },
    "custom_vars": {},
  }
]
