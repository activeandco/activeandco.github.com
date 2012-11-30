$(function() {
  $("a[data-toggle=popover]")
    .popover({
      content:'En cours de rédaction',
      placement:'top',
      delay: { show: 0, hide: 100 }
    })
  .click(function(e) {
    e.preventDefault();
    $(this)
    .next() // select div.popover
    .delay(1500)
    .animate({ top: '-=200px' }, 500, 'easeInBack')
    .fadeOut(0, function(){
      $(this)
      .prev() // select anchor
      .popover('hide');
    });
  })
});
