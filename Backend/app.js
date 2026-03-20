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

/* ================= REGISTRO ================= */
app.post("/api/registro", (req, res) => {

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
        return res.status(400).send("Datos incompletos");

    db.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, password],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al registrar");
            }
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

            if (err) {
                console.error(err);
                return res.status(500).send("Error servidor");
            }

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
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
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
    ], (err, result) => {

        if (err) {
            console.error("🔥 ERROR MYSQL:", err);
            return res.status(500).send(err.message);
        }

        res.send("✅ Equipo guardado correctamente");
    });
});

/* ================= SERVIDOR ================= */
app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
});