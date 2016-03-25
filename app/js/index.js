// app config
var navURL = '/api/nav.json'

// Ajax request
function get(options) {
  var options = options || {};
  var defaults = {
    method: 'GET',
    url: '/',
    success: function(request){ console.info(request.responseText, request); },
    error: function(request){ console.error(request.responseText, request); }
  }
  var args = Object.assign({}, defaults, options);
  var request = new XMLHttpRequest();
  request.open(args.method, args.url, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      return args.success(request);
    } else {
      // We reached our target server, but it returned an error
      args.error(request);
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
    args.error(request);
  };
  return request.send();
}

// Ajax success handler
function onSuccess(request) {
  var response = JSON.parse(request.response);
  console.info('SUCCESS', response, request);
  buildNav(response.items);
}

function createNavItem(item, secondary) {
  console.log('createNavItem', secondary);
  var itemLink, itemEl;
  var itemSubList = "";
  var itemClass = `nav__item${secondary ? "--secondary" : ""}`;
  var itemLinkClass = "nav__link"
  if (item.items && item.items.length) {
    itemLinkClass = "nav__link--parent"
    itemSubList = createNavList(item.items, true);
  }
  itemLink = `<a class="${itemLinkClass}" href="${item.url}"><span class="nav__label">${item.label}</span></a>`
  itemEl = `<li class="${itemClass}">${itemLink} ${itemSubList}</li>`
  return itemEl;
}
function createNavList(items, secondary) {
  console.log('createNavList', secondary);
  var i;
  var className = `nav__list${secondary ? "--secondary" : ""}`;
  var listStart = `<ul class="${className}">`;
  var itemList = items.map(function(item){return createNavItem(item, secondary)})
  var listEnd = `</ul>`;
  listEl = listStart + itemList.join('\n') + listEnd;
  return listEl;
}
var hugeLogoEl; // we're gong to cahce the innerHTML of the main nav once so we canre-aply it ove rand over
function buildNav(items) {
  var mainNav = document.getElementById('main_nav');
  hugeLogoEl = hugeLogoEl || mainNav.innerHTML;
  var list = createNavList(items);
  mainNav.innerHTML = hugeLogoEl + list;
  // now that we've built the list ...
  // 1. cache the list of parent links
  var parentLinks = document.getElementsByClassName('nav__link--parent');
  // 2. use that cached list inside the scope of this callback event handler
  function toggleSubMenu(e) {
    var _this = this;
    // close any other open sub-nav
    [].map.call(parentLinks, function(link){
      if (link === _this) { return; }
      link.parentElement.classList.remove('open');
    });
    // open this one if it's closed; close it if its open!
    toggleClass(this.parentElement, 'open');
  }
  // 3. attach the event handler to the lis of links
  for (i = 0; i < parentLinks.length; i++) {
    parentLinks[i].addEventListener('click', toggleSubMenu);
  }
}

/**
 * toggle a class on an element based on the test argument
 * @param {DOMNode} el  the element to work with
 * @param {String} className  the class to toggle
 * @param {Boolean} [test]  if true the class will be added if false it will be removed. Defaults to testing for presence of `className` on `el`
 */
function toggleClass(el, className, test) {
  if (typeof test === 'undefined') {
    test =  el.classList.contains(className);
  }
  var method = (test) ? 'remove' : 'add';
  el.classList[method](className);
  return el;
}

// Away we go!
function onready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
onready(function(){
  // populate the nav
  get({
    url: navURL,
    success: onSuccess
  });
  var i;
  var body = document.body;
  var hamburger = document.getElementById('hamburger');

  // DOM Event handlers
  // Toggles a class `.menu_open` on the body. Used to drive the off-canvas menu on smaller screens
  function toggleOffCanvasMenu(e) {
    toggleClass(body, 'menu_open');
  }
  hamburger.addEventListener('click', toggleOffCanvasMenu);
});
