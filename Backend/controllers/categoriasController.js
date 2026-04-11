const db = require("../config/db"); // ajusta si tu conexión está en otro lado

// Obtener equipos con JOINs para mostrar nombres en lugar de IDs
exports.getCategorias = (req, res) => {
    db.query("SELECT * FROM categorias", (err, results) => {
        if (err) return res.status(500).json(err);
        const data = results.map(c => ({
            id: c.id_categoria,
            nombre: c.nombre,
            descripcion: c.descripcion,
            estado: c.estado
        }));

        res.json(data);
    });
};

// Crear nueva categoría
exports.createCategoria = (req, res) => {
    const { nombre, descripcion, estado } = req.body;

    const sql = "INSERT INTO categorias (nombre, descripcion, estado) VALUES (?, ?, ?)";

    db.query(sql, [nombre, descripcion, estado], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: "Categoría creada" });
    });
};