exports.createEquipo = (data, callback) => {
    db.query(
        `INSERT INTO equipos
        (nombre, serial, modelo, propietario, magnitud,
        rango_trabajo, rango_operacion,
        id_categoria, id_marca, id_proveedor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.nombre,
            data.serial,
            data.modelo,
            data.propietario,
            data.magnitud,
            data.rango_trabajo,
            data.rango_operacion,
            data.id_categoria,
            data.id_marca,
            data.id_proveedor
        ],
        callback
    );
};