
(function(window){

  /////////////////////////
  //
  // test helpers
  //
  /////////////////////////
  function mockMenu() {
    html = [
      '<nav class="main_nav" id="main_nav" role="nav">',
      '<ul class="nav__list">',
      '<li class="nav__item">',
      '<a class="nav__link" href="#first_link">A link</a>',
      '</li>',
      '<li class="nav__item">',
      '<a class="nav__link" href="#second_link">A second link</a>',
      '</li>',
      '<li class="nav__item ">',
      '<a class="nav__link--parent" href="#second_link">A second link</a>',
      '</li>',
    ];
    return html.join('');
  }
  function mockLogo() {
    html = [
      '<a class="huge_logo" href="/">',
      '<h1 class="huge_logo__type" id="huge_logo"><span class="hide">HUGE</span></h1>',
      '</a>'
    ];
    return html.join('');
  }
  function mockDOM() {
    var mockRoot = document.getElementById('mock_dom');
    var menu = mockMenu();
    var logo =  mockLogo();
    var nav = document.getElementById('main_nav');
    nav.innerHTML = logo + menu;
    return mockRoot;
  }

  describe('test the tests', function(){
    describe('mockMenu', function(){
      it('should return the menu dom as a string', function(){
        expect(mockMenu()).to.be.a("string");
      });
    });
    describe('mockLogo', function(){
      it('should return the logo dom as a string', function(){
        expect(mockLogo()).to.be.a("string");
      });
    });
    describe('mockDOM', function(){
      it('should run in a test runner with a #mock_dom node', function(){
        var result = document.getElementById('mock_dom');
        expect(result).to.exist;
        expect(result.parentElement).to.equal(document.body);
      });
      it('should render into the DOM', function(){
        var result = mockDOM();
        var mockDOMNode = document.getElementById('mock_dom');
        expect(result).to.exist;
        expect(mockDOMNode).to.exist;
        expect(result).to.equal(mockDOMNode);
        expect(result).to.have.property('parentElement');
        expect(result.parentElement).to.equal(document.body);
      });
      it('should render a .nav__list', function(){
        var result = mockDOM();
        expect(result.getElementsByClassName('nav__item').length).to.equal(3);
        expect(result.getElementsByClassName('nav__link').length).to.equal(2);
        expect(result.getElementsByClassName('nav__link--parent').length).to.equal(1);
      });
    });
  }); // 'tests the tests' end

  describe('Helpers', function(){
    describe('toggleClass', function(){
      it("should add the passed class to an element if the element doesn't have that class", function(){
        var body = document.body;
        var bodyClasses = body.classList;
        bodyClasses.remove('foo');
        expect(bodyClasses.contains('foo')).not.to.be.ok;
        HugeHelpers.toggleClass(body, 'foo');
        expect(bodyClasses.contains('foo')).to.be.ok;
      });
      it("should remove the passed class to an element if the element doesn't have that class", function(){
        var body = document.body;
        var bodyClasses = body.classList;
        bodyClasses.add('foo');
        expect(bodyClasses.contains('foo')).to.be.ok;
        HugeHelpers.toggleClass(body, 'foo');
        expect(bodyClasses.contains('foo')).not.to.be.ok;
      });
      it("should add the passed class if the truth test is truthy", function(){
        var body = document.body;
        var bodyClasses = body.classList;
        bodyClasses.remove('foo');
        expect(bodyClasses.contains('foo')).not.to.be.ok;
        HugeHelpers.toggleClass(body, 'foo', true);
        expect(bodyClasses.contains('foo')).to.be.ok;
        HugeHelpers.toggleClass(body, 'foo', true); // still true
        expect(bodyClasses.contains('foo')).to.be.ok;
      });
      it("should remove the passed class if the truth test is truthy", function(){
        var body = document.body;
        var bodyClasses = body.classList;
        bodyClasses.remove('foo');
        expect(bodyClasses.contains('foo')).not.to.be.ok;
        HugeHelpers.toggleClass(body, 'foo', false);
        expect(bodyClasses.contains('foo')).not.to.be.ok;
        bodyClasses.add('foo');
        expect(bodyClasses.contains('foo')).to.be.ok;
        HugeHelpers.toggleClass(body, 'foo', false);
        expect(bodyClasses.contains('foo')).not.to.be.ok;
      });
    });
  });

  describe('HugeNav Class', function(){
    describe('ajax functions', function(){
      it('should have the api url configured', function() {
        var hn = new HugeNav();
        expect(hn.navURL).to.equal('/api/nav.json');
      });
      describe('onSuccess', function(){
       it('should render the menu with the returned items')
      });
    });

    describe('DOM Query methods', function(){
      describe('queryForMainNavLinks', function(){
        it('should return all the .nav__link elements', function(){
          var hn = new HugeNav();
          var result = mockDOM();
          var links = hn.queryForMainNavLinks();
          expect(links).to.be.an('NodeList');
          expect(document.getElementsByClassName('nav__link').length).to.equal(2);
          expect(links.length).to.equal(2);
        });
      });
      describe('queryForMenuLinks', function(){
        it('should return all the .nav__link--parent menu links', function(){
          var hn = new HugeNav();
          var result = mockDOM();
          var links = hn.queryForMenuLinks();
          expect(links).to.be.a('NodeList');
          expect(document.getElementsByClassName('nav__link--parent').length).to.equal(1);
          expect(links.length).to.equal(1);
        });
      });
      describe('queryForMainNav', function(){
        it('should return the #main_nav', function(){
          var hn = new HugeNav();
          var result = mockDOM();
          var nav = hn.queryForMainNav();
          expect(nav).to.be.a('HTMLElement');
          expect(document.getElementById('main_nav')).to.equal(nav);
        });
      });
      describe('queryForHamburger', function(){
        it('should return the #hamburger', function(){
          var hn = new HugeNav();
          var result = mockDOM();
          var hamburger = hn.queryForHamburger();
          expect(hamburger instanceof HTMLElement).to.be.ok; // for some reason uing `is.a('HTMLElement')` wasn't working; this is the same
          expect(document.getElementById('hamburger')).to.equal(hamburger);
        });
      });
      describe('queryForPageMask', function(){
        it('should return #page_mask', function(){
          var hn = new HugeNav();
          var result = mockDOM();
          var mask = hn.queryForPageMask();
          expect(mask instanceof HTMLElement).to.be.ok; // for some reason uing `is.a('HTMLElement')` wasn't working; this is the same
          expect(document.getElementById('page_mask')).to.equal(mask);
        });
      });
    });
  });
})(window);
