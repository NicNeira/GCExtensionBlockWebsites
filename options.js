// Función para cargar las opciones guardadas
function loadOptions() {
  chrome.storage.sync.get(['blockedSites', 'workingHours'], function (data) {
    document.getElementById('sites').value = (data.blockedSites || []).join('\n');
    document.getElementById('start').value = data.workingHours?.start || 9;
    document.getElementById('end').value = data.workingHours?.end || 17;
  });
}

// Cargar las opciones cuando se abre la página
loadOptions();

// Guardar las opciones
document.getElementById('save').addEventListener('click', function () {
  const sites = document.getElementById('sites').value.split('\n').filter(Boolean);
  const start = parseInt(document.getElementById('start').value);
  const end = parseInt(document.getElementById('end').value);

  chrome.storage.sync.set({
    blockedSites: sites,
    workingHours: { start, end }
  }, function () {
    alert('Opciones guardadas');
  });
});
