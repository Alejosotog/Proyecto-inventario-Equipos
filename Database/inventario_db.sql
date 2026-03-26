USE inventario_db;

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE marcas (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin','tecnico','usuario') DEFAULT 'usuario',
    estado BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150),
    telefono VARCHAR(50),
    email VARCHAR(100)
);

CREATE TABLE movimientos (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_equipo INT,
    tipo_movimiento VARCHAR(50),
    fecha DATETIME,
    responsable VARCHAR(100),
    FOREIGN KEY (id_equipo) REFERENCES equipos(id)
);

ALTER TABLE equipos
ADD id_categoria INT,
ADD id_marca INT,
ADD id_proveedor INT;

ALTER TABLE equipos
ADD FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
ADD FOREIGN KEY (id_marca) REFERENCES marcas(id_marca),
ADD FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor);

