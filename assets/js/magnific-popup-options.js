$(document).ready(function () {
  var magnifPopup = function () {
    $('.image-popup').magnificPopup({
      type: 'image',
      removalDelay: 300,
      mainClass: 'mfp-with-zoom',
      gallery: {
        enabled: true
      },

      zoom: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out',
        opener: function (openerElement) {
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        },
      },

      image: {
        verticalFit: true,
        markup: '<div class="mfp-figure">' +
          '<div class="mfp-close"></div>' +
          '<div class="mfp-img"></div>' +
          '<div class="custom-bottom-bar">' +
          '<div class="mfp-title"></div>' +
          '</div>' +
          '</div>',

        titleSrc: function (item) {
          return `<a target="_blank" href="` + item.el.attr('blogURL') + `"> ` + item.el.attr('titles') + ` <project class=""></project></a>
                  <a target="_blank" href="` + item.el.attr('codeURL') + `"> ` + item.el.attr('code') + ` <project class=""></project></a>`;

        }
      }
    });
  };

  magnifPopup();

});