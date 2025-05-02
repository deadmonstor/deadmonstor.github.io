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

    const blogPosts = [
      {
        title: "The tools we used within Acorn2D",
        description: "The architecture of my Custom 2D multiplayer engine",
        image: "assets/img/portfolio/portfolio-12.png",
        url: "blog_acorn2d.html"
      },
      {
        title: "Conclusion on MMO Services/Sharded Backend",
        description: "Things I learnt from my MMO Services/Sharded Backend project",
        image: "assets/img/portfolio/portfolio-9.jpg",
        url: "blog_mmo.html"
      },
      {
        title: "Conclusion on Tower Defence Project",
        description: "Things I learnt from my Tower Defence project",
        image: "assets/img/portfolio/portfolio-0.jpg",
        url: "blog_towerdefence.html"
      },
      {
        title: "Conclusion on Mario Recreation Project",
        description: "Things I learnt from my Mario Recreation project",
        image: "assets/img/portfolio/portfolio-1.jpg",
        url: "blog_mario.html"
      },
      {
        title: "Object Pooling",
        description: "The issues with using Object Pooling in a fully multiplayer game.",
        image: "assets/img/portfolio/portfolio-11.png",
        url: "blog_01.html"
      },
      {
        title: "How Garry's Mod kick-started my love for Game Development/Programming",
        description: "My history with Garry's Mod",
        image: "assets/img/gmod.jpg",
        url: "blog_gmod.html"
      }
    ];

    function renderBlogPosts(posts) {
      const blogList = document.getElementById('blog-list');
      if (!blogList) return;
      let html = '<div class="row">';
      posts.forEach((post, i) => {
        if (i > 0 && i % 3 === 0) html += '</div><div class="row" style="margin-top: 30px;">';
        html += `
          <div class="col-md-4 col-sm-6">
            <div class="blog-item">
              <a href="${post.url}" class="blog-img">
                <img src="${post.image}"${post.title.includes('Garry') ? ' style="height: 240px"' : ''}>
              </a>
              <div class="blog-desc">
                <h4>${post.title}</h4>
                <p>${post.description}</p>
                <a href="${post.url}" class="btn btn-dark blog-removeunderline">View Blog</a>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      blogList.innerHTML = html;
    }

    document.addEventListener('DOMContentLoaded', function() {
      renderBlogPosts(blogPosts);
    });

    const projectList = [
      {
        title: "Sea of Thieves",
        classes: "professional csharp unreal grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/portfolio/seaofthieves.jpg",
        alt: "Sea of Thieves",
        summary: "Worked as a Software Engineer on the networking and performance aspects of Sea of Thieves using C++ and Unreal Engine.",
        date: "2024 - Present",
        links: [
          { url: "https://www.seaofthieves.com/", text: "Read More" }
        ]
      },
      {
        title: "Fable",
        classes: "professional csharp custom-engine grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/portfolio/fable.jpg",
        alt: "Fable",
        summary: "Worked on creating and maintaining internal toolsets for Playground Games on the Fable project using C# and WPF.",
        date: "2022",
        links: [
          { url: "https://www.xbox.com/en-GB/games/fable", text: "Read More" }
        ]
      },
      {
        title: "Forza Horizon",
        classes: "professional csharp custom-engine grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/portfolio/forza.jpg",
        alt: "Forza Horizon",
        summary: "Worked on various aspects of Forza Horizon using C# and custom engine tools.",
        date: "2022",
        links: [
          { url: "https://forza.net/", text: "Read More" }
        ]
      },
      {
        title: "Acorn2D",
        classes: "professional cplusplus lua custom-engine grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/portfolio/portfolio-12.png",
        alt: "Acorn2D",
        summary: "Developed a custom 2D multiplayer engine using C++",
        date: "2024",
        links: [
          { url: "blog_acorn2d.html", text: "Read More" }
        ]
      },
      {
        title: "MMO Services/Sharded Backend",
        classes: "universityprojects csharp custom-engine unity grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/portfolio/portfolio-9.jpg",
        alt: "MMO Services/Sharded Backend",
        summary: "Developed a multiple backend system for creating a game with C# backend and Unity frontend.",
        date: "2023",
        links: [
          { url: "blog_mmo.html", text: "Read More" }
        ]
      },
      {
        title: "Into the Crypt",
        classes: "universityprojects cplusplus custom-engine grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/portfolio/portfolio-7.jpg",
        alt: "Into the Crypt",
        summary: "Worked on various aspects of the game engine and game development using C++ and OpenGL.",
        date: "2023",
        links: []
      },
      {
        title: "Mario Kart Remake",
        classes: "universityprojects unity csharp grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/portfolio/portfolio-6.jpg",
        alt: "Mario Kart Remake",
        summary: "Remade Mario Kart within Unity using C#.",
        date: "2023",
        links: []
      },
      {
        title: "Online Multiplayer Tower Defence",
        classes: "universityprojects unity csharp grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/portfolio/portfolio-0.jpg",
        alt: "Online Multiplayer Tower Defence",
        summary: "Developed an online multiplayer tower defence game within Unity using C#.",
        date: "2023",
        links: [
          { url: "blog_towerdefence.html", text: "Read More" }
        ]
      },
      {
        title: "Garry's mod Content Creation",
        classes: "personalprojects otherengine lua grid mix col-md-4 col-sm-6 col-xs-12",
        image: "assets/img/gmod.jpg",
        alt: "Garry's mod Content Creation",
        summary: "Created custom content for Garry's Mod using Lua.",
        date: "2015",
        links: [
          { url: "blog_gmod.html", text: "Read More" }
        ]
      }
    ];

    function renderProjects(projects) {
      const container = document.getElementById('project-list');
      if (!container) return;
      let html = '<div id="port-image" class="container"><div class="row">';
      projects.forEach((proj, i) => {
        html += `
          <div class="${proj.classes}">
            <h3 class="title">${proj.title}</h3>
            <figure class="port-desc">
              <img src="${proj.image}" class="img-responsive" alt="${proj.alt}">
              <figcaption>
                <div class="project-summary">${proj.summary}</div>
                <div class="project-date">Date: ${proj.date}</div>
                <div class="project-links">
                  ${proj.links.map(link => `<a href="${link.url}"}>${link.text}</a>`).join('')}
                </div>
              </figcaption>
            </figure>
          </div>
        `;
      });
      html += '</div></div>';
      container.innerHTML = html;
    }

    document.addEventListener('DOMContentLoaded', function() {
      renderProjects(projectList);
      
      if (window.$ && $('#port-image').mixItUp) {
        $('#port-image').mixItUp({
          animation: { duration: 200 }
        });
      }
    });

    const experienceList = [
      {
        date: "June 2024 – Present",
        company: "Flix Interactive",
        companyUrl: "https://www.flixinteractive.com/",
        title: "Software Engineer Level 1",
        description: "Software Engineer L1 working on Sea of Thieves (C++, Unreal Engine). Focused on networking and performance for major game updates within strict performance budgets."
      },
      {
        date: "Present",
        company: "Idle Fields",
        companyUrl: "https://store.steampowered.com/app/1807570/Idle_Fields/",
        title: "Developer",
        description: "Co-developing 'Idle Fields' using C# and Unity. Available on Steam: <a target=\"_blank\" href=\"https://store.steampowered.com/app/1807570/Idle_Fields/\">Idle Fields</a>"
      },
      {
        date: "July 2023 – June 2024",
        company: "Flix Interactive",
        companyUrl: "https://www.flixinteractive.com/",
        title: "Junior Engineer",
        description: "Junior Engineer on Sea of Thieves (C++, Unreal Engine). Contributed to major updates, focusing on networking, performance, and engine modifications."
      },
      {
        date: "2021 – 2022",
        company: "Playground Games",
        companyUrl: "https://www.playground-games.com/",
        title: "Associate Engineer (Placement)",
        description: "University Placement on the Fable project. Developed and maintained internal tools (C#, WPF), collaborating with content creators to improve workflows and fix bugs."
      },
      {
        date: "September 2019 – April 2023",
        company: "Staffordshire University",
        companyUrl: null,
        title: "BSc Computer Games Development",
        description: "Developed diverse projects: MMO backend, mobile/console games (C++/C#, Unreal/Unity), networked AI, OpenGL, and engine development."
      },
      {
        date: "2013 – 2018",
        company: "Personal projects - Garry's Mod",
        companyUrl: null,
        title: null,
        description: "Started game development creating custom Garry's Mod content (Lua). Gained foundational coding/optimisation skills. Content reached thousands, solidifying career path."
      }
    ];

    function parseExperienceDate(dateStr) {
      if (!dateStr) return 0;
      if (dateStr.toLowerCase().includes('present')) return Date.now();
      const yearMatch = dateStr.match(/(\d{4})/g);
      if (yearMatch && yearMatch.length > 0) {
        return new Date(parseInt(yearMatch[yearMatch.length - 1]), 11, 31).getTime();
      }
      return 0;
    }

    function renderExperiences(experiences) {
      const container = document.getElementById('experience-list');
      if (!container) return;
      // Sort by end date descending (most recent first)
      const sorted = experiences.slice().sort((a, b) => parseExperienceDate(b.date) - parseExperienceDate(a.date));
      let html = '<div id="experience-timeline">';
      sorted.forEach(exp => {
        html += `
          <div class="vtimeline-point">
            <div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>
            <div class="vtimeline-block">
              <span class="vtimeline-date">${exp.date}</span>
              <div data-date="${exp.date}" class="vtimeline-content">
                <h3>${exp.companyUrl ? `<a target=\"_blank\" href=\"${exp.companyUrl}\">${exp.company}</a>` : exp.company}</h3>
                ${exp.title ? `<h4>${exp.title}</h4>` : ''}
                <p>${exp.description}</p>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      container.innerHTML = html;
    }

    document.addEventListener('DOMContentLoaded', function() {
      renderExperiences(experienceList);
    });

    function getNavbarHtml() {
      const page = window.location.pathname.split('/').pop() || 'index.html';
      const isIndex = page === 'index.html' || page === '';
      const navLinks = [
        { name: 'Home', href: isIndex ? '#home' : 'index.html#home', id: 'home' },
        { name: 'About', href: isIndex ? '#about' : 'index.html#about', id: 'about' },
        { name: 'Experiences', href: isIndex ? '#experience' : 'index.html#experience', id: 'experience' },
        { name: 'Portfolio', href: isIndex ? '#portfolio' : 'index.html#portfolio', id: 'portfolio' },
        { name: 'Blog', href: isIndex ? '#blog' : 'index.html#blog', id: 'blog' },
        { name: 'Contact', href: isIndex ? '#contact' : 'index.html#contact', id: 'contact' },
      ];
      let active = window.location.hash.replace('#', '') || (isIndex ? 'home' : 'blog');
      if (!isIndex) active = 'blog';
      return `
        <div class="container">
          <div class="row">
            <div class="col-sm-3">
              <div class="logo">
                <a href="index.html">Joshua Mobley</a>
              </div>
            </div>
            <div class="col-sm-9">
              <div class="navigation-menu">
                <div class="navbar">
                  <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                      <span class="sr-only">Toggle navigation</span>
                      <span class="icon-bar"></span>
                      <span class="icon-bar"></span>
                      <span class="icon-bar"></span>
                    </button>
                  </div>
                  <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav navbar-right">
                      ${navLinks.map(link => `<li><a class="smoth-scroll${active === link.id ? ' active' : ''}" href="${link.href}">${link.name}</a></li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    document.addEventListener('DOMContentLoaded', function() {
      var nav = document.getElementById('navigation');
      if (nav) nav.innerHTML = getNavbarHtml();
      $(document).on('click', 'a.smoth-scroll', function (e) {
        var anchor = $(this);
        var href = anchor.attr('href');
        if (href && href.startsWith('#') && $(href).length) {
          $('html, body').stop().animate({
            scrollTop: $(href).offset().top - 50
          }, 1000);
          e.preventDefault();
        }
      });
      $(document).on('click', '.navbar-collapse.in', function (e) {
        if ($(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle') {
          $(this).collapse('hide');
        }
      });
    });

})(jQuery);