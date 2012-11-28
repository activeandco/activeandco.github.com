$(function() {
  $("a[rel=popover]")
    .popover({
      content:'En cours de redaction',
      placement:'top',
      delay: { show: 500, hide: 100 }
    })
    .click(function(e) {
      e.preventDefault()
    })
});
