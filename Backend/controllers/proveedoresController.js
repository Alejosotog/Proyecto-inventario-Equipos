const db = require("../config/db"); // ajusta si tu conexión está en otro lado

exports.getProveedores = (req, res) => {
    db.query("SELECT * FROM proveedores", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

exports.createProveedor = (req, res) => {
    const { nombre, telefono, email } = req.body;

    const sql = "INSERT INTO proveedores (nombre, telefono, email) VALUES (?, ?, ?)";

    db.query(sql, [nombre, telefono, email], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: "Proveedor creado" });
    });
};