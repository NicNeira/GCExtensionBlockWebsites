// Función para cargar las opciones guardadas
function loadOptions() {
  chrome.storage.sync.get(["blockedSites", "workingHours"], function (data) {
    document.getElementById("sites").value = (data.blockedSites || []).join(
      "\n"
    );
    document.getElementById("start").value =
      data.workingHours?.start || "09:00";
    document.getElementById("end").value = data.workingHours?.end || "17:00";
  });
}

// Función para guardar las opciones
function saveOptions() {
  console.log("El botón Guardar fue presionado"); // Agregamos el log aquí

  const sites = document
    .getElementById("sites")
    .value.split("\n")
    .filter(Boolean);
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  console.log("Hora de inicio: ", start); // Agregamos el log aquí
  console.log("Hora de fin: ", end); // Agregamos el log aquí
  console.log("Sitios agregados en input paginas a bloquear: ", sites); // Agregamos el log aquí

  chrome.storage.sync.set(
    {
      blockedSites: sites,
      workingHours: { start, end },
    },
    function () {
      const status = document.getElementById("status");
      console.log("Status element:", status);
      if (chrome.runtime.lastError) {
        status.textContent = "Error saving";
        status.className = "badge text-white bg-danger fs-6";
      } else {
        status.textContent = "Succesufully saved";
        status.className = "badge text-white bg-success fs-6";
      }

      // Luego de 3 segundos, borra el mensaje
      setTimeout(function () {
        status.textContent = "";
      }, 3000);
    }
  );
}

// Evento de clic para guardar las opciones
document.getElementById("save").addEventListener("click", saveOptions);
// Cargar las opciones cuando se abre la página
loadOptions();