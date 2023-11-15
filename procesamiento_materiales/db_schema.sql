CREATE TABLE IF NOT EXISTS Materiales (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Descripcion TEXT,
    CantidadInventario INT,
    Precio DECIMAL
);

CREATE TABLE IF NOT EXISTS Pedidos (
    ID SERIAL PRIMARY KEY,
    MaterialID INT,
    CantidadSolicitada INT,
    FechaPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    EstadoPedido VARCHAR(50),
    FOREIGN KEY (MaterialID) REFERENCES Materiales(ID)
);

CREATE TABLE IF NOT EXISTS Inventarios (
    ID SERIAL PRIMARY KEY,
    MaterialID INT,
    CantidadDisponible INT,
    FOREIGN KEY (MaterialID) REFERENCES Materiales(ID)
);
