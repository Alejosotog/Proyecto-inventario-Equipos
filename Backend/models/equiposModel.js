const db = require("../config/db");

exports.getEquipos = (callback) => {
    db.query("SELECT * FROM equipos", callback);
};

exports.createEquipo = (data, callback) => {
    db.query(
        `INSERT INTO equipos
        (nombre, serial, modelo, propietario, magnitud,
        rango_trabajo, rango_operacion,
        calibrado, fecha_calibracion,
        id_categoria, id_marca, id_proveedor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.nombre, data.serial, data.modelo, data.propietario,
            data.magnitud, data.rango_trabajo, data.rango_operacion,
            data.calibrado, data.fecha_calibracion,
            data.id_categoria, data.id_marca, data.id_proveedor
        ],
        callback
    );
};