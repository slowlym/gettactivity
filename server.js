const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const FILE_PATH = 'activities.txt';

app.use(cors());
app.use(bodyParser.json());

// Leer actividades desde el archivo
app.get('/activities', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }
        const activities = data ? JSON.parse(data) : [];
        res.json(activities);
    });
});

// Agregar actividad al archivo
app.post('/activities', (req, res) => {
    const newActivity = req.body;
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }
        const activities = data ? JSON.parse(data) : [];
        activities.push(newActivity);
        fs.writeFile(FILE_PATH, JSON.stringify(activities), (err) => {
            if (err) {
                return res.status(500).send('Error al escribir en el archivo');
            }
            res.status(201).send('Actividad agregada');
        });
    });
});

// Eliminar actividad del archivo
app.delete('/activities/:title', (req, res) => {
    const title = req.params.title;
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo');
        }
        const activities = data ? JSON.parse(data) : [];
        const updatedActivities = activities.filter(activity => activity.title !== title);
        fs.writeFile(FILE_PATH, JSON.stringify(updatedActivities), (err) => {
            if (err) {
                return res.status(500).send('Error al escribir en el archivo');
            }
            res.send('Actividad eliminada');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});