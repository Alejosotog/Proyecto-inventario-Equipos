const API = "http://localhost:3000/api";

/* ================= REGISTRO ================= */
function registrar() {

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Enviando:", nombre, email, password);

    fetch(API + "/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            email,
            password
        })
    })
    .then(res => {
        console.log("Status:", res.status);
        return res.text();
    })
    .then(data => {
        console.log("Respuesta:", data);
        alert(data);
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Error al registrar");
    });
}

/* ================= LOGIN ================= */
function login() {
    fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPassword").value
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            window.location.href = "inventario.html";
        } else {
            alert("Credenciales incorrectas");
        }
    })
    .catch(err => console.error(err));
}

/* ================= CARGAR EQUIPOS ================= */
function cargarEquipos() {

    fetch(API + "/equipos")
        .then(res => res.json())
        .then(data => {

            const tabla = document.getElementById("tablaEquipos");
            if (!tabla) return;

            tabla.innerHTML = "";

            data.forEach(e => {
                tabla.innerHTML += `
                    <tr>
                        <td>${e.nombre}</td>
                        <td>${e.serial}</td>
                        <td>${e.modelo}</td>
                        <td>${e.propietario}</td>
                        <td>${e.magnitud}</td>
                        <td>${e.rango_trabajo}</td>
                        <td>${e.rango_operacion}</td>
                        <td>${e.categoria || "-"}</td>
                        <td>${e.marca || "-"}</td>
                        <td>${e.proveedor || "-"}</td>
                        <td>
                            <button onclick="editarEquipo(${e.id_equipo})">Editar</button>
                        </td>
                    </tr>
                `;
            });

        })
        .catch(err => console.error("Error:", err));
}

/* ================= INICIO ================= */
window.onload = function () {
    cargarEquipos();
    cargarCombos(); // 🔥 llena los select
};

function agregarEquipo() {

    const payload = {
        nombre: document.getElementById("nombreEquipo").value,
        serial: document.getElementById("serial").value,
        modelo: document.getElementById("modelo").value,
        propietario: document.getElementById("propietario").value,
        magnitud: document.getElementById("magnitud").value,
        rango_trabajo: document.getElementById("rangoTrabajo").value,
        rango_operacion: document.getElementById("rangoOperacion").value,

        // 🔥 AQUÍ VA LO QUE ME PREGUNTASTE
        id_categoria: document.getElementById("categoria").value || null,
        id_marca: document.getElementById("marca").value || null,
        id_proveedor: document.getElementById("proveedor").value || null
    };

    fetch(API + "/equipos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        cargarEquipos(); // refresca tabla
    })
    .catch(err => {
        console.error(err);
        alert("Error al guardar equipo");
    });
}

function cargarCombos() {

    // CATEGORÍAS
    fetch(API + "/categorias")
        .then(res => res.json())
        .then(data => {
            const combo = document.getElementById("categoria");
            combo.innerHTML = "<option value=''>Seleccione Categoría</option>";

            data.forEach(c => {
                combo.innerHTML += `<option value="${c.id_categoria}">${c.nombre}</option>`;
            });
        });

    // MARCAS
    fetch(API + "/marcas")
        .then(res => res.json())
        .then(data => {
            const combo = document.getElementById("marca");
            combo.innerHTML = "<option value=''>Seleccione Marca</option>";

            data.forEach(m => {
                combo.innerHTML += `<option value="${m.id_marca}">${m.nombre}</option>`;
            });
        });

    // PROVEEDORES
    fetch(API + "/proveedores")
        .then(res => res.json())
        .then(data => {
            const combo = document.getElementById("proveedor");
            combo.innerHTML = "<option value=''>Seleccione Proveedor</option>";

            data.forEach(p => {
                combo.innerHTML += `<option value="${p.id_proveedor}">${p.nombre}</option>`;
            });
        });
}