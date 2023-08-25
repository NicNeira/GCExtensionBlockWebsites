function evaluateBlockingRules() {
  chrome.storage.sync.get(["blockedSites", "workingHours"], function (data) {
    const blockedSites = data.blockedSites || [];
    const workingHours = data.workingHours || { start: "09:00", end: "18:00" };
    const [startHour, startMinute] = workingHours.start.split(":").map(Number);
    const [endHour, endMinute] = workingHours.end.split(":").map(Number);

    console.log("Sitios para bloquear:", blockedSites);
    console.log(
      "Durante horas laborales:",
      workingHours.start,
      "a",
      workingHours.end
    );

    function isWorkingTime() {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      return (
        (currentHour > startHour ||
          (currentHour === startHour && currentMinute >= startMinute)) &&
        (currentHour < endHour ||
          (currentHour === endHour && currentMinute < endMinute))
      );
    }

    // Obtener las reglas existentes para eliminarlas
    chrome.declarativeNetRequest.getDynamicRules(function (existingRules) {
      // Eliminar todas las reglas existentes
      const removeRuleIds = existingRules.map((rule) => rule.id);
      let addRules = [];

      if (isWorkingTime()) {
        console.log("Dentro del horario laboral, bloqueando...");
        // Crear nuevas reglas para bloquear los sitios durante el horario laboral
        addRules = blockedSites.map((site, index) => {
          const id = site.hashCode();
          console.log("Agregando regla con ID:", id);
          return {
            id: id,
            priority: 1,
            action: { type: "block" },
            condition: { urlFilter: `${site}`, resourceTypes: ["main_frame"] },
          };
        });
      } else {
        console.log(
          "Fuera del horario laboral, eliminando todas las reglas existentes"
        );
        // Si está fuera del horario laboral, elimina todas las reglas existentes
        // removeRuleIds = existingRules.map((rule) => rule.id);
      }

      // Actualizar reglas (eliminar las existentes y agregar las nuevas)
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: removeRuleIds,
          addRules: addRules,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error al actualizar reglas:",
              chrome.runtime.lastError
            );
          } else {
            console.log("Reglas existentes:", existingRules);
            console.log("Reglas actualizadas");
          }
        }
      );
    });
  });
}

// Evaluar las reglas de bloqueo inmediatamente al cargar el script
evaluateBlockingRules();

// Reevaluar las reglas de bloqueo cuando cambian las opciones
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === "sync" && (changes.blockedSites || changes.workingHours)) {
    evaluateBlockingRules();
  }
});

// funcion hasCode para generar un numero aleatorio
String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convertir a un número entero de 32 bits
  }
  return Math.abs(hash); // Utilizar el valor absoluto para asegurar que sea positivo
};
