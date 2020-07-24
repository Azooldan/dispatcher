var config = null;
var page = "/" + $("#pageinfo").attr("page") + "/";
var dateStart = $("#shiftData").attr("dateStart");

$("#startShift").on("click", (e) => {
  $.ajax({
    type: "POST",
    url: page + "Start",
    headers: {
      "Authorization": sessionStorage.getItem('Authorization')
    },
    error: onError
  });
  window.location.reload();
});

$("#endShift").on("click", (e) => {
  $.ajax({
    type: "PUT",
    url: page + "End",
    headers: {
      "Authorization": sessionStorage.getItem('Authorization')
    },
    error: onError
  });
  window.location.reload();
});

function countUpFromTime(countFrom, id) {
  countFrom = new Date(countFrom).getTime();
  var now = new Date(),
    countFrom = new Date(countFrom),
    timeDifference = (now - countFrom);

  var secondsInADay = 60 * 60 * 1000 * 24,
    secondsInAHour = 60 * 60 * 1000;

  days = Math.floor(timeDifference / (secondsInADay) * 1);
  hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
  mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
  secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 * 1);
  
  if(!!idEl){
    var idEl = document.getElementById(id);
    idEl.getElementsByClassName('days')[0].innerHTML = days;
    idEl.getElementsByClassName('hours')[0].innerHTML = hours;
    idEl.getElementsByClassName('minutes')[0].innerHTML = mins;
    idEl.getElementsByClassName('seconds')[0].innerHTML = secs;
  }
  clearTimeout(countUpFromTime.interval);
  countUpFromTime.interval = setTimeout(function () { countUpFromTime(countFrom, id); }, 1000);
}
countUpFromTime(dateStart, 'countup1');