const path = require("path");
const fs = require("fs");

function BuildManifestPlugin() {
  //
}

BuildManifestPlugin.prototype.apply = function (compiler) {
  compiler.plugin("emit", (compiler, callback) => {
    const stats = compiler.getStats();
    const src = JSON.stringify(stats.toJson().assetsByChunkName, null, 2);
    compiler.assets["manifest_plugin.json"] = {
      source: function () {
        return src;
      },
      size: function () {
        return src.length;
      },
    };
    callback();
  });
};

module.exports = BuildManifestPlugin;
