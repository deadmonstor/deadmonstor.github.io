/* INDEX OF CONTENTS JAVASCRIPT
==================================================
  XX. PRELOADER
  01. NAVIGATION
  02. MOBILE NAVIGATION
  03. PARALLAX BACKGROUND EFFECT
  04. TEXT ROTATE
  05. HOME ARROW DOWN
  06. SMOTH SCROLL
  07. PORTFOLIO FILTER IMAGE
  08. TESTIMONIAL SLIDER
  09. ANIMATION EFFECT  
*/


(function ($) {
	'use strict';

	jQuery(document).ready(function () {


		/* XX. PRELOADER
		==================================================*/

		$(window).on('load', function () {
			$("#status").fadeOut();
			$("#preloader").delay(500).fadeOut("slow");
		});


		/* 01. NAVIGATION
		==================================================*/

		$(window).on('scroll', function () {
			if ($(window).scrollTop() > 100) {
				$('#navigation').addClass('nav-bg');
			} else {
				$('#navigation').removeClass('nav-bg');
			}
		});


		/* 02. MOBILE NAVIGATION
		==================================================*/

		$(document).on('click', '.navbar-collapse.in', function (e) {
			if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
				$(this).collapse('hide');
			}
		});

		$('body').scrollspy({
			target: '.navbar-collapse',
			offset: 195
		});


		/* 03. PARALLAX BACKGROUND EFFECT
		==================================================*/

		var parallax = function () {
			$(window).stellar();
		};

		$(function () {
			parallax();
		});


		/* 04. TEXT ROTATE
		==================================================*/
		$(document).on('ready', function () {
			$('#text-rotator').rotatetext({
				fadeSpeed: 500,
				pauseSpeed: 2000
			});
		});


		/* 05. HOME ARROW DOWN
		==================================================*/

		var arrowBounce = function () {
			var arrow = $(".arrow");
			if (arrow.hasClass("lift")) {
				arrow.removeClass("lift");
			} else {
				arrow.addClass("lift");
			}
		};

		setInterval(arrowBounce, 800);


		/* 06. SMOTH SCROLL
		==================================================*/

		$('a.smoth-scroll').on('click', function (e) {
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top - 50
			}, 1000);
			e.preventDefault();
		});


		/* 07. PORTFOLIO FILTER IMAGE
		==================================================*/
		$('#port-image').mixItUp({
			animation: {
				duration: 200
			}
		});


		/* 08. TESTIMONIAL SLIDER
		==================================================*/

		$('.flexslider').flexslider({
			animation: "fade",
			directionNav: false
		});


		/* 09. ANIMATION EFFECT
		==================================================*/

		AOS.init({
			duration: 1200,
			once: true,
			});
	});

    // === CLEAN ROTATING BACKGROUND ===
    const portfolioImages = [
        'assets/img/portfolio/portfolio-0.jpg',
        'assets/img/portfolio/fable.jpg',
        'assets/img/portfolio/forza.jpg',
        'assets/img/portfolio/seaofthieves.jpg',
    ];

    function startBackgroundRotation() {
        let current = 0;
        let next = 1;
        let $bg1 = $('.bg-1');
        let $bg2 = $('.bg-2');
        $bg1.css({
            'background-image': `url('${portfolioImages[current]}')`,
            'opacity': 1,
            'z-index': 1
        });
        $bg2.css({
            'background-image': `url('${portfolioImages[next]}')`,
            'opacity': 0,
            'z-index': 0
        });

        setInterval(() => {
            let $visible = ($bg1.css('opacity') == 1) ? $bg1 : $bg2;
            let $hidden = ($bg1.css('opacity') == 0) ? $bg1 : $bg2;

            current = (current + 1) % portfolioImages.length;
            next = (current + 1) % portfolioImages.length;

            $hidden.css({
                'background-image': `url('${portfolioImages[next]}')`
            });

            $hidden.css({
                'z-index': 1,
                'opacity': 1
            });
            $visible.css({
                'z-index': 0
            });

            setTimeout(() => {
                $visible.css({
                    'opacity': 0
                });
            }, 1500);

        }, 5000);
    }

    $(window).on('load', function() {
        startBackgroundRotation();
    });

})(jQuery);