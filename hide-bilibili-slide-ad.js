// ==UserScript==
// @name         bilibili slider ad block
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除新版哔哩哔哩侧边广告以及默认展开弹幕列表
// @author       CirnoBreak
// @match        https://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const selector = (selector) => document.querySelector(selector);
  const ad = selector('#slide_ad');
  const targetNode = selector('.danmaku-wrap');
  const config = { childList: true, subtree: true };
  const findCollapse = (addNodes, flag) => {
    return !!addNodes &&
      !!addNodes[0] &&
      !!addNodes[0].children &&
      !!addNodes[0].children[0] &&
      !!addNodes[0].children[0].classList &&
      addNodes[0].children[0].classList.value.includes('bui-collapse') &&
      !flag
  }
  const callback = (mutationsList) => {
    let flag;
    for (var mutation of mutationsList) {
      if (mutation.type == 'childList') {
        let addNodes = mutation.addedNodes;
        if (findCollapse(addNodes, flag)) {
          document.querySelector('.bui-collapse-body').style.height = ''
          console.log('find', mutation.addedNodes[0].children[0].classList.value.includes('bui-collapse'));
          flag = true;
        }
      }
    }
  };
  const observer = new MutationObserver(callback);
  if (!!ad) {
    ad.style.display = 'none';
    observer.observe(targetNode, config);
  }

})();