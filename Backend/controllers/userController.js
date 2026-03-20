const db = require("../config/db");

exports.register = (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
        return res.status(400).send("Datos incompletos");

    db.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, password],
        err => {
            if (err) return res.status(500).send("Error");
            res.send("✅ Usuario registrado");
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email=? AND password=?",
        [email, password],
        (err, results) => {
            if (err) return res.status(500).send("Error");

            res.json({ success: results.length > 0 });
        }
    );
};