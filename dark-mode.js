$(document).ready(function () {
  // Comprueba la preferencia guardada en el almacenamiento local
  if (localStorage.getItem("dark-mode") === "true") {
    $("body").addClass("dark-mode");
    $("#darkModeIcon")
      .removeClass("bi-moon-stars-fill")
      .addClass("bi-brightness-high-fill"); // Cambia al icono del sol
    $("#toggleDarkMode")
      .html($("#toggleDarkMode").html().replace("Dark", "Light"))
      .removeClass("btn-outline-primary")
      .addClass("btn-outline-warning"); // Cambia la clase del botón
  }

  $("#toggleDarkMode").on("click", function () {
    $("body").toggleClass("dark-mode");

    // Cambia el icono, el texto y la clase del botón
    if ($("body").hasClass("dark-mode")) {
      $("#darkModeIcon")
        .removeClass("bi-moon-stars-fill")
        .addClass("bi-brightness-high-fill"); // Cambia al icono del sol
      $(this)
        .html($(this).html().replace("Dark", "Light")) // Cambia el texto del botón
        .removeClass("btn-outline-primary")
        .addClass("btn-outline-warning"); // Cambia la clase del botón
      localStorage.setItem("dark-mode", "true");
    } else {
      $("#darkModeIcon")
        .removeClass("bi-brightness-high-fill")
        .addClass("bi-moon-stars-fill"); // Cambia al icono de la luna
      $(this)
        .html($(this).html().replace("Light", "Dark")) // Cambia el texto del botón
        .removeClass("btn-outline-warning")
        .addClass("btn-outline-primary"); // Cambia la clase del botón
      localStorage.setItem("dark-mode", "false");
    }
  });
});
