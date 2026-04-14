const db = require("../config/db");

// CREAR PRÉSTAMO
exports.crearPrestamo = (req, res) => {

    const { id_equipo, nombre, area, fecha_prestamo, actividad } = req.body;

    console.log("📥 DATA RECIBIDA:", req.body); // DEBUG

    const sql = `
        INSERT INTO prestamos 
        (id_equipo, nombre, area, fecha_prestamo, actividad, estado)
        VALUES (?, ?, ?, ?, ?, 'Prestado')
    `;

    db.query(sql, [id_equipo, nombre, area, fecha_prestamo, actividad], (err, result) => {

        if (err) {
            console.error("🔥 ERROR MYSQL:", err);
            return res.status(500).json(err);
        }

        res.send("Préstamo creado correctamente ✅");
    });
};

// LISTAR PRÉSTAMOS
exports.obtenerPrestamos = (req, res) => {

    const sql = `
        SELECT 
            p.id_prestamo,
            e.nombre AS equipo,
            e.serial,
            p.nombre,
            p.area,
            p.fecha_prestamo,
            p.actividad,
            p.estado
        FROM prestamos p
        LEFT JOIN equipos e ON p.id_equipo = e.id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
};

// DEVOLVER EQUIPO
exports.devolverEquipo = (req, res) => {

    const id = req.params.id;

    const sql = `
        UPDATE prestamos
        SET estado = 'Devuelto',
            fecha_devolucion = NOW()
        WHERE id_prestamo = ?
    `;

    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.send("Equipo devuelto");
    });
};