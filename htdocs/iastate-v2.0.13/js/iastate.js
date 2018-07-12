(function($)
{
	$.fn.findDeepest = function() {
		var results = [];
		this.each(function() {
			var deepLevel = 0;
			var deepNode = this;
			treeWalkFast(this, function(node, level) {
				if (level > deepLevel) {
					deepLevel = level;
					deepNode = node;
				}
			});
			results.push(deepNode);
		});
		return this.pushStack(results);
	};

	var treeWalkFast = (function() {
		// create closure for constants
		var skipTags = {"SCRIPT": true, "IFRAME": true, "OBJECT": true, "EMBED": true};
		return function(parent, fn, allNodes) {
			var node = parent.firstChild, nextNode;
			var level = 1;
			while (node && node != parent) {
				if (allNodes || node.nodeType === 1) {
					if (fn(node, level) === false) {
						return(false);
					}
				}
				// if it's an element &&
				//    has children &&
				//    has a tagname && is not in the skipTags list
				//  then, we can enumerate children
				if (node.nodeType === 1 && node.firstChild && !(node.tagName && skipTags[node.tagName])) {
					node = node.firstChild;
					++level;
				} else if (node.nextSibling) {
					node = node.nextSibling;
				} else {
					// no child and no nextsibling
					// find parent that has a nextSibling
					--level;
					while ((node = node.parentNode) != parent) {
						if (node.nextSibling) {
							node = node.nextSibling;
							break;
						}
						--level;
					}
				}
			}
		}
	})();

}(jQuery));

// stop initial scroll Let JS handle it
if (window.location.hash)
{
	setTimeout(function()
	{
		window.scrollTo(0,0)
	}, 1);
}
// stop initial scroll


$(document).ready(function()
{
	// IE console bug
	// --------------------------------------------------
	if (!window.console) console = {log: function() {}};

	// search
	// --------------------------------------------------
	//$(window).keyup(function (e) {
	//	if(e.key == '/') {
	//		$('#search-input').focus();
	//	}
	//});

	// affix
	// --------------------------------------------------
    var affixOffset = $('header').height();
    $('.navbar-menu.navbar-menu-affix').affix({
        offset: {
            top: affixOffset
        }
    });
    $('nav.navbar').each(function () {
        affixOffset += $(this).height();
    });
    affixOffset+=$('#post-nav').height();
    var affixedNavMenu = document.getElementsByClassName('navbar-menu-affix')[0];
    var affixedHeight = 20;
    if(typeof affixedNavMenu !== 'undefined'){
        affixedHeight += affixedNavMenu.offsetHeight;
    }


    var scrollToHash = function(hash, affixedHeightOffset, animationTime )
    {
	var name = hash.substring(1);
        var target = $( document.getElementById(name) );        
	target = target.length ? target : $( document.querySelector("a[name='" + name + "']")  );
        if (target.length) {
			offset = target.offset();
            $('html,body').animate({
                scrollTop: target.offset().top - affixedHeightOffset + 1 //offsets for fixed header
            }, animationTime);
        }
    }

    var objHasData = function(obj){
		var result = false;
		var attrs = obj.attributes;
		jQuery.each(attrs, function(){
			if( this.specified  && this.name.startsWith("data-"))
			{
				result = true;
			}
		});
		return result;
	}

    $('a[href^=#]:not([href=#],.no-scroll)').click(function(eventObj) {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
            && location.hostname == this.hostname) {

        	var hasData = objHasData(this);

        	// don't scroll for anchor with data attributes as they are likely attachments for other bootstrap events
			if(!hasData){
				history.pushState("", document.title, window.location.pathname + this.hash);
				scrollToHash(this.hash, affixedHeight, 125);
				eventObj.preventDefault();
			}

        }
    });
    // initial load of page
    var urlHash = window.location.hash;
    if (urlHash)
    {
		var aExample = $( document.querySelector("a[href='" + urlHash + "']")  ).get(0);
		if (aExample)
		{
			var hasData = objHasData(aExample);
			var hasNoScrollClass = $(aExample).hasClass('no-scroll');
			if(!hasData && !hasNoScrollClass)
			{
				setTimeout(function()
				{
					scrollToHash(urlHash, affixedHeight, 125);
				}, 250);
			}
		}
    }

    $('.right-nav[data-spy=affix]').affix({
        offset: {
            top: affixOffset - (affixedHeight-20)
        }
    });





	//scrollspy
	//---------------------------------------------------
    if(document.getElementById('right-nav-scroll-spy')) {
        $('body').scrollspy({
            target: '#right-nav-scroll-spy',
            offset: affixedHeight
        });
    }

    // bootstrap-submenu
	// --------------------------------------------------
	$('[data-submenu]').submenupicker();

	$('.dropdown-submenu.dropdown-hover a:not(.dropdown-toggle-mobile)').on('click', function(event) {
        if(event.which == 1) {
            window.location = $(this).attr('href');
        }
        else if (event.which == 2 && $(this).attr('href') != '') {
            window.open($(this).attr('href'), '_blank')
        }
	});

	$(".dropdown-hover.dropdown-megamenu").hover(
		function()
		{
			$(this).toggleClass('open');
		},
		function()
		{
			$(this).toggleClass('open');
		}
	);

	// left: 37
	// up: 38
	// right: 39
	// down: 40
	$('.nav > li > a').keydown(function(e) {
		var $this=$(this);
		switch(e.which){
			case 40:
				jumpIn($this, e);
				break;
			case 39:
				nextMenuItem($this, e);
				break;
			case 37:
				previousMenuItem($this, e);
				break;
		}
	});
	$('.dropdown-menu a').keydown(function(e) {
		var $this=$(this);
		var next = 40;
		var previous = 38;
		var out = 37;
		if($this.parent().parent().attr('class').indexOf('isu-index') != -1)
		{
			next = 39;
			previous = 37;
			out = 38;
		}
		switch(e.which) {
			case previous: // up
				previousMenuItem($this, e);
				break;
			case next: // down
				nextMenuItem($this, e);
				break;
			case 39: //right
				jumpIn($this, e);
				break;
			case out: //left
				jumpOut($this, e);
				break;
			case 9: //tab
				$this.closest('.nav > .dropdown > .dropdown-menu').hide();
				e.shiftKey ? previousNav($this, e) : nextNav($this, e);
				break;
		}
	});
	$(window).click(function() {
		if(window.width > 991) {
			$('.dropdown-menu').css('display', 'none');
		}
	});
	edgeDropdowns();
  $(window).resize(function () {
    waitForFinalEvent(function(){
      edgeDropdowns();
    }, 500, "window resize");
  });


	// carousel
	// --------------------------------------------------
	$('#slideshow').carousel( {
		interval: false
	}); //pause on load

	$('#playButton').click(function() {
		playCarousel();
	}).keypress(function(e){
		if(e.which == 13)
			playCarousel()
	});

	$('.btn-carousel').keypress(function(e) {
		if(e.which == 13) {
			$(this).click();
		}
	});

    //mobile menu collapse
    //---------------------------------
    $('#navbar-menu-button').click(function() {
        $(this).toggleClass('collapsed');
    });
    $('#navbar-search-button').click(function() {
        var wordmark = $('.navbar-site-wordmark');
        wordmark.toggleClass('wordmark-down');
        if(wordmark.hasClass('wordmark-down')) {
            setTimeout(function() {
                $('#search-input').focus()
            }, 30);
        }
    });
});
// end $(document).ready

//carousel
// --------------------------------------------------
function playCarousel() {
	var playSpan = $('#playSpan');
	var playButton = $('#playButton');
	if (playSpan.hasClass("fa-play")) {
		$('#slideshow').data('bs.carousel').options.interval=5000; //play
		$('#slideshow').carousel('cycle');
		playSpan.removeClass('fa-play');
		playSpan.addClass('fa-pause');
		playButton.removeClass('carousel-play');
		playButton.addClass('carousel-pause');
		playButton.attr('aria-label', 'Pause Slideshow');
	} else {
		$('#slideshow').carousel('pause'); //pause
		playSpan.removeClass('fa-pause');
		playSpan.addClass('fa-play');
		playButton.removeClass('carousel-pause');
		playButton.addClass('carousel-play');
		playButton.attr('aria-label', 'Play Slideshow');
	}
}

// menu keyboard nav
// --------------------------------------------------
function nextMenuItem(that, event) {
	event.preventDefault();
	event.stopPropagation();
	var next = that.parent().next().find('a:first');
	if(next.html() != undefined) {
		next.focus();
	}
}
function previousMenuItem(that, event) {
	event.preventDefault();
	event.stopPropagation();
	var previous = that.parent().prev().find('a:first');
	if(previous.html() != undefined) {
		previous.focus();
	} else {
		jumpOut(that, event);
	}
}
function jumpOut(that, event) {
	event.preventDefault();
	event.stopPropagation();
	var parentMenu = that.parent().parent().parent();
	var thisMenu = that.parent().parent();
	if(parentMenu != null && parentMenu != undefined) {
		if(thisMenu.attr('class').indexOf('dropdown') != -1){thisMenu.hide();}
		parentMenu.find('a:first').focus();
	}
}
function jumpIn(that, event) {
	event.preventDefault();
	event.stopPropagation();
	var childMenu = that.parent().find('ul.dropdown-menu:first');
	if(childMenu != null && childMenu != undefined) {
		childMenu.show();
		childMenu.find('a:first').focus();
	}
}
function nextNav(that, event) {
	var next = that.closest('.nav > .dropdown').next('.nav > .dropdown').find('a:first');
	if(next != undefined) {
		event.preventDefault();
		event.stopPropagation();
		next.focus();
	}
}
function previousNav(that, event) {
	var previous = that.closest('.nav > .dropdown').prev('.nav > .dropdown').find('a:first');
	if (previous != undefined) {
		event.preventDefault();
		event.stopPropagation();
		previous.focus();
	}
}

function edgeDropdowns(){
  var $dropdowns = $('.dropdown');
  var $dropdownParents = $('.navbar-menu .nav.navbar-nav>.dropdown');
  $dropdowns.each(function() {
    $(this).addClass('open');
  });
  $dropdownParents.each(function(){
    if ($('ul', this).length) {
      var elm = $(this).findDeepest();
      var off = elm.offset();

      var isEntirelyVisible = (off.left + elm.width() <= $(window).width());

      if (!isEntirelyVisible) {
        $(this).addClass('dropdown-menu-right');
      } else {
        $(this).removeClass('dropdown-menu-right');
      }
    }
  });
  $dropdowns.each(function() {
    $(this).removeClass('open');
  });
}
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

// konami
// --------------------------------------------------
var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
$(document).keydown(function(e) {
	kkeys.push( e.keyCode );
	if (kkeys.toString().indexOf(konami) >= 0) {
		// do something awesome
 		$("body").toggleClass("konami");
 		kkeys = [];
	}
	// clear non-konami-matching keypresses
    else if ($.inArray(e.keyCode,[38,40,37,39,66,65]) == -1 ) {
		kkeys = [];
	}
});
