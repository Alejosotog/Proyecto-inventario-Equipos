const db = require("../config/db");

// OBTENER MARCAS
exports.getMarcas = (req, res) => {
    db.query("SELECT * FROM marcas", (err, results) => {
        if (err) return res.status(500).json(err);

        // 🔥 adaptamos para el frontend
        const data = results.map(m => ({
            id: m.id_marca,
            nombre: m.nombre
        }));

        res.json(data);
    });
};

// CREAR MARCA
exports.createMarca = (req, res) => {
    const { nombre } = req.body;

    const sql = "INSERT INTO marcas (nombre) VALUES (?)";

    db.query(sql, [nombre], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: "Marca creada" });
    });
};