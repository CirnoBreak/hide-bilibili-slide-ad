// ==UserScript==
// @name         hide bilibili slide ad
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏新版哔哩哔哩侧边广告以及默认展开弹幕列表
// @author       CirnoBreak
// @match        https://www.bilibili.com/video/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  // 封装的document.querySelector函数
  const selector = (selector) => document.querySelector(selector);
  // 获取侧边滑动广告元素，同时也是新版播放器的特有元素
  const ad = selector('#slide_ad');
  // 页面初加载时只是一个骨架屏占位的元素，没有任何内容，须观察元素变动
  const targetNode = selector('.danmaku-wrap');
  // MutationObserver选项,此处观察子元素集合跟子树的变动
  const config = { childList: true, subtree: true };
  // 判断在加载过程中是否找到className为bui-collapse的元素
  const findCollapse = (addedNodes, flag) => {
    return !!addedNodes &&
      !!addedNodes[0] &&
      !!addedNodes[0].children &&
      !!addedNodes[0].children[0] &&
      !!addedNodes[0].children[0].classList &&
      addedNodes[0].children[0].classList.value.includes('bui-collapse') &&
      !flag;
  }
  // MutationObserver 的回调函数
  const callback = (mutationsList) => {
    // 用于判断是否找到元素，找到之后赋值为true不执行
    let flag;
    for (let mutation of mutationsList) {
      if (mutation.type == 'childList') {
        // 变异过程中的操作为添加的元素列表
        let addedNodes = mutation.addedNodes;
        if (findCollapse(addedNodes, flag)) {
          // 清除bui-collapse-body的style的height
          document.querySelector('.bui-collapse-body').style.height = '';
          flag = true;
          // 停止观察
          observer.disconnect();
        }
      }
    }
  };
  // 实例化观察者
  const observer = new MutationObserver(callback);
  // 判断是否是新版播放器
  if (!!ad) {
    // 隐藏滑动广告
    ad.style.display = 'none';
    // 观察变动
    observer.observe(targetNode, config);
  }

})();