// DOM loaded
$(function(){
  $('.progress-bar').addClass('start')
})

// set user agent for conditional css http://css-tricks.com/ie-10-specific-styles/
var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);

// Page loaded
//$(window).bind("load", function() {
$(window).load( function() {
  "use strict";

  $('.progress-bar').remove()
  $('.waiting').removeClass('animate')
  // inject contact info via js
  $('address').html('<a href="mailto:hello@activeand.co">hello@activeand.co</a>')

  //initialise Stellar.js if not on mobile
  //if (!isMobile()) {
    //$(window).stellar({
      //responsive: true
      //, horizontalScrolling:false
    //});
  //}

  // Home icon hovering
  var defaultIconColor =  "#FC0"
  $('.competence-icon').hover(
    function(){
      var color = $(this).attr('data-color')
      $(this).css('background-color', color)
      $('.word-emphasis').css('color', color)
    },
    function(){
      $(this).css('background-color', defaultIconColor)
      $('.word-emphasis').css('color', defaultIconColor)
    })

  //Cache some variables
  var links = $('.navigation').find('a'),
  slide = $('.slide'),
  button = $('.button'),
  mywindow = $(window),
  htmlbody = $('html,body');

  //Setup waypoints plugin
  slide.waypoint(function (direction) {
    var dataslide = $(this).attr('data-slide');
    $('.navigation a[data-slide!="'+ dataslide +'"]').removeClass('active')
    $('.navigation a[data-slide="' + dataslide + '"]').addClass('active')
    if (direction === 'down') {
      $(this).addClass('reached')
    }
  }, { offset: '35%' });

  //waypoints doesnt detect the first slide when user scrolls back up to the top so we add this little bit of code, that removes the class
  //from navigation link slide 2 and adds it to navigation link slide 1.
  mywindow.scroll(function () {
    if (mywindow.scrollTop() == 0) {
      $('.navigation a[data-slide="1"]').addClass('active');
      $('.navigation a[data-slide!="1"]').removeClass('active');
    }
  });

  //Create a function that will be passed a slide number and then will scroll to that slide using jquerys animate. The Jquery
  //easing plugin is also used, so we passed in the easing method of 'easeInOutQuint' which is available throught the plugin.
  function goToByScroll(dataslide) {
    htmlbody.animate({
      scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top
    }, 1000, 'easeInOutQuint');
  }

  //When the user clicks on the navigation links, get the data-slide attribute value of the link and pass that variable to the goToByScroll function
  links.click(function (e) {
    e.preventDefault()
    var dataslide = $(this).attr('data-slide')
    var target_present = $('.slide[data-slide="' + dataslide + '"]').length
    if(target_present) // slide if we can
      hideAndScroll(dataslide)
    else
      window.location = this.href
  })

  $('.home-link').click(function(e){
    e.preventDefault()
    var dataslide
    dataslide = $(this).attr('data-slide')
    if(sideOpen)
      hideAndScroll(dataslide)
    else
      goToByScroll(dataslide)
  })

  //When the user clicks on the button, get the get the data-slide attribute value of the button and pass that variable to the goToByScroll function
  button.click(function (e) {
    var dataslide
    e.preventDefault();
    dataslide = $(this).attr('data-slide');
    goToByScroll(dataslide);
  })

  // Portfolio Animations
  var currentTop = null
  $('.portfolio-item').hover(
    function(){
      var detail = $(this).children('.portfolio-detail')
      currentTop = detail.css('top')
      detail.css('top', currentTop)
      $(this).addClass('hover-in')
      $(this).removeClass('hover-out')
    }
    ,function(){
      var detail = $(this).children('.portfolio-detail')
      currentTop = detail.css('top')
      detail.css('top', currentTop)
      $(this).addClass('hover-out')
      $(this).removeClass('hover-in')
    }
  )

  // show portfolio detail
  $('.face > a').click(function(e){
    e.preventDefault()
    var newLocation = this.href
    $(".slide").removeClass('reached')
    setTimeout(function(){
      location.href = newLocation
    }, 1000)
  })

  // Side bar stuffs
  var sideOpen = false

  $('.icon-menu').click(function(){
    showSide()
  })

  $('.icon-close').click(function(){
    hideSide()
  })

  $('.movable').click(function(){
    if (sideOpen)
      hideSide()
  })

  function hideAndScroll(dataslide) {
    hideSide(function() {
      goToByScroll(dataslide)
    })
  }

  // Helper functions
  function hideSide(cb) {
    var delay = parseFloat($('.movable').css('transitionDuration')) * 1000
    $('.icon-close').hide('drop', 100, function(){
      $('.icon-menu').show('fade', 200)
    })
    $(".movable").removeClass('move')
    // replace sidebar after movable transition
    setTimeout(function(){
      sideOpen = false
      $(".layout-sidebar").css({'right': '-260px'})
      if(cb)
        cb()
    }, delay)
  }

  function showSide() {
    $('.icon-menu').hide('drop', 200, function(){
      $('.icon-close').show('fade', 1000)
    })
    $(".layout-sidebar").css({'right': '0'})
    $(".movable").addClass('move')
    sideOpen = true
  }

  function isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }
});

