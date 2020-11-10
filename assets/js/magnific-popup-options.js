$(document).ready(function() {
  // MagnificPopup
  var magnifPopup = function() {
    $('.image-popup').magnificPopup({
      type: 'image',
      removalDelay: 300,
      mainClass: 'mfp-with-zoom',
      gallery: {
        enabled:true
      },

      zoom: {
        enabled: true, // By default it's false, so don't forget to enable it
        duration: 300, // duration of the effect, in milliseconds
        easing: 'ease-in-out', // CSS transition easing function

        // The "opener" function should return the element from which popup will be zoomed in
        // and to which popup will be scaled down
        // By default it looks for an image tag:
        opener: function(openerElement)
        {
          // openerElement is the element on which popup was initialized, in this case its <a> tag
          // you don't need to add "opener" option if this code matches your needs, it's default one.
          return openerElement.is('img') ? openerElement : openerElement.find('img');
        },
      },

      image: {
        verticalFit: true,
        markup: '<div class="mfp-figure">'+
            '<div class="mfp-close"></div>'+
            '<div class="mfp-img"></div>'+
            '<div class="custom-bottom-bar">'+
            '<div class="mfp-title"></div>'+
            '</div>'+
            '</div>',

        titleSrc: function(item) {
          return `<a target="_blank" href="` + item.el.attr('blogURL') + `"> ` + item.el.attr('titles') + ` <project class=""></project></a>
                  <a target="_blank" href="` + item.el.attr('codeURL') + `"> ` + item.el.attr('code') + ` <project class=""></project></a>`;

        }
      }
    });
  };

  
  // Call the functions 
  magnifPopup();

});