$(document).ready(function () {
  // Comprueba la preferencia guardada en el almacenamiento local
  if (localStorage.getItem("dark-mode") === "true") {
    $("body").addClass("dark-mode");
  }

  $("#toggleDarkMode").on("click", function () {
    $("body").toggleClass("dark-mode");

    // Almacena la preferencia en el almacenamiento local
    if ($("body").hasClass("dark-mode")) {
      localStorage.setItem("dark-mode", "true");
    } else {
      localStorage.setItem("dark-mode", "false");
    }
  });
});
