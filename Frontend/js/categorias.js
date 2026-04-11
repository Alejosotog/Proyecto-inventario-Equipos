document.addEventListener("DOMContentLoaded", cargarCategorias);

function cargarCategorias() {
    fetch("http://localhost:3000/api/categorias")
        .then(res => res.json())
        .then(data => {

            console.log("CATEGORIAS:", data); // 🔥 IMPORTANTE

            const tabla = document.getElementById("tablaCategorias");
            tabla.innerHTML = "";

            data.forEach(cat => {
                tabla.innerHTML += `
                    <tr>
                        <td>${cat.id_categoria}</td>
                        <td>${cat.nombre}</td>
                        <td>${cat.descripcion || "-"}</td>
                        <td>${cat.estado || "-"}</td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error(err));
}

// GUARDAR
function guardarCategoria() {
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const estado = document.getElementById("estado").value;

    fetch("http://localhost:3000/api/categorias", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, descripcion, estado })
    })
    .then(res => res.json())
    .then(() => {
        alert("Categoría guardada ✅");
        cargarCategorias();
    })
    .catch(err => console.error(err));
}