import { writeIsOpen, writeDoorAlert } from "./firebase.js";

function validateLogin() {
  roomNow = document.getElementById("floatingSelectGrid").value;
  let room = document.getElementById("floatingSelectGrid").value;
  let pw = document.getElementById("inputPassword").value;
  if (room == "กรุณาเลือกห้องของคุณ") {
    $("#validateModal1").modal("toggle");
  } else if (pw == "") {
    $("#validateModal2").modal("toggle");
  } else if (!checkPassword(room, pw)) {
    $("#validateModal3").modal("toggle");
    document.getElementById("inputPassword").classList.add("is-invalid");
    document.getElementById("uncorrectPassword").style.display = "block";
    document.getElementById("inputPassword").value = "";
  } else if (!peopleSensor) {
    $("#validateModal4").modal("toggle");
  } else {
    writeIsOpen(true);
    $("#complete_login").modal("toggle");
    document.getElementById("inputPassword").classList.remove("is-invalid");
    document.getElementById("inputPassword").classList.add("is-valid");
    document.getElementById("uncorrectPassword").style.color = "green";
    document.getElementById("uncorrectPassword").style.display = "block";
    document.getElementById("uncorrectPassword").innerHTML =
      "รหัสผ่านของคุณถูกต้อง";
    countdown();
  }
}

let roomNow = document.getElementById("floatingSelectGrid").value;

function reset(evt) {
  if (evt.target.value !== roomNow) {
    roomNow = evt.target.value;
    document.getElementById("inputPassword").classList.remove("is-invalid");
    document.getElementById("uncorrectPassword").style.display = "none";
    document.getElementById("inputPassword").value = "";
  }
}

function checkPassword(room, pw) {
  if (room == "1") {
    return pw == "12345";
  }
  if (room == "2") {
    return pw == "23456";
  }
  if (room == "3") {
    return pw == "34567";
  }
}

function countdown() {
  // Set the date we're counting down to
  var countDown = 10;

  // Update the count down every 1 second
  var x = setInterval(function () {
    countDown = countDown - 1;

    // Display the result in the element with id="demo"
    document.getElementById("countdown").innerHTML =
      "โปรดเข้าห้องภายใน " + (countDown + 1) + " วินาที";

    // If the count down is finished, write some text
    if (countDown < 0) {
      clearInterval(x);
      writeIsOpen(false);
      $("#complete_login").modal("hide");
      $("#complete_login").on("hidden.bs.modal", function (e) {
        location.reload();
      });
    }
  }, 1000);
}

let peopleSensor = false;

export function setDetectPeopleSensor(signal) {
  peopleSensor = signal == 1;
  // console.log(peopleSensor);
}

export function doorAlert() {
  $("#validateModal1").modal("hide");
  $("#validateModal2").modal("hide");
  $("#validateModal3").modal("hide");
  $("#validateModal4").modal("hide");
  $("#complete_login").modal("hide");
  $("#door_alert").modal("hide");
  $("#door_alert").modal("toggle");
}

const roomChange = document.querySelector("#floatingSelectGrid");

roomChange.addEventListener("change", (event) => {
  reset(event);
});

const loginButton = document.querySelector("#login");

loginButton.addEventListener("click", validateLogin);

const door_alert = document.querySelector("#close_door_alert");

door_alert.addEventListener("click", (event) => {
  $("#door_alert").modal("hide");
  writeDoorAlert(0);
});

const phone = document.querySelector("#phone");

phone.addEventListener("click", (event) => {
  writeDoorAlert(0);
});

// writeDoorAlert(0);
