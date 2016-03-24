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

function onSuccess(request) {
  var response = JSON.parse(request.response);
  console.info('SUCCESS', response, request);
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
  get({
    url: navURL,
    success: onSuccess
  });
});
