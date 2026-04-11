document.addEventListener("DOMContentLoaded", cargarProveedores);

function cargarProveedores() {
    fetch("http://localhost:3000/api/proveedores")
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById("tablaProveedores");
            tabla.innerHTML = "";

            data.forEach(p => {
                tabla.innerHTML += `
                    <tr>
                        <td>${p.id_proveedor}</td>
                        <td>${p.nombre}</td>
                        <td>${p.telefono}</td>
                        <td>${p.email}</td>
                    </tr>
                `;
            });
        });
}

// GUARDAR
function guardarProveedor() {
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    fetch("http://localhost:3000/api/proveedores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, telefono, email })
    })
    .then(() => {
        alert("Proveedor guardado ✅");
        cargarProveedores();
    });
}