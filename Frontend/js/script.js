const API = "http://localhost:3000/api";

let idEditar = null;

/* ================= REGISTRO ================= */
function registrar() {

    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const nombre = nombreInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // 🔥 VALIDACIÓN EMAIL
    if (!validarEmail(email)) {
        alert("Email inválido");
        emailInput.classList.add("error");
        return;
    } else {
        emailInput.classList.remove("error");
        emailInput.classList.add("success");
    }

    // 🔥 VALIDACIÓN PASSWORD
    if (!validarPassword(password)) {
        alert("La contraseña debe tener mínimo 5 caracteres y un número");
        passwordInput.classList.add("error");
        return;
    } else {
        passwordInput.classList.remove("error");
        passwordInput.classList.add("success");
    }

    // 🔥 SI TODO OK → ENVÍA
    fetch(API + "/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password })
    })
    .then(res => res.text())
    .then(data => alert(data))
    .catch(() => alert("Error al registrar"));
}


/* ================= VALIDAR EMAIL ================= */

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/* ================= VALIDAR PASSWORD MINIMO 5 CARACTERES================= */

function validarPassword(password) {
    const regex = /^(?=.*[0-9]).{5,}$/;
    return regex.test(password);
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
        if (data.success) window.location.href = "inventario.html";
        else alert("Credenciales incorrectas");
    });
}

/* ================= EQUIPOS ================= */

function cargarEquipos() {
    fetch(API + "/equipos")
        .then(res => res.json())
        .then(data => {

            localStorage.setItem("inventario", JSON.stringify(data));
            console.log("DATOS ACTUALIZADOS:", data);

            const tabla = document.getElementById("tablaEquipos");
            if (!tabla) return;

            tabla.innerHTML = "";

            data.forEach(e => {

                // ✅ AQUÍ VA EL JS (FUERA DEL HTML)
                const nombreImg = formatearNombre(e.nombre) + ".PNG";
                console.log("BUSCANDO:", nombreImg);

                // ✅ AQUÍ SOLO HTML
                tabla.innerHTML += `
                    <tr>
                        <td class="hover-img" data-img="Imagenes/${nombreImg}">
                            ${e.nombre}
                        </td>
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
                            <button onclick="editarEquipo(${e.id})">Editar</button>
                            <button onclick="eliminarEquipo(${e.id})" class="btn-eliminar">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function agregarEquipo() {

    const payload = {
        nombre: document.getElementById("nombreEquipo").value,
        serial: document.getElementById("serial").value,
        modelo: document.getElementById("modelo").value,
        propietario: document.getElementById("propietario").value,
        magnitud: document.getElementById("magnitud").value,
        rango_trabajo: document.getElementById("rangoTrabajo").value,
        rango_operacion: document.getElementById("rangoOperacion").value,
        id_categoria: document.getElementById("categoria")?.value || null,
        id_marca: document.getElementById("marca")?.value || null,
        id_proveedor: document.getElementById("proveedor")?.value || null
    };

    // 🔥 EDITAR
    if (idEditar) {

        fetch(API + "/equipos/" + idEditar, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.text())
        .then(() => {
            resetFormulario();
            cargarEquipos();

            alert("Equipo actualizado ✅");
        })
        .catch(() => alert("Error al actualizar"));

    } else {

        // 🔥 CREAR
        fetch(API + "/equipos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.text()) // 🔥 también cámbialo aquí (tu backend usa send)
        .then(() => {
            resetFormulario();
            cargarEquipos();

            alert("Equipo guardado ✅");
        })
        .catch(() => alert("Error al guardar"));
    }
}

function editarEquipo(id) {

    fetch(API + "/equipos/" + id)
        .then(res => {
            if (!res.ok) {
                throw new Error("No se encontró el equipo");
            }
            return res.json();
        })
        .then(e => {

            console.log("DATA:", e);

            if (!e) {
                alert("No se encontró el equipo");
                return;
            }

            idEditar = id;

            document.getElementById("nombreEquipo").value = e.nombre || "";
            document.getElementById("serial").value = e.serial || "";
            document.getElementById("modelo").value = e.modelo || "";
            document.getElementById("propietario").value = e.propietario || "";
            document.getElementById("magnitud").value = e.magnitud || "";
            document.getElementById("rangoTrabajo").value = e.rango_trabajo || "";
            document.getElementById("rangoOperacion").value = e.rango_operacion || "";

            document.getElementById("categoria").value = e.id_categoria || "";
            document.getElementById("marca").value = e.id_marca || "";
            document.getElementById("proveedor").value = e.id_proveedor || "";

            document.getElementById("btnGuardar").innerText = "Actualizar";
        })
        .catch(err => {
            console.error(err);
            alert("Error cargando datos del equipo");
        });
}


function eliminarEquipo(id) {

    if (!confirm("¿Seguro que deseas eliminar este equipo?")) return;

    fetch(API + "/equipos/" + id, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {

        if (!data.success) {
            alert(data.message); // 🔴 "Está en préstamo"
            return;
        }

        alert("Equipo eliminado 🗑️");
        cargarEquipos(); // 🔥 refresca tabla
    })
    .catch(err => {
        console.error(err);
        alert("Equipo no se puede eliminar, está en préstamo");
    });
}


/* ================= LIMPIAR FORM ================= */

function limpiarFormulario() {
    document.getElementById("nombreEquipo").value = "";
    document.getElementById("serial").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("propietario").value = "";
    document.getElementById("magnitud").value = "";
    document.getElementById("rangoTrabajo").value = "";
    document.getElementById("rangoOperacion").value = "";

    document.getElementById("categoria").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("proveedor").value = "";
}


/* ================= RESETEAR FORMULARIO ================= */
function resetFormulario() {
    document.getElementById("nombreEquipo").value = "";
    document.getElementById("serial").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("propietario").value = "";
    document.getElementById("magnitud").value = "";
    document.getElementById("rangoTrabajo").value = "";
    document.getElementById("rangoOperacion").value = "";

    if (document.getElementById("categoria"))
        document.getElementById("categoria").value = "";

    if (document.getElementById("marca"))
        document.getElementById("marca").value = "";

    if (document.getElementById("proveedor"))
        document.getElementById("proveedor").value = "";

    idEditar = null;

    document.getElementById("btnGuardar").innerText = "Guardar";
}

/* ================= COMBOS ================= */

function cargarCombos() {

    fetch(API + "/categorias")
        .then(res => res.json())
        .then(data => {
            const combo = document.getElementById("categoria");
            if (!combo) return;

            combo.innerHTML = "<option value=''>Seleccione Categoría</option>";

            data.forEach(c => {
                combo.innerHTML += `<option value="${c.id_categoria || c.id}">${c.nombre}</option>`;
            });
        }); 

    fetch(API + "/marcas")
        .then(res => res.json())
        .then(data => {
            const combo = document.getElementById("marca");
            if (!combo) return;

            combo.innerHTML = "<option value=''>Seleccione Marca</option>";

            data.forEach(m => {
                combo.innerHTML += `<option value="${m.id_marca || m.id}">${m.nombre}</option>`;
            });
        });

    fetch(API + "/proveedores")
        .then(res => res.json())
        .then(data => {
            const combo = document.getElementById("proveedor");
            if (!combo) return;

            combo.innerHTML = "<option value=''>Seleccione Proveedor</option>";

            data.forEach(p => {
                combo.innerHTML += `<option value="${p.id_proveedor || p.id}">${p.nombre}</option>`;
            });
        });
}

/* ================= CATEGORÍAS ================= */

function cargarCategorias() {
    fetch(API + "/categorias")
        .then(res => res.json())
        .then(data => {

            const tabla = document.getElementById("tablaCategorias");
            if (!tabla) return;

            tabla.innerHTML = "";

            data.forEach(cat => {
                tabla.innerHTML += `
                    <tr>
                        <td>${cat.id_categoria}</td>
                        <td>${cat.nombre}</td>
                        <td>${cat.descripcion || "-"}</td>
                        <td>${cat.estado || "-"}</td>
                        <td>
                            <button onclick="eliminarCategoria(${cat.id_categoria})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function eliminarCategoria(id) {
    fetch(`${API}/categorias/${id}`, { method: "DELETE" })
        .then(() => cargarCategorias());
}

/* ================= MARCAS ================= */

function cargarMarcasTabla() {
    fetch(API + "/marcas")
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById("tablaMarcas");
            if (!tabla) return;

            tabla.innerHTML = "";

            data.forEach(m => {
                tabla.innerHTML += `
                    <tr>
                        <td>${m.id_marca}</td>
                        <td>${m.nombre}</td>
                        <td>
                            <button onclick="eliminarMarca(${m.id_marca})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function eliminarMarca(id) {
    fetch(`${API}/marcas/${id}`, { method: "DELETE" })
        .then(() => cargarMarcasTabla());
}

/* ================= PROVEEDORES ================= */

function cargarProveedoresTabla() {
    fetch(API + "/proveedores")
        .then(res => res.json())
        .then(data => {
            const tabla = document.getElementById("tablaProveedores");
            if (!tabla) return;

            tabla.innerHTML = "";

            data.forEach(p => {
                tabla.innerHTML += `
                    <tr>
                        <td>${p.id_proveedor}</td>
                        <td>${p.nombre}</td>
                        <td>
                            <button onclick="eliminarProveedor(${p.id_proveedor})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function eliminarProveedor(id) {
    fetch(`${API}/proveedores/${id}`, { method: "DELETE" })
        .then(() => cargarProveedoresTabla());
}

/* ================= INICIO ================= */

window.onload = function () {
    tooltip = document.getElementById("tooltipImg");
    cargarEquipos();
    cargarCombos();

    /* ================= VALIDACIONES EN TIEMPO REAL ================= */

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordMsg = document.getElementById("passwordMsg");

if (passwordInput) {
    passwordInput.addEventListener("input", () => {

        const pass = passwordInput.value;
        const fuerza = evaluarPassword(pass);

        // 🔥 mínimo requerido
        if (pass.length < 5) {
            passwordMsg.textContent = "Mínimo 5 caracteres";
            passwordMsg.className = "password-msg debil";

            passwordInput.classList.add("error");
            passwordInput.classList.remove("success");
            return;
        }

        // 🔴 Débil
        if (fuerza <= 2) {
            passwordMsg.textContent = "Contraseña débil";
            passwordMsg.className = "password-msg debil";

            passwordInput.classList.add("error");
            passwordInput.classList.remove("success");
        }
        // 🟡 Media
        else if (fuerza === 3) {
            passwordMsg.textContent = "Contraseña media";
            passwordMsg.className = "password-msg media";

            passwordInput.classList.remove("error");
            passwordInput.classList.add("success");
        }
        // 🟢 Fuerte
        else {
            passwordMsg.textContent = "Contraseña fuerte";
            passwordMsg.className = "password-msg fuerte";

            passwordInput.classList.remove("error");
            passwordInput.classList.add("success");
        }

    });
}

if (emailInput) {
    emailInput.addEventListener("input", () => {
        if (validarEmail(emailInput.value)) {
            emailInput.classList.add("success");
            emailInput.classList.remove("error");
        } else {
            emailInput.classList.add("error");
            emailInput.classList.remove("success");
        }
    });
}

if (passwordInput) {
    passwordInput.addEventListener("input", () => {
        if (validarPassword(passwordInput.value)) {
            passwordInput.classList.add("success");
            passwordInput.classList.remove("error");
        } else {
            passwordInput.classList.add("error");
            passwordInput.classList.remove("success");
        }
    });
}

    cargarCategorias();
    cargarMarcasTabla();
    cargarProveedoresTabla();
    cargarUsuarios();
};

/* ================= MOSTRAR USUARIOS ================= */

function cargarUsuarios() {

    fetch("http://localhost:3000/api/usuarios")
        .then(res => res.json())
        .then(data => {

            const tabla = document.getElementById("tablaUsuarios");
            tabla.innerHTML = "";

            data.forEach(u => {
                tabla.innerHTML += `
                    <tr>
                        <td>${u.id}</td>
                        <td>${u.nombre}</td>
                        <td>${u.email}</td>
                    </tr>
                `;
            });

        })
        .catch(err => console.error("Error:", err));
}

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("tablaUsuarios")) {
        cargarUsuarios();
    }

});

/* ================= EVALUAR FUERZA PASSWORD ================= */

function evaluarPassword(password) {

    let fuerza = 0;

    if (password.length >= 5) fuerza++;
    if (/[0-9]/.test(password)) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/[^A-Za-z0-9]/.test(password)) fuerza++;

    return fuerza;
}

/* ================= REGISTRAR PRÉSTAMO ================= */

function registrarPrestamo() {

    const id_equipo = document.getElementById("equipoPrestamo").value;
    const id_usuario = document.getElementById("usuarioPrestamo").value;

    console.log("EQUIPO:", id_equipo);
    console.log("USUARIO:", id_usuario);

    // 🔥 VALIDACIÓN CLAVE
    if (!id_equipo || !id_usuario) {
        alert("Debe seleccionar equipo y usuario");
        return;
    }

    fetch(API + "/prestamos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_equipo: parseInt(id_equipo),
            id_usuario: parseInt(id_usuario)
        })
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        cargarPrestamos();
    })
    .catch(err => console.error(err));
}

/* ================= MOSTRAR PRÉSTAMOS ================= */

function cargarPrestamos() {

    fetch(API + "/prestamos")
        .then(res => res.json())
        .then(data => {
    
            console.log("DATOS PRESTAMOS:", data); // 🔥 AGREGAR ESTO   
            const tabla = document.getElementById("tablaPrestamos");
            if (!tabla) return;

            tabla.innerHTML = "";

            data.forEach(p => {
                tabla.innerHTML += `
                    <tr>
                        <td>${p.equipo}</td>
                        <td>${p.usuario}</td>
                        <td>${new Date(p.fecha_prestamo).toLocaleString()}</td>
                        <td>${p.estado}</td>
                        <td>
                            <button onclick="devolver(${p.id_prestamo})">Devolver</button>
                        </td>
                    </tr>
                `;
            });

        })
        .catch(err => console.error("Error:", err));
}



function devolver(id) {
    fetch(API + "/prestamos/" + id, {
        method: "PUT"
    })
    .then(() => cargarPrestamos());
}

function cargarCombosPrestamos() {

    fetch(API + "/equipos")
        .then(res => res.json())
        .then(data => {
            const combo = document.getElementById("equipoPrestamo");
            if (!combo) return;

            combo.innerHTML = "<option value=''>Seleccione Equipo</option>";

            data.forEach(e => {
                combo.innerHTML += `<option value="${e.id_equipo}">${e.nombre}</option>`;
            });
        });

    fetch(API + "/usuarios")
        .then(res => res.json())
        .then(data => {
            const combo = document.getElementById("usuarioPrestamo");
            if (!combo) return;

            combo.innerHTML = "<option value=''>Seleccione Usuario</option>";

            data.forEach(u => {
                combo.innerHTML += `<option value="${u.id}">${u.nombre}</option>`;
            });
        });
}


document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("tablaPrestamos")) {
        cargarPrestamos();
        cargarCombosPrestamos();
    }

});

function formatearNombre(nombre) {
    return nombre
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar tildes
        .replace(/\s+/g, "") // quitar espacios
        .replace(/[^a-zA-Z0-9]/g, ""); // limpiar símbolos
}

let tooltip;

document.addEventListener("mouseover", function(e) {
    if (e.target.classList.contains("hover-img")) {

        const imgPath = e.target.getAttribute("data-img");

        tooltip.innerHTML = `<img src="${imgPath}" width="150">`;
        tooltip.style.display = "block";
    }
});

document.addEventListener("mousemove", function(e) {
    tooltip.style.left = e.pageX + 15 + "px";
    tooltip.style.top = e.pageY + 15 + "px";
});

document.addEventListener("mouseout", function(e) {
    if (e.target.classList.contains("hover-img")) {
        tooltip.style.display = "none";
    }
});