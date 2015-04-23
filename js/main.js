// JS loaded
// redirect fr

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}

function switchLang(wantedLang) {
    if(wantedLang != currentLang()) {
        if(wantedLang == 'fr') {
            var newUrl = window.location.protocol + '//' + window.location.host + "/fr" + window.location.pathname + window.location.hash;
            window.location.replace(newUrl);
        } else {
            var path = window.location.pathname.slice(4);
            var newUrl = window.location.protocol + '//' +window.location.host + path + window.location.hash;
            window.location.replace(newUrl);
        }
    }
}

// Get current lang of current page based on its url
function currentLang() {
    if(window.location.pathname.slice(0, 4) == '/fr/') {
        return 'fr';
    } else {
        return 'en';
    }
}

var language = window.navigator.userLanguage || window.navigator.language;
language = language.slice(0,2);


if(getCookie('lang') != '') {
    switchLang(getCookie('lang'));
}else {
    switchLang(language);
}


// Scenario
// J'arrive sur la home page depuis google : avec ou sans cookie : installation du cookie si cookie null ?
// J'arrive sur une page interne : avec ou sans cookie
// Je change la langue en clickant le lien fr/en : instalation du cookie
// Donc: pour chaque chargement de page je verifie le cookie, je set si null, je redirige si language de page != cookie-lang
// Pour la redirection: je test si path commence par /fr/, si oui le language et fr sinon en


// Cookie mng
// Si on est sur la home page: activeand.co/ || activeand.co/fr/
// Si cookie set to en or fr
// Language mng for home page only

//if (window.location.href == 'http://activeand.co/'
      //|| window.location.href == 'http://activeand.co/') {
//if (getCookie('lang') == 'fr') {
  //if (window.location.href == 'http://activeand.co'
      //|| window.location.href == 'http://activeand.co/') {
    //window.location.replace("http://activeand.co/fr");
  //} else if (window.location.href == 'http://localhost:4000/') {
    //window.location.replace("http://localhost:4000/fr");
  //}
//} else if (getCookie('lang') == 'en') {
  //alert(getCookie('lang'));
//} else if (language == 'fr') { // si languare = fr, fr-ca et que url ne commence pas http://activeand.co/fr
  //if (window.location.href == 'http://activeand.co'
      //|| window.location.href == 'http://activeand.co/') {
    //window.location.replace("http://activeand.co/fr");
  //} else if (window.location.href == 'http://localhost:4000/') {
    //window.location.replace("http://localhost:4000/fr");
  //}
//}

// DOM loaded
$(function(){
  // String overload
  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  }

  // set user agent for conditional css http://css-tricks.com/ie-10-specific-styles/
  var doc = document.documentElement;
  doc.setAttribute('data-useragent', navigator.userAgent);
})

// Page loaded
//$(window).bind("load", function() {
$(window).load( function() {
  "use strict";

  //Cache some variables
  var links = $('.navigation').find('a'),
  section = $('section'),
  sectionUrl = $('.section-url'),
  myWindow = $(window),
  htmlbody = $('html,body');

  window.onpopstate = function(event) {
    // dont push state while scrolling...
    //disableSectionUrlWaypoint()
    //setTimeout(function(){
      //enableSectionUrlWaypoint()
    //}, 1500)
    //console.log("location: " + document.location.hash + ", state: " + JSON.stringify(event.state))
    goToByScroll(document.location.hash)
    //$('.section-url').append("asdlfkjf")
  };

  // Language cookie stuffs
  $('#lang-en').click(function(){
    setCookie('lang','en', 20)
  });
  $('#lang-fr').click(function(){
    setCookie('lang','fr', 20)
  });

  $('.waiting').removeClass('animate')
  // inject contact info via js
  $('.phone-contact').append('+33 6 73 85 02 64')
  $('.mail-contact').append('<a href="mailto:hello@activeand.co">hello@activeand.co</a></div>')

  setTimeout(function(){
    $('.browsehappy').remove()
  }, 7000)

  // Home icon hovering
  var defaultIconColor =  "#FC0"
  $('.competence').hover(
    function(){
      var icon = $(this).children('.competence-icon').eq(0)
      var color = icon.attr('data-color')
      icon.css('background-color', color)
      $('.word-emphasis').css('color', color)
    },
    function(){
      var icon = $(this).children('.competence-icon').eq(0)
      icon.css('background-color', defaultIconColor)
      $('.word-emphasis').css('color', defaultIconColor)
    })


  //Setup waypoints plugin
  // Overlay on slides stuffs

  // Remove overlay on reach, both directions
  section.waypoint(function (direction) {
    if(direction === 'down') {
      $(this).addClass('reached')
    }
  }, {
    offset: '40%'
  }).waypoint(function(direction) {
    if(direction === 'up') {
      $(this).addClass('reached')
    }
  }, {
    offset: '-40%'
  })

  // Navigation highlight effect and url update
  // Wait 1 sec after loading: workaround for chrome back to top bug
  setTimeout(function(){
    sectionUrl.waypoint(function (direction) {
      if(direction === 'down') {
        var href = $(this).attr('href')
        pushStateAndMenu(href)
      }
    }, {
      offset: '1%'
    }).waypoint(function(direction){
      if(direction === 'up') {
        var href = $(this).attr('href')
        pushStateAndMenu(href)
      }
    },{
      offset: '-1%'
    })
  }, 2000)

  //When the user clicks on the navigation links, get the data-slide attribute value of the link and pass that variable to the goToByScroll function
  links.click(function (e) {
    e.preventDefault()
    var id = $(this).attr('href')
    if($(id).length) {// slide if we can
      hideAndScroll(id)
    } else {
      window.location = this.href
    }
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

  //Create a function that will be passed a slide number and then will scroll to that slide using jquerys animate. The Jquery
  //easing plugin is also used, so we passed in the easing method of 'easeInOutQuint' which is available throught the plugin.
  function goToByScroll(id) {
    disableSectionUrlWaypoint()
    var duration = 700
    if(id) {
      htmlbody.animate({
        scrollTop: $(id).offset().top
      }, duration, 'easeInOutQuint', enableSectionUrlWaypoint);
    }
    else{
      htmlbody.animate({ scrollTop: 0}, duration, 'easeInOutQuint', enableSectionUrlWaypoint);
    }
    pushStateAndMenu(id)
  }

  
  function pushStateAndMenu(href) {
    $('.navigation a[href!="'+ href +'"]').removeClass('active')
    $('.navigation a[href="' + href + '"]').addClass('active')
    if(document.location.hash != href ) { //  don't duplicate stuffs
      history.pushState(null, null, href)
    }
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


  function enableSectionUrlWaypoint() {
    sectionUrl.waypoint('enable')
  }
  function disableSectionUrlWaypoint() {
    sectionUrl.waypoint('disable')
  }
  function hideAndScroll(id) {
    hideSide(function() {
      goToByScroll(id)
    })
  }

  function isMobile() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }
});

