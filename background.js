function evaluateBlockingRules() {
  chrome.storage.sync.get(["blockedSites", "workingHours"], function (data) {
    const blockedSites = data.blockedSites || [];
    const workingHours = data.workingHours || { start: 9, end: 17 };

    console.log("Sitios para bloquear:", blockedSites);
    console.log(
      "Durante horas laborales:",
      workingHours.start,
      "a",
      workingHours.end
    );

    function isWorkingTime() {
      const now = new Date();
      return (
        now.getHours() >= workingHours.start &&
        now.getHours() < workingHours.end
      );
    }

    // Obtener las reglas existentes para eliminarlas
    chrome.declarativeNetRequest.getDynamicRules(function (existingRules) {
      let removeRuleIds = [];
      let addRules = [];

      if (isWorkingTime()) {
        console.log("Dentro del horario laboral, bloqueando...");
        // Crear nuevas reglas para bloquear los sitios durante el horario laboral
        addRules = blockedSites.map((site, index) => {
          console.log("Agregando regla con ID:", index + 1000);
          return {
            id: index + 1000,
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
        removeRuleIds = existingRules.map((rule) => rule.id);
      }

      // Actualizar reglas (eliminar las existentes y agregar las nuevas)
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: removeRuleIds,
          addRules: addRules,
        },
        () => {
          console.log("Reglas existentes:", existingRules);
          console.log("Reglas actualizadas");
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
