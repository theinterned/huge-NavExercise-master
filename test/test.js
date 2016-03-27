
(function(window){

  /////////////////////////
  //
  // test helpers
  //
  /////////////////////////
  function mockMenu() {
    html = ['<ul class="nav__list">',
      '<li class="nav__item">',
      '<a class="nav__link" href="#first_link">A link</a>',
      '</li>',
      '<li class="nav__item">',
      '<a class="nav__link" href="#second_link">A second link</a>',
      '</li>',
      '</ul>'
    ];
    return html.join('');
  }
  function mockHTMLString() {
    var  menu = mockMenu();
    return menu;
  }
  function mockDOM() {
    var mockRoot = document.getElementById('mock_dom');
    var html = mockHTMLString();
    mockRoot.innerHTML = html;
    return mockRoot;
  }

  describe('test the tests', function(){
    describe('mockMenu', function(){
      it('should return the menu dom as a string', function(){
        var expected = '<ul class="nav__list"><li class="nav__item"><a class="nav__link" href="#first_link">A link</a></li><li class="nav__item"><a class="nav__link" href="#second_link">A second link</a></li></ul>';
        expect(mockMenu()).to.equal(expected);
      });
    });
    describe('mockHTMLString', function(){
      it('should return the dom as a string', function(){
        var expected = mockMenu()
        expect(mockHTMLString()).to.equal(expected);
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
        expect(result.children.length).to.equal(1);
        expect(result.children[0].nodeName).to.equal("UL");
      });
      it('should render a .nav__list', function(){
        var result = mockDOM();
        var list = result.getElementsByClassName('nav__list');
        var firstChild = result.children[0];
        expect(list[0]).to.equal(firstChild);
      });
    });
  }); // 'tests the tests' end

  describe('get function', function(){
    it('should have the api url configured', function() {
      var hn = new HugeNav();
      expect(hn.navURL).to.equal('/api/nav.json');
    });
  });

  describe('queryForMenuLinks', function(){
    it('should return all the menu links', function(){
      var hn = HugeNav();
      var dom = mockDOM();
      var links = HugeNav.queryForMenuLinks();
    });
  });


})(window);
