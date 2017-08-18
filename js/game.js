$(function() {
	FastClick.attach(document.body);
});
$(document).ready(function(){
	var img = [
    'https://octodex.github.com/images/catstello.png',
    'https://octodex.github.com/images/class-act.png',
    'https://octodex.github.com/images/constructocat2.jpg',
    'https://octodex.github.com/images/codercat.jpg',
    'https://octodex.github.com/images/dodgetocat_v2.png',
    'https://octodex.github.com/images/dojocat.jpg',
    'https://octodex.github.com/images/femalecodertocat.png',
    'https://octodex.github.com/images/filmtocat.png',
    'https://octodex.github.com/images/goretocat.png',
    'https://octodex.github.com/images/gracehoppertocat.jpg',
    'https://octodex.github.com/images/inspectocat.jpg',
    'https://octodex.github.com/images/ironcat.jpg',
    'https://octodex.github.com/images/kimonotocat.png',
    'https://octodex.github.com/images/labtocat.png',
    'https://octodex.github.com/images/linktocat.jpg',
    'https://octodex.github.com/images/megacat-2.png',
    'https://octodex.github.com/images/minertocat.png',
    'https://octodex.github.com/images/momtocat.png',
    'https://octodex.github.com/images/mountietocat.png',
    'https://octodex.github.com/images/octobiwan.jpg',
    'https://octodex.github.com/images/octocat-de-los-muertos.jpg',
    'https://octodex.github.com/images/okal-eltocat.jpg',
    'https://octodex.github.com/images/plumber.jpg',
    'https://octodex.github.com/images/poptocat_v2.png',
    'https://octodex.github.com/images/saketocat.png',
    'https://octodex.github.com/images/saritocat.png',
    'https://octodex.github.com/images/spidertocat.png',
    'https://octodex.github.com/images/steroidtocat.png',
    'https://octodex.github.com/images/supportcat.png',
    'https://octodex.github.com/images/thanktocat.png'
  ];

  var total = 0,
    move = 0,
    count = 1,
    firstCard = null,
    secnodCard = null;

  var stopAutoRotate = false,
    stopClick = true,
    stopTime = true;

  var $card = $('.card'),
    $board = $('.board'),
    $start = $('.start'),
    $again = $('.again');

  var level =1;

  var pid = 0;
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 6; j++) {
      $('.room').append(`
        <div class="card" pid="${pid}">
          <div class="front face"></div>
          <div id="0" class="back face" ></div>
        </div>
      `)
      pid++;
    }
    $('.room').append('<br>')
  }

  img.sort(function(){
    return Math.random()-0.5;
  })


  $start.click(function() {
    img.sort(function(){
      return Math.random()-0.5;
    });
    level == 1 && $('.level').html('Level one 时间在80s以内');
    level == 2 && $('.level').html('Level two 移动次数在80以内');
    level == 3 && $('.level').html('Level third 时间在60s以内，移动次数在60以内');
    $('.level').show();
    total = 0;
    stopAutoRotate = true;
    stopClick = false;
    stopTime = false;
    $('.card').removeClass('flip');
    $start.hide();
    randomImg();
  })

  $again.click(function() {
    $('.c_move').html(0);
    $('.min').html('00');
    $('.sec').html('00');
    $('.level').hide();
    stopAutoRotate = false;
    stopClick = true;
    $start.show();
    $board.hide();
    $('.card').removeClass('fliped');
    randomImg();
    autoRotate();
    autoRotate();
  })

  $board.hide();
  $('.level').hide();
  randomImg();
  autoRotate();
  autoRotate();
  rotate();

  function randomImg() {
    var cardArr = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12];
    var cardLength = cardArr.length;
    var $card = $('.card');

    $card.each(function() {
      var randomNum = Math.floor(Math.random() * (cardLength - 1));

      var temp = cardArr[randomNum];
      cardArr[randomNum] = cardArr[cardLength - 1];
      cardArr[cardLength - 1] = temp;

      cardLength--;

      $(this).find('.back').css({
        'background-image': 'url(' + img[temp - 1] + ')',
        'background-repeat': 'no-repeat',
        'background-size': '100%'
      })

      $(this).find('.back').attr('id', temp);
    })
  }

  function rotate() {
    total = 0;
    move = 0;
    count = 1;
    firstCard = null;
    secondCard = null;
    var $card = $('.card');

    $card.find('.front').click(function() {
      $(this).parent('.card').toggleClass('flip');
      move++;
      $('.c_move').html(move);
      if (count == 1) {
        firstCard = $(this).parent('.card').find('.back').attr('id');
      } else if (count == 2) {
        secondCard = $(this).parent('.card').find('.back').attr('id');
      }
      if (firstCard == secondCard) {
        $(`[id=${firstCard}]`).parent('.card').addClass('fliped')
        total++;
      }
      if (stopClick) {
        return
      }
      count++;
      if (count > 2) {
        firstCard = null;
        secondCard = null;
        count = 1;
        setTimeout(function() {
          $card.removeClass('flip');
        }, 400)
      }
    });

    var sec = 0;
    function addZero(val) {
      return val > 9 ? val: "0" + val;
    }

    function dialog(isVictory,move,color,greet,text){
      stopTime = true;
      stopClick = reset(move, addZero(sec % 60), addZero(parseInt(sec / 60, 10)));
      $board.show();
      $board.css({'color':color})
      $('.greet').html(greet);
      isVictory && level++;
      if(level==4){
        level =1;
      }
      $again.html(text);
    }

    setInterval(function() {
      if (stopTime) {
        sec = 0;
        return;
      }

      if(level==1){
        if(sec<=80 && total==12){
          dialog(true,move,'#4d4ba3','Victory','Next Level');
          move = 0;
          return;
        }else if (sec>80) {
          dialog(false,move,'red','Defeat','Try Again');
          move = 0;
          return;
        }
      }

      if(level==2){
        if(move<=80 && total==12){
          dialog(true,move,'#4d4ba3','Victory','Next Level');
          move = 0;
          return;
        }else if (move>80) {
          dialog(false,move,'red','Defeat','Try Again');
          move = 0;
          return;
        }
      }

      if(level==3){
        if( sec<=60 && move<=60 && total==12){
          dialog(true,move,'#4d4ba3','Victory','Play Again');
          move = 0;
          return;
        }else if (sec>60 || move>60) {
          dialog(false,move,'red','Defeat','Try Again');
          move = 0;
          return;
        }
      }

      sec++;
      $(".sec").html(addZero(sec % 60));
      $(".min").html(addZero(parseInt(sec / 60, 10)));
    }, 1000);

  }

  function autoRotate(time) {
    setTimeout(function() {
      if (stopAutoRotate) {
        return;
      }
      var num = randomNum(1, 24);
      $(`[pid=${num}]`).toggleClass('flip');
      var newTime = randomNum(500, 1000);
      autoRotate(newTime);
    }, time)
  }

  function randomNum(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1) + min);
  }

  function reset(move, sec, min) {
    $board.show();
    $board.find('.scr_moves').html(move);
    $board.find('.scr_sec').html(sec);
    $board.find('.scr_min').html(min);
    return true;
  }
})
