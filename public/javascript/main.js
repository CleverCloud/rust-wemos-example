// How many wemos are connected. Default is 0
var wemos_count = 0;

// Global variable of the hex color. Default is 0
var hex_color = 0;




// Poll: fetching how many devices are connected from "/status"
(function poll() {
  setTimeout(function () {
    $.ajax({
      url: "/status",
      headers: {
        'Content-Type': 'application/json'
      },
      type: "GET",
      success: function (data) {

        // check if null return (no results from API)
        if (data.client_number == 0) {
        } else if (data.client_number == 1){
          $('h4').html("✅ Wemos is connected");
          $("h4").removeClass("loading");
          return wemos_count = data.client_number;
        }
        else if(data.client_number >= 2) {
          $('h4').html("✅✅✅ Woa! We have several wemos here :)");
          $("h4").removeClass("loading");
          return wemos_count = data.client_number;
        }
      },
      dataType: "json",
      complete: poll,
      timeout: 2000
    })
  }, 3000);
})();

(function () {
  var draw, h, hash, hsl, l, lock, s;

  h = ~~(Math.random() * 360);

  s = 50;

  l = 50;

  //Color picker. Code from https://codepen.io/nokomundo/ 
  var hcl, hsl, lab, rgb;


  draw = function () {
      $('.color div').hide();
      hsl = new d3.hsl(h, s / 100.0, l / 100.0);
      hcl = new d3.hcl(hsl);
      rgb = new d3.rgb(hsl);
      lab = new d3.lab(hsl);
      $('span').html("");
      $('span').append(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      $('body').css("background-color", `hsl(${h}, ${s}%, ${l}%)`);
      return $('body').css("color", `rgb(${Math.min(rgb.r + 96, 255)}, ${Math.min(rgb.g + 96, 255)}, ${Math.min(rgb.b + 96, 255)})`), hex_color = hsl.toString();
    
  };

  $(window).mousemove(function (e) {
    var maxX, maxY, x, y;
    maxX = window.innerWidth;
    maxY = window.innerHeight;
    x = e.pageX;
    y = e.pageY;
    h = ~~(x / maxX * 360);
    l = ~~(y / maxY * 10000) / 100;
    draw();
  });
  
  //Function to send the color on '/color' via XHR
  sendColor = function (red, green, blue) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/color", true);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(red.toString().padStart(3, '0') + green.toString().padStart(3, '0') + blue.toString().padStart(3, '0'));
    if (wemos_count > 0) {
      notify("📡 Sent <code> " + hex_color + "</code>  to  <code>" + wemos_count + "</code>  wemos", "success");
    } else {
      notify("😶 No wemos found", "warning");
    }
  };

  $('body').bind("mousewheel", function (e) {
    var delta;
    if (e.wheelDelta) {
      delta = e.wheelDelta / 120;
    }
    if (e.details) {
      delta = -e.details;
    }
    if (e.originalEvent.wheelDelta) {
      delta = e.originalEvent.wheelDelta / 120;
    }
    if (e.originalEvent.details) {
      delta = -e.originalEvent.details;
    }
    s = Math.max(0, Math.min(100, s + delta * 5));
    draw();
  });

  $('.color div').click(function () {
    return lock = false;
  });
  
  // HTML notification function
  function notify(quote, type) {
    var notifyElement = $("<div />").addClass(type).html(quote);
    $('.notify').prepend(notifyElement);
    setTimeout(function (ele) {
      ele.remove();
    }, 3000, notifyElement);
  }
  //Touch events manager
  document.body.addEventListener('touchstart', function (e) {
    var maxX, maxY, x, y;
    maxX = window.innerWidth;
    maxY = window.innerHeight;
    x = e.pageX;
    y = e.pageY;
    h = ~~(x / maxX * 360);
    l = ~~(y / maxY * 10000) / 100;
    draw();
    sendColor(rgb.r, rgb.g, rgb.b);
  });
  //On Click manager. Send colors to wemos if available
  $(window).click(function () {
    sendColor(rgb.r, rgb.g, rgb.b);
  });

  hash = location.hash.indexOf('(') > 0 ? location.hash.substr(1) : location.hash;

  if (hash.length > 0) {
    hsl = new d3.hsl(hash);
    h = hsl.h;
    s = hsl.s * 100;
    l = hsl.l * 100;
    draw();
    lock = true;
  } else {
    draw();
  }

}).call(this);