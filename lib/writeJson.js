"use strict";

const fs = require("fs");
const path = require("path");

module.exports = function (root, mapping) {
    const paths = {}
    for (const key in mapping) {
        if (Object.hasOwnProperty.call(mapping, key)) {
            const path = mapping[key];
            paths[`${key}/*`] = [`${path}/*`]
        }
    }
    // 检查文件是否存在于当前目录中。
    const filePath = path.join(root, "/jsconfig.json");
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            const jsconfig = {
                compilerOptions: {
                    allowSyntheticDefaultImports: true,
                    baseUrl: "./",
                    paths
                },
                exclude: ["node_modules", "dist"]
            };

            const data = JSON.stringify(jsconfig, null, "\t");
            fs.writeFileSync("jsconfig.json", data);
        }
    });
};
