'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function HtmlRemove() {}
HtmlRemove.prototype.apply = compiler => {
  compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
      htmlPluginData.html = htmlPluginData.html.replace(/<!-- html:remove -->[\s\S]*?<!-- \/html:remove -->/g, '');
      callback(null, htmlPluginData);
    });
  });
};

exports.default = HtmlRemove;
module.exports = exports['default'];