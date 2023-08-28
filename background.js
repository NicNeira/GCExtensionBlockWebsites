let isAlarmListenerRegistered = false;
let isStorageChangedListenerRegistered = false;

// Función para parsear las horas y minutos
function parseTime(time) {
  return time.split(":").map(Number);
}

// Función para configurar alarmas
function setAlarms(start, end) {
  const [startHour, startMinute] = parseTime(start);
  const [endHour, endMinute] = parseTime(end);
  
  const startDate = new Date();
  const endDate = new Date();
  
  startDate.setHours(startHour, startMinute, 0);
  endDate.setHours(endHour, endMinute, 0);
  
  chrome.alarms.create('startBlocking', { when: startDate.getTime() });
  chrome.alarms.create('endBlocking', { when: endDate.getTime() });
}

if (!isAlarmListenerRegistered) {
  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'startBlocking' || alarm.name === 'endBlocking') {
      evaluateBlockingRules();
    }
  });
  isAlarmListenerRegistered = true;
}


function evaluateBlockingRules() {
  chrome.storage.sync.get(["blockedSites", "workingHours"], function (data) {
    const blockedSites = data.blockedSites || [];
    const workingHours = data.workingHours || { start: "09:00", end: "18:00" };
    


    // Obtener las reglas existentes para eliminarlas
    console.log("Obteniendo reglas existentes para eliminarlas");
    chrome.declarativeNetRequest.getDynamicRules(function (existingRules)
    {
      console.log("Reglas obtenidas:", existingRules);
      // Eliminar todas las reglas existentes
      const removeRuleIds = existingRules.map((rule) => rule.id);
      
      let addRules = [];

      if (isWorkingTime(workingHours)) {
        addRules = createBlockingRules(blockedSites);
      }

      // Actualizar reglas
      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: removeRuleIds,
          addRules: addRules,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Error al actualizar reglas:", chrome.runtime.lastError);
          }
        }
      );
    });
  });
}

function isWorkingTime(workingHours) {
  const [startHour, startMinute] = workingHours.start.split(":").map(Number);
  const [endHour, endMinute] = workingHours.end.split(":").map(Number);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return (
    (currentHour > startHour || (currentHour === startHour && currentMinute >= startMinute)) &&
    (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute))
  );
}

function createBlockingRules(blockedSites) {
  return blockedSites.map((site, index) => {
    const id = generateHashCode(site);
    return {
      id: id,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: `${site}`, resourceTypes: ["main_frame"] },
    };
  });
}

// Reevaluar las reglas de bloqueo cuando cambian las opciones y volver a configurar alarmas
if (!isStorageChangedListenerRegistered) {
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync" && (changes.blockedSites || changes.workingHours)) {
      evaluateBlockingRules();
      if (changes.workingHours) {
        const newWorkingHours = changes.workingHours.newValue || { start: "09:00", end: "18:00" };
        setAlarms(newWorkingHours.start, newWorkingHours.end);  // Configurar nuevas alarmas basadas en el nuevo horario
      }
    }
  });
  isStorageChangedListenerRegistered = true;
}

// Función para generar un hash
function generateHashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convertir a un número entero de 32 bits
  }
  return Math.abs(hash); // Utilizar el valor absoluto para asegurar que sea positivo
}

// Configurar alarmas basadas en las horas de trabajo almacenadas
chrome.storage.sync.get(["workingHours"], function (data) {
  const workingHours = data.workingHours || { start: "09:00", end: "18:00" };
  setAlarms(workingHours.start, workingHours.end);
});

// Evaluar las reglas de bloqueo inmediatamente al cargar el script
evaluateBlockingRules();