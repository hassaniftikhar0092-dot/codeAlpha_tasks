function getAge() {
  var birthDate = document.getElementById("birthDateInput").value;

  if (birthDate == "") {
    alert("Please select your birth date first!");
    return;
  }

  var dob = new Date(birthDate);
  var today = new Date();

  var years = today.getFullYear() - dob.getFullYear();
  var months = today.getMonth() - dob.getMonth();
  var days = today.getDate() - dob.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years = years - 1;
    months = 12 + months;
  }

  if (days < 0) {
    days = 30 + days;
    months = months - 1;
  }

  var output = document.getElementById("resultDisplay");
  output.innerHTML =
    "Your Age: " +
    years +
    " Years, " +
    months +
    " Months, and " +
    days +
    " Days.";
}
