$(document).ready(function() {

  //Get Elements from HTML
  const btnSessAdd = document.getElementById('session-add');
  const btnSessSub = document.getElementById('session-sub');
  const btnBreakAdd = document.getElementById('break-add');
  const btnBreakSub = document.getElementById('break-sub');
  const screen = document

  //Set Clock Initial Variables
  var timeMin = 25,
      timeSec = 0,
      breakMin = 5,
      breakSec = 0,
      running = null,
      breaking;
  //Set Initial State
  updateTime(timeMin,timeSec);
  updateBreak(breakMin, breakSec);
  updateBody("resting");

  //Add listener for sessionAdd button
  btnSessAdd.addEventListener('click', e => {
    timeMin++;
    //Print Changes
    updateTime(timeMin, timeSec);
  });

  //Add listener for sessionSub button
  btnSessSub.addEventListener('click', e => {
    if (timeMin > 0) {
      timeMin--;
    }
    //Print Changes
    updateTime(timeMin, timeSec);
  });

  //Add listener for breakAdd button
  btnBreakAdd.addEventListener('click', e => {
    breakMin++;
    //Print Changes
    updateBreak(breakMin, breakSec);
  });

  //Add listener for breakSub button
  btnBreakSub.addEventListener('click', e => {
    if (breakMin > 0) {
      breakMin--;
    }
    //Print Changes
    updateBreak(breakMin, breakSec);
  });

  //Add listener for screen click
  $(document).click(function(e) {
    if (running != null) {//Stop timer
      window.clearInterval(running);
      window.clearInterval(breaking);
      $(".btn").show();
      updateBody("resting");
      running = null;
    } else {
      //Prevents button clicks from starting timer
      if (e.target.id != "session-add" && e.target.id != "session-sub" && e.target.id != "break-add" && e.target.id != "break-sub") {
        $(".btn").css("display", "none");
        updateBody("active");
        running = window.setInterval(tic,1000);
      }
    }
  });

  //Updates time to user
  function updateTime(min, sec) {
    if (sec < 10) {
      sec = 0 + "" + sec;
    }
    if (min === 0) {
      min = "";
    }
    $("#time").html(min + " " + sec);
  };

  //Updates break to user
  function updateBreak(min, sec) {
    if (sec < 10) {
      sec = 0 + "" + sec;
    }
    if (min === 0) {
      min = "";
    }
    $("#secondary-text").html(min + " " + sec);
  };

  //timer function for ACTIVE
  function tic() {
    if (timeSec == 0) {
      if (timeMin == 0) {
        window.clearInterval(running);
        timeMin = 25;
        timeSec = 00;
        updateBody("breaking");
        breaking = window.setInterval(toc,1000);
      } else {
        timeSec = 59;
        timeMin--;
      }
    } else {
      timeSec--;
    }
    //Print Changes
    updateTime(timeMin, timeSec);
  };

    //timer function FOR BREAK
  function toc() {
    if (breakSec == 0) {
      if (breakMin == 0) {
        window.clearInterval(breaking);
        breakMin = 5;
        breakSec = 00;
        updateBody("active");
        running = window.setInterval(tic,1000);
      } else {
        breakSec = 59;
        breakMin--;
      }
    } else {
      breakSec--;
    }
    //Print Changes
    updateBreak(breakMin, breakSec);
  };

  //updates body
  function updateBody(newClass) {
    $("body").attr('class', newClass + "body");
    $("h1").attr('class', newClass + "Session");
    $("h3").attr('class', newClass + "Break");
  }
});
