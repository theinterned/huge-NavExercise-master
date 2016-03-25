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
  // add event listeners
  var hamburger = document.getElementById('hamburger');
  var body = document.body;

  // DOM Event handlers
  function handleHamburgerClick(e) {
    toggleClass(body, 'menu_open');
  }
  hamburger.addEventListener('click', handleHamburgerClick);
});
