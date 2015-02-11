/*
 * Require-CSS RequireJS css! loader plugin
 * 0.2.0
 * Guy Bedford 2014
 * With modifications by Marcel Miranda to use <link> style loading for IE.
 * MIT
 */

/*
 *
 * Usage:
 *  require(['css!./mycssFile']);
 *
 * Tested and working in (up to latest versions as of March 2013):
 * Android
 * iOS 6
 * IE 6 - 10
 * Chome 3 - 26
 * Firefox 3.5 - 19
 * Opera 10 - 12
 * 
 * browserling.com used for virtual testing environment
 *
 * Credit to B Cavalier & J Hann for the IE 6 - 9 method,
 * refined with help from Martin Cermak
 * 
 * Sources that helped along the way:
 * - https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 * - http://www.phpied.com/when-is-a-stylesheet-really-loaded/
 * - https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
 *
 */

define(function() {
//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
  if (typeof window == 'undefined')
    return { load: function(n, r, load){ load() } };

  var head = document.getElementsByTagName('head')[0];

  var engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/) || 0;
  
  // set to false for explicit <link> load checking when onload doesn't work perfectly (webkit)
  var useOnload = true;

  // webkit
  if (engine[2] || engine[8]) {
    useOnload = false;
  }

//>>excludeEnd('excludeRequireCss')
  //main api object
  var cssAPI = {};

//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
  cssAPI.pluginBuilder = './css-builder';

  // <link> load method
  var linkLoad = function(url, callback) {
    var link = document.createElement('link');
    head.appendChild(link);
    link.type = 'text/css';
    link.rel = 'stylesheet';
    if (useOnload) {
      link.onload = function() {
        link.onload = function() {};
        // for style dimensions queries, a short delay can still be necessary
        setTimeout(callback, 7);
      }
    } else {
      var loadInterval = setInterval(function() {
        for (var i = 0; i < document.styleSheets.length; i++) {
          var sheet = document.styleSheets[i];
          if (sheet.href == link.href) {
            clearInterval(loadInterval);
            return callback();
          }
        }
      }, 10);
    }
    link.href = url;
  }

//>>excludeEnd('excludeRequireCss')
  cssAPI.normalize = function(name, normalize) {
    if (name.substr(name.length - 4, 4) == '.css') {
      name = name.substr(0, name.length - 4);
    }
    return normalize(name);
  }

//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
  cssAPI.load = function(cssId, req, load, config) {
    linkLoad(req.toUrl(cssId + '.css'), load);
  }

//>>excludeEnd('excludeRequireCss')
  return cssAPI;
});
