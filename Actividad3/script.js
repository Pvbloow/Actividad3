// Obtener referencia a los elementos del DOM
const selectElement = document.getElementById('indicator-select');
const infoElement = document.getElementById('indicator-info');
const nameElement = document.getElementById('indicator-name');
const valueElement = document.getElementById('indicator-value');
const unitElement = document.getElementById('indicator-unit');
const chartElement = document.getElementById('indicator-chart');

// Obtener los indicadores desde la API y actualizar el selector
async function fetchIndicators() {
  try {
    const response = await axios.get('https://mindicador.cl/api');
    const { data } = response;
    const indicators = Object.keys(data);
    indicators.forEach(indicator => {
      const optionElement = document.createElement('option');
      optionElement.value = indicator;
      optionElement.textContent = indicator;
      selectElement.appendChild(optionElement);
    });
  } catch (error) {
    console.error(error);
  }
}

// Obtener los datos del indicador seleccionado y mostrar la información
async function fetchIndicatorData() {
  const selectedIndicator = selectElement.value;
  if (selectedIndicator) {
    try {
      const response = await axios.get(`https://mindicador.cl/api/${selectedIndicator}`);
      const { data } = response;
      nameElement.textContent = data.nombre;
      valueElement.textContent = data.serie[0].valor;
      unitElement.textContent = data.unidad_medida;
      infoElement.classList.remove('d-none');
      generateChart(data.serie);
    } catch (error) {
      console.error(error);
    }
  } else {
    infoElement.classList.add('d-none');
  }
}

// Generar el gráfico de movimiento del indicador en el último año
function generateChart(series) {
  const labels = series.map(entry => entry.fecha);
  const values = series.map(entry => entry.valor);

  new Chart(chartElement, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Valor',
        data: values,
        borderColor: 'blue',
        borderWidth: 1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Fecha'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Valor'
          }
        }
      }
    }
  });
}

// Cargar los indicadores y configurar el evento de cambio
document.addEventListener('DOMContentLoaded', () => {
  fetchIndicators();
  selectElement.addEventListener('change', fetchIndicatorData);
});