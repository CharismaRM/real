$(document).ready(function() {
  $('.js-faq-item').each(function() {
    var flag = false;
    var $item = $(this);
    var $top = $item.find('.js-faq-item-top');
    var $content = $item.find('.js-faq-item-content');
    var accordionDuration = 500;
    var accordionCallback = function() {
      flag = false;
    };

    $top.on('click', function() {
      if (flag) return false;
      flag = true;

      if ($top.hasClass('-active')) {
        $top.removeClass('-active');
        $content.slideUp(accordionDuration, accordionCallback);
      } else {
        $top.addClass('-active');
        $content.slideDown(accordionDuration, accordionCallback);
      }
    });
  });

  $('.js-scroll-to').on('click', function() {
    var attr = $(this).data('type');
    var $anchor = $('.js-anchor[data-type="' + attr + '"]');

    if ($anchor.length) {
      $('html, body').animate({scrollTop: $anchor.offset().top + 30}, 500);
    }
  });
});