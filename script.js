// ══════════════════════════════
//  SPLASH SCREEN
// ══════════════════════════════
document.body.style.overflow = 'hidden';
const splash = document.getElementById('splash');
setTimeout(() => {
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.remove();
    document.body.style.overflow = '';
  }, 400);
}, 2000);


// ══════════════════════════════
//  DATE MENU TOGGLE
// ══════════════════════════════
function toggleMenu() {
  document.getElementById("dateMenu").classList.toggle("show");
}


// ══════════════════════════════
//  VIEWS CHART (linha - 28 dias)
// ══════════════════════════════
const labels = [];
const data = [];
const baseDate = new Date(2026, 3, 7);
const seed = [
  2800, 3100, 2600, 3400, 4200, 5100, 4700, 3900, 4100, 4800, 5300, 6100,
  5800, 4900, 5200, 6400, 7200, 6800, 5900, 6200, 7100, 8300, 7600, 6900,
  7400, 8100, 9200, 8700,
];

for (let i = 0; i < 28; i++) {
  const d = new Date(baseDate);
  d.setDate(baseDate.getDate() + i);
  labels.push(d.getDate() + "/" + (d.getMonth() + 1));
  data.push(seed[i]);
}

// Plugin: linha vertical no hover
const hoverLine = {
  id: 'hoverLine',
  afterDatasetsDraw(chart) {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const ctx = chart.ctx;
      const x = chart.tooltip._active[0].element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();
      ctx.restore();
    }
  }
};

// Plugin: tooltip externo customizado
const tooltipPlugin = {
  id: 'externalTooltip',
  afterUpdate(chart) {
    let el = document.getElementById('chart-tooltip');
    if (!el) {
      el = document.createElement('div');
      el.id = 'chart-tooltip';
      el.style.cssText = `
        position: fixed;
        background: #282828;
        border: 1px solid #3e3e3e;
        border-radius: 12px;
        padding: 16px 20px;
        pointer-events: none;
        display: none;
        z-index: 9999;
        min-width: 140px;
      `;
      document.body.appendChild(el);
    }
  },
  afterDraw(chart) {
    const tooltip = chart.tooltip;
    let el = document.getElementById('chart-tooltip');
    if (!el) return;

    if (!tooltip._active || !tooltip._active.length) {
      el.style.display = 'none';
      return;
    }

    const idx = tooltip._active[0].index;
    const value = chart.data.datasets[0].data[idx];
    const d = new Date(2026, 3, 7);
    d.setDate(d.getDate() + idx);
    const dias = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];
    const meses = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
    const label = dias[d.getDay()] + ', ' + d.getDate() + ' de ' + meses[d.getMonth()] + ' ' + d.getFullYear();

    el.innerHTML = `
      <div style="color:#fff;font-size:12px;margin-bottom:8px;">${label}</div>
      <div style="color:#41b4d9;font-size:18px;">${value.toLocaleString('pt-BR')}</div>
    `;

    const pointEl = tooltip._active[0].element;
    const canvasRect = chart.canvas.getBoundingClientRect();
    const x = canvasRect.left + pointEl.x;
    const y = canvasRect.top + pointEl.y;

    el.style.display = 'block';
    const elW = el.offsetWidth;
    el.style.left = (x - elW / 2) + 'px';
    el.style.top = (y - el.offsetHeight - 10) + 'px';
  }
};

new Chart(document.getElementById("viewsChart"), {
  plugins: [hoverLine, tooltipPlugin],
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Visualizações",
        data: data,
        borderColor: "#41b4d9",
        backgroundColor: "rgba(62,166,255,0.12)",
        borderWidth: 2,
        borderJoinStyle: "miter",
        pointRadius: 0,
        pointHoverRadius: 4.5,
        pointHoverBackgroundColor: '#41b4d9',
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#282828',
        fill: true,
        tension: 0,
        clip: false,
      },
    ],
  },
  options: {
    devicePixelRatio: 2,
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#777",
          font: { size: 11 },
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        min: 0,
        max: 9200,
        ticks: { display: false },
        grid: {
          color: (ctx) => ctx.index === 3 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)",
          lineWidth: 1,
          drawTicks: false,
        },
        border: { display: false },
        afterBuildTicks: (axis) => {
          axis.ticks = [
            { value: 0 },
            { value: 3066 },
            { value: 6133 },
            { value: 9200 },
          ];
        },
      },
    },
  },
});


// ══════════════════════════════
//  REALTIME CHART (barras - 48h)
// ══════════════════════════════
const rtData = Array.from({ length: 48 }, () => Math.floor(Math.random() * 800 + 100));

const rtCanvas = document.getElementById('realtimeChart');
rtCanvas.width = rtCanvas.parentElement.offsetWidth;
rtCanvas.height = 60;

new Chart(rtCanvas, {
  type: 'bar',
  data: {
    labels: rtData.map((_, i) => i),
    datasets: [{
      data: rtData,
      backgroundColor: '#41b4d9',
      borderRadius: 0,
      borderSkipped: 'bottom',
      borderColor: '#3e3e3e',
      borderWidth: { bottom: 1 },
    }]
  },
  options: {
    animation: false,
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: { display: false },
      y: {
        display: true,
        min: 0,
        grid: { display: false },
        border: { display: false },
        ticks: { display: false },
      }
    }
  }
});