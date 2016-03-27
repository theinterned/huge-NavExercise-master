(function(window){


  var HugeHelpers = {
      /**
       * toggle a class on an element based on the test argument
       * @param {DOMNode} el  the element to work with
       * @param {String} className  the class to toggle
       * @param {Boolean} [test]  if true the class will be added if false it will be removed. Defaults to testing for presence of `className` on `el`
       */
      toggleClass: function(el, className, test) {
        if (typeof test === 'undefined') {
          test =  !el.classList.contains(className);
        }
        var method = (test) ? 'add' : 'remove';
        el.classList[method](className);
        return el;
      },
      /**
       * Make Ajax requests! Pass `success` and `error` callbacks to do stuff with the returned data!
       * @param  {[String='GET']} options.method        What HHTP verb to use: GET, POST, PUT ... NOTE! I've only built and tested this with GET
       * @param  {[String='/']} options.url             The url to make the request to
       * @param  {[function(request)]} options.success  Callback invoked on successful response from the server. Passed the XMLHttpRequest object which contains the response as well as other info (see docs: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
       * @param  {[function(request)]} options.error    Callback invoked on error response from the server. Passed the XMLHttpRequest object which contains the response as well as other info (see docs: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
       * @return {XMLHttpRequest}                       The XMLHttpRequest object that is handling the request
       */
      ajax: function(options) {
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
  }

  var HugeNav = (function(){
  	var C = function(){ return constructor.apply(this, arguments); }
  	var p = C.prototype;
    //construct
  	function constructor(options){};
    p.navURL = '/api/nav.json';

    /***********************
     *
     * HELPER FUNCTIONS and UTILITIES
     *
     ***********************/
    // helper functions to find some DOM nodes
    p.queryForMainNavLinks = function(){ return document.getElementsByClassName('nav__link'); };
    p.queryForMenuLinks = function(){ return document.getElementsByClassName('nav__link--parent'); };
    p.queryForMainNav = function(){ return document.getElementById('main_nav'); };
    p.queryForHamburger = function(){ return document.getElementById('hamburger'); };
    p.queryForPageMask = function(){ return document.getElementById('page_mask'); };

    /**
     * Ajax success handler - This kicks off the rendering of the menu in response to
     * a successful response from the api server.
     * @param  {XMLHttpRequest} request  the server request containing the server response.
     */
    onSuccess = function(request) {
      var response = JSON.parse(request.response);
      this.renderNav(response.items);
    }


    return C;
  })();

  console.log('loaded');



//   /***********************
//    *
//    * RENDERING and TEMPLATE FUNCTIONS
//    *
//    ***********************/
//
//   /**
//    * Template function that takes a nav item returns a string representation of it's menu html
//    * @param  {Object} item          The nav item to render
//    * @param  {[Boolean]} secondary  If this is true the item will be rendered as a second-level nav item: basically it will have difernt classes
//    * @return {String}               The markup representing the nav item
//    */
//   function renderNavItem(item, secondary) {
//     var itemLink, itemEl;
//     var itemSubList = "";
//     var itemClass = `nav__item${secondary ? "--secondary" : ""}`;
//     var itemLinkClass = "nav__link"
//     if (item.items && item.items.length) {
//       itemLinkClass = "nav__link--parent"
//       itemSubList = renderNavList(item.items, true);
//     }
//     itemLink = `<a class="${itemLinkClass}" href="${item.url}"><span class="nav__label">${item.label}</span></a>`
//     itemEl = `<li class="${itemClass}">${itemLink} ${itemSubList}</li>`
//     return itemEl;
//   }
//   /**
//    * Template function that takes a list of nav items and returns a string representation of a menu's html
//    * @param  {Array} items          Array of objects representing a nav item
//    * @param  {[Boolean]} secondary  If this is true the item will be rendered as a second-level nav item: basically it will have difernt classes
//    * @return {String}               The markup representing the nav item
//    */
//   function renderNavList(items, secondary) {
//     var className = `nav__list${secondary ? "--secondary" : ""}`;
//     var listStart = `<ul class="${className}">`;
//     var itemList = items.map(function(item){return renderNavItem(item, secondary)})
//     var listEnd = `</ul>`;
//     var listEl = listStart + itemList.join('\n') + listEnd;
//     return listEl;
//   }
//
//   /**
//    * Render function that builds the Nav and attaches event handlers
//    * @param  {Array} items  Array of objects representing a nav item
//    */
//   var hugeLogoEl; // we're going to cache the innerHTML of the main nav once so we canre-aply it ove rand over
//   function renderNav(items) {
//     var mainNav = queryForMainNav();
//     hugeLogoEl = hugeLogoEl || mainNav.innerHTML; // this gets set once and then won't be over-written with the built innerHTML
//     var list = renderNavList(items);
//     mainNav.innerHTML = hugeLogoEl + list;
//     // now that we've built the list ...
//     // 1. cache the lists of links
//     var parentLinks = queryForSubMenuLinks();
//     var menuLinks = queryForMenuLinks();
//     // 2. use that cached lists inside the scope of these callback event handlers
//     function cachedToggleSubMenu(e) { return toggleSubMenu.call(this, e, parentLinks); }
//     function cachedNavigationLinkClicked(e){ navigationLinkClicked.call(this, parentLinks); }
//     // 3. attach the event handlers to the list of links
//     for (i = 0; i < parentLinks.length; i++) {
//       parentLinks[i].addEventListener('click', cachedToggleSubMenu);
//     }
//     for (i = 0; i < menuLinks.length; i++) {
//       menuLinks[i].addEventListener('click', cachedNavigationLinkClicked);
//     }
//   }
//
//   /***********************
//    *
//    * EVENT HANDLERS
//    *
//    ***********************/
//
//   /**
//    * handls clicking a link that is not a parent of a sub-menu: in other words a
//    * link that navigates somewhere else.
//    *
//    * Does 2 things:
//    * 1. Close any open submenus
//    * 2. Closes the off-canvas menu (if it's open)
//    * @param  {Event} e            the event that is bieng handled
//    * @param  {[NodeList]} links   An optionally you can pass the list of all menus to avoid having to re-query for them. Defaults to querying for the list if it's not passed.
//    */
//   function navigationLinkClicked(e, links){
//     if (!links) {
//       links = queryForSubMenuLinks();
//     }
//     closeAllSubMenus(links, this);
//     document.body.classList.remove('menu_open');
//   }
//
//   /**
//    * Opens a closed menu or closes an open one. Also makes sure to close all other submenus
//    * @param  {Event} e          the event that is bieng handled
//    * @param  {[NodeList]} links An optionally you can pass the list of all menus to avoid having to re-query for them. Defaults to querying for the list if it's not passed.
//    * @return {DOMNode}          The menu that was toggled
//    */
//   function toggleSubMenu(e, links) {
//     e.preventDefault();
//     if (!links) {
//       links = queryForSubMenuLinks();
//     }
//     // close any other open sub-nav
//     closeAllSubMenus(links, this);
//     // open this one if it's closed; close it if its open!
//     var parent = this.parentElement;
//     toggleClass(parent, 'open');
//     toggleClass(document.body, 'submenu-open', parent.classList.contains('open'));
//     return parent;
//   }
//   /**
//    * removes the 'open' class from all passed elements' parentElements
//    * @param  {NodeList} links     the links whose parent should be closed
//    * @param  {[DOMNode]} skipLink Optionally pass a link to skip closing it (useful from the toggleSubMenu event handler)
//    * @return {NodeList}           The passed in links NodeList
//    */
//   function closeAllSubMenus(links, skipLink) {
//     [].map.call(links, function(link){
//       if (link === skipLink) { return; }
//       link.parentElement.classList.remove('open');
//     });
//     var submenuIsOpen = !!(skipLink && skipLink.parentElement.classList.contains('open'));
//     console.log(submenuIsOpen);
//     toggleClass(document.body, 'submenu-open', submenuIsOpen);
//     return links;
//   }
//
//   /**
//    * Toggles a class `.menu_open` on the body. Used to drive the off-canvas menu on smaller screens
//    * @param  {Event} e          the event that is bieng handled
//    */
//   function toggleOffCanvasMenu(e) {
//     // close any sub-menus
//     closeAllSubMenus(queryForSubMenuLinks());
//     // toggle the mobile menu
//     toggleClass(document.body, 'menu_open');
//   }
//
//   /***********************
//    *
//    * AWAY WE GO!
//    * Below is the code to actually run the whole thing
//    *
//    ***********************/
//   function onready(fn) {
//     if (document.readyState != 'loading'){
//       fn();
//     } else {
//       document.addEventListener('DOMContentLoaded', fn);
//     }
//   }
//   onready(function(){
//     var hamburger = queryForHamburger();
//     var pageMask = queryForPageMask();
//     // 1. Render the nav with the data from our Ajax request
//     ajax({
//       url: navURL,
//       success: onSuccess
//     });
//     // 2. Add some DOM Event handlers
//     hamburger.addEventListener('click', toggleOffCanvasMenu);
//     pageMask.addEventListener('click', toggleOffCanvasMenu);
//   });
//
  window.HugeHelpers = HugeHelpers;
  window.HugeNav = HugeNav; // "export the class onto the window"
})(window);
