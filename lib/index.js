const solveDependences = require("./solve-dependences");
const writeJson = require("./writeJson");
const path = require("path");
const process = require("process");

module.exports = function (root, map) {
    root = root || process.cwd();

    if (!path.isAbsolute(root)) {
        throw new Error("The root path must be absolute");
    }

    let pathMap = {};
    for (let name in map) {
        pathMap[name] = map[name];
    }

    let cache = solveDependences(pathMap);
    writeJson(root, cache)

    const old = module.__proto__.require;
    module.__proto__.require = function (filepath, ...args) {
        return old.apply(this, [
            filepath
                .split(/[\\\/]/g)
                .map(function (s) {
                    return cache.hasOwnProperty(s) ? cache[s] : s;
                })
                .join("/"),
            ...args,
        ]);
    };
};
