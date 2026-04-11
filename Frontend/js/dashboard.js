let datos = JSON.parse(localStorage.getItem("inventario")) || [];

let datosFiltrados = [...datos];

// 🔥 llenar filtros
function llenarFiltros() {
    let categorias = [...new Set(datos.map(e => e.categoria))];
    let marcas = [...new Set(datos.map(e => e.marca))];

    let selectCat = document.getElementById("filtroCategoria");
    let selectMarca = document.getElementById("filtroMarca");

    categorias.forEach(c => {
        if (c) selectCat.innerHTML += `<option>${c}</option>`;
    });

    marcas.forEach(m => {
        if (m) selectMarca.innerHTML += `<option>${m}</option>`;
    });
}

// 🔥 aplicar filtros
function aplicarFiltros() {
    let cat = document.getElementById("filtroCategoria").value;
    let marca = document.getElementById("filtroMarca").value;

    datosFiltrados = datos.filter(e => {
        return (!cat || e.categoria === cat) &&
               (!marca || e.marca === marca);
    });

    renderDashboard();
}

// 🔥 agrupar
function agrupar(campo, defaultVal) {
    let res = {};
    datosFiltrados.forEach(e => {
        let val = e[campo] || defaultVal;
        res[val] = (res[val] || 0) + 1;
    });
    return res;
}

// 🔥 KPIs
function actualizarKPIs() {
    document.getElementById("totalEquipos").innerText = datosFiltrados.length;
    document.getElementById("totalCategorias").innerText =
        new Set(datosFiltrados.map(e => e.categoria)).size;
    document.getElementById("totalMarcas").innerText =
        new Set(datosFiltrados.map(e => e.marca)).size;
    document.getElementById("totalPropietarios").innerText =
        new Set(datosFiltrados.map(e => e.propietario)).size;
}

// 🔥 limpiar gráficos
let charts = [];
function limpiarCharts() {
    charts.forEach(c => c.destroy());
    charts = [];
}

// 🔥 render completo
function renderDashboard() {

    limpiarCharts();
    actualizarKPIs();

    let cat = agrupar("categoria", "Sin categoría");
    let marca = agrupar("marca", "Sin marca");
    let prop = agrupar("propietario", "Sin propietario");
    let mag = agrupar("magnitud", "Sin magnitud");

    charts.push(new Chart(document.getElementById("graficoCategoria"), {
        type: "bar",
        data: { labels: Object.keys(cat), datasets: [{ data: Object.values(cat) }] }
    }));

    charts.push(new Chart(document.getElementById("graficoMarca"), {
        type: "pie",
        data: { labels: Object.keys(marca), datasets: [{ data: Object.values(marca) }] }
    }));

    charts.push(new Chart(document.getElementById("graficoPropietario"), {
        type: "bar",
        data: { labels: Object.keys(prop), datasets: [{ data: Object.values(prop) }] }
    }));

    charts.push(new Chart(document.getElementById("graficoMagnitud"), {
        type: "doughnut",
        data: { labels: Object.keys(mag), datasets: [{ data: Object.values(mag) }] }
    }));
}

// eventos
document.getElementById("filtroCategoria").addEventListener("change", aplicarFiltros);
document.getElementById("filtroMarca").addEventListener("change", aplicarFiltros);

// iniciar
llenarFiltros();
renderDashboard();

function exportarExcel() {

    let datosExportar = datosFiltrados;

    let csv = "Nombre,Serial,Modelo,Propietario,Marca,Categoria\n";

    datosExportar.forEach(e => {
        csv += `${e.nombre},${e.serial},${e.modelo},${e.propietario},${e.marca},${e.categoria}\n`;
    });

    let blob = new Blob([csv], { type: "text/csv" });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "inventario.csv";
    a.click();
}