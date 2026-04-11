document.addEventListener("DOMContentLoaded", cargarMarcas);

function cargarMarcas() {
    fetch("http://localhost:3000/api/marcas")
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById("tablaMarcas");
            tabla.innerHTML = "";

            data.forEach(m => {
                tabla.innerHTML += `
                    <tr>
                        <td>${m.id_marca}</td>
                        <td>${m.nombre}</td>
                    </tr>
                `;
            });
        });
}

// GUARDAR
function guardarMarca() {
    const nombre = document.getElementById("nombre").value;

    fetch("http://localhost:3000/api/marcas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre })
    })
    .then(() => {
        alert("Marca guardada ✅");
        cargarMarcas();
    });
}