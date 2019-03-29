$(document).ready(function () {
	$('#boxTimer').countdown('2019/01/01', function (event) {
		var $this = $(this).html(event.strftime('<div>%D <p>Days</p></div><div>%H<p>Hours</p></div><div>%M<p>Minutes</p></div><div>%S<p>Seconds</p></div>'));
	});

	$("#link1, #link2").click(function () {
		$("#popUpModal").modal();
	});

	var eTop = $('.section-2').offset().top - 54;
	setClassNavBar();
	getScrollNav();
	$(window).on('resize scroll', function () {
		setClassNavBar();
		getScrollNav();
		if ($(window).width() > 995) {
			$('.btn-navbar-menu').removeClass('active');
			$('body').removeClass('dscroll');
		}
	})

	function setClassNavBar() {
		let onTopBar = eTop - $(window).scrollTop();
		if (onTopBar <= 0) {
			$('.nav-bar').addClass('ontop');
		} else {
			$('.nav-bar').removeClass('ontop');
		}
	}

	function getScrollNav() {
		var $sections = $('section');
		$sections.each(function (i, el) {
			var top = $(el).offset().top - 100;
			var bottom = top + $(el).height();
			var scroll = $(window).scrollTop();
			var id = $(el).attr('id');
			if (scroll > top && scroll < bottom) {
				$('a.active').removeClass('active');
				if (id !== 'anchor0' || id !== undefined || id !== '') {
					$('a[href="#' + id + '"]').addClass('active');
				}
			}
		})
	}

	$(".nav-bar, .btn-navbar-menu").on("click", "a", function (event) {
		$('.btn-navbar-menu').removeClass('active');
		if( !$(this).hasClass('nav-link') ) {
			$('body').removeClass('dscroll');
			event.preventDefault();
			var id = $(this).attr('href'),
				top = $(id).offset().top;
			$('body,html').animate({ scrollTop: top }, 800);
		}
	});

	$('.btn-navbar').on('click', function () {
		$('.btn-navbar-menu').addClass('active');
		$('body').addClass('dscroll');
	})

	$('.closer').on('click', function () {
		$('.btn-navbar-menu').removeClass('active');
		$('body').removeClass('dscroll');
	})

});

