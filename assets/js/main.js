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

    // Meme Mode: Random Joke Popups
    (function() {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "I would tell you a UDP joke, but you might not get it.",
        "Why do Java developers wear glasses? Because they don't see sharp!",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
        "To understand what recursion is, you must first understand recursion.",
        "There are 10 types of people in the world: those who understand binary and those who don't.",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "Why did the developer go broke? Because he used up all his cache.",
        "Real programmers count from 0.",
        "It's not a bug, it's an undocumented feature!",
        "Why do Python programmers wear glasses? Because they can't C.",
        "Why did the computer show up at work late? It had a hard drive!",
        "Why was the JavaScript developer sad? Because he didn't 'null' his feelings.",
        "Why did the function return early? Because it had a date!",
        "Why do programmers hate nature? It has too many bugs.",
        "Why did the programmer quit his job? Because he didn't get arrays.",
        "Why do C# and Java developers keep breaking their keyboards? Because they use a strongly typed language!",
        "Why did the developer go broke? Because he lost his domain in a bet.",
        "Why did the computer get cold? Because it left its Windows open!",
        "Why did the developer go broke? Because he used up all his cache.",
        "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25.",
        "Why did the developer go broke? Because he lost his class.",
        "Why did the developer get stuck in the shower? The instructions on the shampoo bottle said: Lather, Rinse, Repeat.",
        "Why did the developer cross the road? To get to the other IDE.",
        "Why did the developer get kicked out of school? Because he kept taking classes!",
        "Why did the developer get a promotion? Because he was outstanding in his field (of code).",
        "Why did the developer get a job at the bakery? Because he was good at making cookies.",
        "Why did the developer get a job at the zoo? Because he was good at handling exceptions.",
        "Why did the developer get a job at the circus? Because he was good at juggling tasks.",
      ];
      let jokeInterval = null;
      function showJoke() {
        if (!document.documentElement.classList.contains('meme-mode')) return;
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        const popup = document.createElement('div');
        popup.className = 'meme-joke-popup';
        popup.textContent = joke;
		popup.style.zIndex = 100002;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 10);
        setTimeout(() => {
          popup.classList.remove('show');
          setTimeout(() => popup.remove(), 3000);
        }, 4000);
        for (let i = 0; i < 500 + Math.floor(Math.random() * 12); i++) {
          const conf = document.createElement('div');
          conf.className = 'falling-confetti';
          conf.style.left = Math.random() * 100 + 'vw';
          conf.style.background = `hsl(${Math.floor(Math.random()*360)},90%,60%)`;
          conf.style.width = (8 + Math.random() * 10) + 'px';
          conf.style.height = (8 + Math.random() * 18) + 'px';
          conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
          conf.style.opacity = 0.85 + Math.random() * 0.15;
          conf.style.transform = `rotate(${Math.random()*360}deg)`;
          conf.style.animationDuration = (1.2 + Math.random() * 1.7) + 's';
          document.body.appendChild(conf);
          setTimeout(() => conf.remove(), 2600);
        }
      }
      function startJokes() {
        if (jokeInterval) return;
        showJoke();
        jokeInterval = setInterval(showJoke, 5000);
      }
      function stopJokes() {
        clearInterval(jokeInterval);
        jokeInterval = null;
        document.querySelectorAll('.meme-joke-popup').forEach(e => e.remove());
      }
      // Hook into meme mode toggle
      window.toggleMemeMode = (function(orig) {
        return function() {
          const wasActive = document.documentElement.classList.contains('meme-mode');
          orig();
          const isActive = document.documentElement.classList.contains('meme-mode');
          if (!wasActive && isActive) startJokes();
          if (wasActive && !isActive) stopJokes();
        };
      })(window.toggleMemeMode);
    })();

    // Meme Mode: Random Meme Images
    (function() {
      const memeImages = [
		'https://i.imgur.com/rLOmvW4.png',
		'https://media1.tenor.com/m/6RGcH9ceEksAAAAd/cookie-monster-dance-gif.gif',
		'https://media1.tenor.com/m/Km11GYbvYY0AAAAd/good-morning.gif',
		'https://media1.tenor.com/m/rsq2LxLnwrMAAAAC/krind%C5%BE.gif',
		'https://media1.tenor.com/m/EEqbeL495EkAAAAC/cringe.gif',
		'https://media.tenor.com/4G25x-MArX0AAAAi/primitive-sponge.gif',
		'https://media.tenor.com/kR2GIxKDXx4AAAAi/erm-actuay-emoji.gif',
		'https://media1.tenor.com/m/xqtPquuLUfQAAAAC/actually.gif',
		'https://media1.tenor.com/m/mn8DAhCjE3oAAAAd/kurt-angle-me-when.gif',
		'https://media1.tenor.com/m/sidMbBYqr0EAAAAd/meme-made.gif',
		'https://media1.tenor.com/m/qgup92O0bZYAAAPo/lost-jdkd.mp4',
		'https://media1.tenor.com/m/_gfqfXAP08IAAAAd/polish-cow-cow.gif',
		'https://media1.tenor.com/m/c9j30TTvR2cAAAAd/l-ratio-yapper-l-ratio-yap.gif',
      ];
      let memeInterval = null;
      function showMemeImage() {
        if (!document.documentElement.classList.contains('meme-mode')) return;
        const count = 2 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
          const url = memeImages[Math.floor(Math.random() * memeImages.length)];
          const img = document.createElement('img');
          img.src = url;
          img.className = 'meme-float-img meme-float-rainbow';
          img.style.position = 'fixed';
          img.style.left = Math.random() * 80 + 'vw';
          img.style.top = Math.random() * 60 + 'vh';
          img.style.width = (80 + Math.random() * 280) + 'px';
          img.style.zIndex = 100001;
          img.style.pointerEvents = 'none';
          img.style.opacity = '0.92';
          img.style.transform = `rotate(${Math.random()*40-20}deg)`;
          img.style.transition = 'opacity 0.7s, filter 0.7s';
          document.body.appendChild(img);
          setTimeout(() => img.style.opacity = '0', 2500);
          setTimeout(() => img.remove(), 3200);
        }
      }
      function startMemes() {
        if (memeInterval) return;
        memeInterval = setInterval(showMemeImage, 3500);
      }
      function stopMemes() {
        clearInterval(memeInterval);
        memeInterval = null;
        document.querySelectorAll('.meme-float-img').forEach(e => e.remove());
      }
      // Hook into meme mode toggle
      window.toggleMemeMode = (function(orig) {
        return function() {
          const wasActive = document.documentElement.classList.contains('meme-mode');
          orig();
          const isActive = document.documentElement.classList.contains('meme-mode');
          if (!wasActive && isActive) startMemes();
          if (wasActive && !isActive) stopMemes();
        };
      })(window.toggleMemeMode);
    })();

})(jQuery);