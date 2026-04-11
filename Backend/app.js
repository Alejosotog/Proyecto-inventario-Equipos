const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "inventario_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ MySQL conectado");
});

/* ================= RUTAS EXTERNAS ================= */
const categoriasRoutes = require("./routes/categoriasRoutes");
const marcasRoutes = require("./routes/marcasRoutes");
const proveedoresRoutes = require("./routes/proveedoresRoutes");

app.use("/api/categorias", categoriasRoutes);
app.use("/api/marcas", marcasRoutes);
app.use("/api/proveedores", proveedoresRoutes);

/* ================= REGISTRO ================= */
app.post("/api/registro", (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
        return res.status(400).send("Datos incompletos");

    db.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, password],
        (err) => {
            if (err) return res.status(500).send("Error al registrar");
            res.send("✅ Usuario registrado");
        }
    );
});

/* ================= LOGIN ================= */
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email=? AND password=?",
        [email, password],
        (err, results) => {
            if (err) return res.status(500).send("Error servidor");

            if (results.length > 0)
                res.json({ success: true });
            else
                res.json({ success: false });
        }
    );
});

/* ================= EQUIPOS ================= */
app.get("/api/equipos", (req, res) => {

    const query = `
        SELECT 
            e.*,
            c.nombre AS categoria,
            m.nombre AS marca,
            p.nombre AS proveedor
        FROM equipos e
        LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
        LEFT JOIN marcas m ON e.id_marca = m.id_marca
        LEFT JOIN proveedores p ON e.id_proveedor = p.id_proveedor
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/api/equipos", (req, res) => {

    const e = req.body;

    const query = `
        INSERT INTO equipos
        (nombre, serial, modelo, propietario, magnitud,
        rango_trabajo, rango_operacion,
        id_categoria, id_marca, id_proveedor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        e.nombre,
        e.serial,
        e.modelo,
        e.propietario,
        e.magnitud,
        e.rango_trabajo,
        e.rango_operacion,
        e.id_categoria || null,
        e.id_marca || null,
        e.id_proveedor || null
    ], (err) => {

        if (err) {
            console.error("🔥 ERROR MYSQL:", err);
            return res.status(500).send(err.message);
        }

        res.send("✅ Equipo guardado correctamente");
    });
});

/* ================= USUARIOS ================= */
app.get("/api/usuarios", (req, res) => {

    db.query("SELECT id, nombre, email FROM usuarios", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

/* ================= CATEGORIAS ================= */
app.get("/api/categorias", (req, res) => {
    db.query("SELECT * FROM categorias", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/api/categorias", (req, res) => {
    const { nombre } = req.body;

    db.query(
        "INSERT INTO categorias (nombre) VALUES (?)",
        [nombre],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Categoría creada");
        }
    );
});

/* ================= MARCAS ================= */

app.get("/api/marcas", (req, res) => {
    db.query("SELECT * FROM marcas", (err, results) => {
        res.json(results);
    });
});

app.post("/api/marcas", (req, res) => {
    const { nombre } = req.body;

    db.query(
        "INSERT INTO marcas (nombre) VALUES (?)",
        [nombre],
        () => res.send("Marca creada")
    );
});


/* ================= REGISTRAR PRÉSTAMO ================= */

app.post("/api/prestamos", (req, res) => {

    const { id_equipo, id_usuario } = req.body;

    const query = `
        INSERT INTO prestamos (id_equipo, id_usuario)
        VALUES (?, ?)
    `;

    db.query(query, [id_equipo, id_usuario], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Préstamo registrado");
    });
});

/* ================= MOSTRAR PRÉSTAMOS ================= */

app.get("/api/prestamos", (req, res) => {

    const query = `
        SELECT 
            p.id_prestamo,
            e.nombre AS equipo,
            u.nombre AS usuario,
            p.fecha_prestamo,
            p.estado
        FROM prestamos p
        LEFT JOIN equipos e ON p.id_equipo = e.id_equipo
        LEFT JOIN usuarios u ON p.id_usuario = u.id
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});


/* ================= DEVOLVER EQUIPO ================= */


app.put("/api/prestamos/:id", (req, res) => {

    const query = `
        UPDATE prestamos 
        SET estado='Devuelto', fecha_devolucion=NOW()
        WHERE id_prestamo=?
    `;

    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Equipo devuelto");
    });
});

/* ================= PROVEEDORES ================= */

app.get("/api/proveedores", (req, res) => {
    db.query("SELECT * FROM proveedores", (err, results) => {
        res.json(results);
    });
});

app.post("/api/proveedores", (req, res) => {
    const { nombre, telefono, email } = req.body;

    db.query(
        "INSERT INTO proveedores (nombre, telefono, email) VALUES (?, ?, ?)",
        [nombre, telefono, email],
        () => res.send("Proveedor creado")
    );
});

/* ================= OBTENER EQUIPO POR ID ================= */

app.get("/api/equipos/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM equipos WHERE id = ?",
        [id],
        (err, results) => {

            if (err) return res.status(500).send(err);

            if (results.length === 0)
                return res.status(404).send("No encontrado");

            res.json(results[0]);
        }
    );
});

/* ================= ACTUALIZAR EQUIPO ================= */

app.put("/api/equipos/:id", (req, res) => {

    const id = req.params.id;
    const e = req.body;

    console.log("DATA RECIBIDA:", e); // 🔥 AGREGA ESTO

    const query = `
        UPDATE equipos SET
        nombre = ?,
        serial = ?,
        modelo = ?,
        propietario = ?,
        magnitud = ?,
        rango_trabajo = ?,
        rango_operacion = ?,
        id_categoria = ?,
        id_marca = ?,
        id_proveedor = ?
        WHERE id = ?
    `;

    db.query(query, [
        e.nombre,
        e.serial,
        e.modelo,
        e.propietario,
        e.magnitud,
        e.rango_trabajo,
        e.rango_operacion,
        e.id_categoria || null,
        e.id_marca || null,
        e.id_proveedor || null,
        id
    ], (err) => {

        if (err) {
            console.error("🔥 ERROR UPDATE:", err); // 🔥 CLAVE
            return res.status(500).send(err.message);
        }

        res.send("Equipo actualizado");
    });
});

/* ================= ELIMINAR EQUIPO ================= */

app.delete("/api/equipos/:id", (req, res) => {

    const id = req.params.id;

    // 🔥 1. VALIDAR SI ESTÁ EN PRÉSTAMOS
    db.query(
        "SELECT * FROM prestamos WHERE id_equipo = ? AND estado = 'Prestado'",
        [id],
        (err, results) => {

            if (err) return res.status(500).send(err);

            // 🔴 SI ESTÁ PRESTADO → NO BORRAR
            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "El equipo está actualmente en préstamo"
                });
            }

            // 🔥 2. SI NO → ELIMINAR
            db.query(
                "DELETE FROM equipos WHERE id = ?",
                [id],
                (err2) => {

                    if (err2) return res.status(500).send(err2);

                    res.json({
                        success: true,
                        message: "Equipo eliminado correctamente"
                    });
                }
            );
        }
    );
});

/* ================= SERVIDOR ================= */
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});