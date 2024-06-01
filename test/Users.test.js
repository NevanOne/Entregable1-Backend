const mongoose = require('mongoose');
const User = require('../src/dao/usersDao.mongo'); // Asegúrate de que el nombre de la clase sea correcto
const assert = require('assert');

// Manejar la conexión a MongoDB antes y después de las pruebas
before(function(done) {
    mongoose.connect('mongodb+srv://GabrielAlfonzo:lqNrawLlPkiVUh0o@coderhouse-cluster.h3mubya.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        done();
    });
});

after(function(done) {
    mongoose.connection.close(done);
});

describe('Testing Users Dao', () => {
    before(function() {
        this.usersDao = new User(); // Usar el nombre de la clase correctamente
    });

    beforeEach(function() {
        this.timeout(5000);
    });

    it('El Dao tiene que devolver un array', async function() {
        console.log(this.usersDao);
        // Entorno aislado, no afecta las demás pruebas
        const result = await this.usersDao.get();
        assert.strictEqual(Array.isArray(result), true);
    });
});
