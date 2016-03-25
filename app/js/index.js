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
  buildNav(response.items);
}

function createNavItem(item, secondary) {
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
  var i;
  var className = `nav__list${secondary ? "--secondary" : ""}`;
  var listStart = `<ul class="${className}">`;
  var itemList = items.map(function(item){return createNavItem(item, secondary)})
  var listEnd = `</ul>`;
  listEl = listStart + itemList.join('\n') + listEnd;
  return listEl;
}
function queryForMenuLinks(){ return document.getElementsByClassName('nav__link--parent'); }
var hugeLogoEl; // we're gong to cahce the innerHTML of the main nav once so we canre-aply it ove rand over
function buildNav(items) {
  var mainNav = document.getElementById('main_nav');
  hugeLogoEl = hugeLogoEl || mainNav.innerHTML;
  var list = createNavList(items);
  mainNav.innerHTML = hugeLogoEl + list;
  // now that we've built the list ...
  // 1. cache the list of parent links
  var parentLinks = queryForMenuLinks();
  // 2. use that cached list inside the scope of this callback event handler
  function cachedToggleSubMenu(e) { toggleSubMenu.call(this, e, parentLinks); }
  // 3. attach the event handler to the lis of links
  for (i = 0; i < parentLinks.length; i++) {
    parentLinks[i].addEventListener('click', cachedToggleSubMenu);
  }
}

/**
 * Opens a closed menu or closes an open one. Also makes sure to close all other submenus
 * @param  {Event} e          the event that is bieng handled
 * @param  {[NodeList]} links An optionally you can pass the list of all menus to avoid having to re-query for them. Defaults to querying for the list if it's not passed.
 * @return {DOMNode}          The menu that was toggled
 */
function toggleSubMenu(e, links) {
  e.preventDefault();
  if (!links) {
    links = queryForMenuLinks();
  }
  // close any other open sub-nav
  closeAllSubMenus(links, this);
  // open this one if it's closed; close it if its open!
  var parent = this.parentElement;
  toggleClass(parent, 'open');
  toggleClass(document.body, 'submenu-open', parent.classList.contains('open'));
  return parent;
}
/**
 * removes the 'open' class from all passed elements' parentElements
 * @param  {NodeList} links     the links whose parent should be closed
 * @param  {[DOMNode]} skipLink Optionally pass a link to skip closing it (useful from the toggleSubMenu event handler)
 * @return {NodeList}           The passed in links NodeList
 */
function closeAllSubMenus(links, skipLink) {
  [].map.call(links, function(link){
    if (link === skipLink) { return; }
    link.parentElement.classList.remove('open');
  });
  var submenuIsOpen = skipLink && skipLink.parentElement.classList.contains('open');
  toggleClass(document.body, 'submenu-open', submenuIsOpen);
  return links;
}

/**
 * toggle a class on an element based on the test argument
 * @param {DOMNode} el  the element to work with
 * @param {String} className  the class to toggle
 * @param {Boolean} [test]  if true the class will be added if false it will be removed. Defaults to testing for presence of `className` on `el`
 */
function toggleClass(el, className, test) {
  if (typeof test === 'undefined') {
    test =  !el.classList.contains(className);
  }
  var method = (test) ? 'add' : 'remove';
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
  var pageMask = document.getElementById('page_mask');

  // DOM Event handlers
  // Toggles a class `.menu_open` on the body. Used to drive the off-canvas menu on smaller screens
  function toggleOffCanvasMenu(e) {
    // close any sub-menus
    closeAllSubMenus(queryForMenuLinks());
    // toggle the mobile menu
    toggleClass(body, 'menu_open');
  }
  hamburger.addEventListener('click', toggleOffCanvasMenu);
  pageMask.addEventListener('click', toggleOffCanvasMenu);
});
