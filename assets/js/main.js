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

    // Meme Mode logic (global, works with both button and keyboard trigger)
    (function() {
      let memeActive = false;
      const memeImages = {
        profile: 'assets/img/funny-0.png',
        background: 'assets/img/gmod_background.jpg'
      };
      let originalProfile = null;
      let originalBackground = null;
      function setMemeMode(active) {
        memeActive = active;
        document.documentElement.classList.toggle('meme-mode', memeActive);
        // Swap profile pic
        const profileImg = document.querySelector('.profile-pic img');
        if (profileImg) {
          if (memeActive) {
            if (!originalProfile) originalProfile = profileImg.src;
            profileImg.src = memeImages.profile;
          } else if (originalProfile) {
            profileImg.src = originalProfile;
          }
        }
        // Swap home background
        const homeBg = document.querySelector('.home-bg.bg-1');
        if (homeBg) {
          if (memeActive) {
            if (!originalBackground) originalBackground = homeBg.style.backgroundImage;
            homeBg.style.backgroundImage = `url('${memeImages.background}')`;
          } else if (originalBackground) {
            homeBg.style.backgroundImage = originalBackground;
          }
        }
        // Change main heading text
        const h1 = document.querySelector('.home-text h1');
        if (h1) {
          if (memeActive) {
            h1.dataset.original = h1.textContent;
            h1.textContent = 'Much Code. Very Portfolio. Wow!';
          } else if (h1.dataset.original) {
            h1.textContent = h1.dataset.original;
          }
        }
        // Change all buttons text
        document.querySelectorAll('.btn').forEach(btn => {
          if (memeActive) {
            btn.dataset.original = btn.textContent;
            btn.textContent = '😂 ' + btn.textContent;
          } else if (btn.dataset.original) {
            btn.textContent = btn.dataset.original;
          }
        });
      }
      // Listen for meme mode toggle (keyboard or input)
      window.toggleMemeMode = function() {
        setMemeMode(!memeActive);
      };
    })();

    // Meme Mode: Falling Twitch Emojis
    (function() {
      const emojiList = ['😂','Kappa','PogChamp','LUL','PepeHands','FeelsBadMan','FeelsGoodMan','OMEGALUL','Kreygasm','BibleThump','4Head','TriHard','PogU','monkaS','NotLikeThis','KappaPride','CoolCat','VoHiYo','BlessRNG','KappaClaus'];
      // Use unicode or fallback to text for Twitch emotes
      const emojiUnicode = ['😂','🤣','😎','🔥','💯','😱','😏','😜','😳','😅','😆','😇','😈','👀','🤡','🥳','🤔','😬','😹','🥲'];
      let intervalId = null;
      function randomEmoji() {
        // Use unicode for browser compatibility
        return emojiUnicode[Math.floor(Math.random() * emojiUnicode.length)];
      }
      function createEmoji() {
        const emoji = document.createElement('div');
        emoji.className = 'falling-emoji';
        emoji.textContent = randomEmoji();
        emoji.style.left = Math.random() * 100 + 'vw';
        emoji.style.animationDuration = (1.8 + Math.random() * 2.2) + 's';
        emoji.style.fontSize = (32 + Math.random() * 32) + 'px';
        document.body.appendChild(emoji);
        setTimeout(() => emoji.remove(), 4000);
      }
      function startEmojis() {
        if (intervalId) return;
        intervalId = setInterval(createEmoji, 180);
      }
      function stopEmojis() {
        clearInterval(intervalId);
        intervalId = null;
        document.querySelectorAll('.falling-emoji').forEach(e => e.remove());
      }
      // Hook into meme mode toggle
      const memeButton = document.getElementById('meme-mode-toggle');
      if (memeButton) {
        memeButton.addEventListener('click', function() {
          if (document.documentElement.classList.contains('meme-mode')) {
            startEmojis();
          } else {
            stopEmojis();
          }
        });
      }
    })();

    // Meme Mode: Activate by typing 'Meme' and pressing Enter
    (function() {
      const input = document.getElementById('meme-mode-input');
      const memeButton = document.getElementById('meme-mode-toggle');
      if (memeButton) memeButton.style.display = 'none'; // Hide the old button
      if (!input) return;
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          if (input.value.trim().toLowerCase() === 'meme') {
            window.toggleMemeMode();
            input.value = '';
          } else {
            input.value = '';
            input.placeholder = "Nope! Type 'Meme'";
          }
        }
      });
    })();

    // Meme Mode: Activate by typing 'Meme' anywhere and pressing Enter
    (function() {
      let buffer = '';
      let lastKeyTime = Date.now();
      document.addEventListener('keydown', function(e) {
        // Ignore if typing in an input, textarea, or contenteditable
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable) return;
        const now = Date.now();
        if (now - lastKeyTime > 1500) buffer = '';
        lastKeyTime = now;
        if (e.key.length === 1) {
          buffer += e.key;
          if (buffer.length > 4) buffer = buffer.slice(-4);
        } else if (e.key === 'Enter') {
          if (buffer.toLowerCase() === 'meme') {
            window.toggleMemeMode();
            buffer = '';
          }
        }
      });
    })();

})(jQuery);