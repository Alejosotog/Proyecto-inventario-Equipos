CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) DEFAULT 'Activo'
);

INSERT INTO categorias (nombre, descripcion)
VALUES 
('Equipos de cómputo', 'PC y laptops'),
('Red', 'Routers y switches'),
('Medición', 'Equipos metrológicos');