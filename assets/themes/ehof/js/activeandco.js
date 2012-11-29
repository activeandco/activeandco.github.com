$(function() {
  $("a[rel=popover]")
    .popover({
      content:'En cours de rédaction',
      placement:'top',
      delay: { show: 0, hide: 100 }
    })
    .click(function(e) {
      e.preventDefault();
      //$(this).delay('90').popover('hide');
    })
    .mouseleave(function(e) {
      $(".popover")
      .delay(50)
      .animate({ top: '-=200px' }, 500, 'easeInBack')
      .fadeOut(0, function(){
        $("a[rel=popver]").delay(550).popover('hide');
      });
    })
});
