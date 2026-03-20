const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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

/* ================= USUARIOS ================= */

app.post("/registro", (req, res) => {

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

app.post("/login", (req, res) => {

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

app.get("/equipos", (req, res) => {
    db.query("SELECT * FROM equipos", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post("/equipos", (req, res) => {

    const e = req.body;

    db.query(
        `INSERT INTO equipos
        (nombre, serial, modelo, propietario, magnitud,
        rango_trabajo, rango_operacion,
        calibrado, fecha_calibracion,
        id_categoria, id_marca, id_proveedor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            e.nombre, e.serial, e.modelo, e.propietario,
            e.magnitud, e.rango_trabajo, e.rango_operacion,
            e.calibrado, e.fecha_calibracion,
            e.id_categoria, e.id_marca, e.id_proveedor
        ],
        err => {
            if (err) return res.status(500).send(err);
            res.send("✅ Equipo agregado");
        }
    );
});

app.put("/equipos/:id", (req, res) => {

    const id = req.params.id;
    const e = req.body;

    db.query(
        `UPDATE equipos SET
        nombre=?, serial=?, modelo=?, propietario=?,
        magnitud=?, rango_trabajo=?, rango_operacion=?,
        calibrado=?, fecha_calibracion=?,
        id_categoria=?, id_marca=?, id_proveedor=?
        WHERE id=?`,
        [
            e.nombre, e.serial, e.modelo, e.propietario,
            e.magnitud, e.rango_trabajo, e.rango_operacion,
            e.calibrado, e.fecha_calibracion,
            e.id_categoria, e.id_marca, e.id_proveedor,
            id
        ],
        err => {
            if (err) return res.status(500).send(err);
            res.send("✅ Equipo actualizado");
        }
    );
});

app.patch("/equipos/:id", (req, res) => {

    const id = req.params.id;
    const { calibrado, fecha_calibracion } = req.body;

    db.query(
        "UPDATE equipos SET calibrado=?, fecha_calibracion=? WHERE id=?",
        [calibrado, fecha_calibracion, id],
        err => {
            if (err) return res.status(500).send(err);
            res.send("✅ Calibración actualizada");
        }
    );
});

/* ================= COMBOS ================= */

app.get("/categorias", (req, res) => {
    db.query("SELECT * FROM categorias", (err, r) => {
        if (err) return res.status(500).send(err);
        res.json(r);
    });
});

app.get("/marcas", (req, res) => {
    db.query("SELECT * FROM marcas", (err, r) => {
        if (err) return res.status(500).send(err);
        res.json(r);
    });
});

app.get("/proveedores", (req, res) => {
    db.query("SELECT * FROM proveedores", (err, r) => {
        if (err) return res.status(500).send(err);
        res.json(r);
    });
});

app.listen(3000, () =>
    console.log("🚀 Servidor activo en http://localhost:3000")
);