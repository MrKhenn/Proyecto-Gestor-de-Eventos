const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kenGr:asdf-13579@ken.zmmwe.mongodb.net/?retryWrites=true&w=majority&appName=Ken').then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;
