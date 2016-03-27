
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

  describe('get function', function(){
    it('should have the api url configured', function() {
      var hn = new HugeNav();
      expect(hn.navURL).to.equal('/api/nav.json');
    });
  });

  describe('queryForMainNavLinks', function(){
    it('should return all the menu links', function(){
      var hn = new HugeNav();
      var result = mockDOM();
      var links = hn.queryForMainNavLinks();
      expect(links).to.be.an('NodeList');
      expect(document.getElementsByClassName('nav__link').length).to.equal(2);
      expect(links.length).to.equal(2);
    });
  });
  describe('queryForMenuLinks', function(){
    it('should return all the menu links', function(){
      var hn = new HugeNav();
      var result = mockDOM();
      var links = hn.queryForMenuLinks();
      expect(links).to.be.a('NodeList');
      expect(document.getElementsByClassName('nav__link--parent').length).to.equal(1);
      expect(links.length).to.equal(1);
    });
  });


})(window);
