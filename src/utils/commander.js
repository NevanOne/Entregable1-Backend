const {Command} = require('commander')

const commander = new Command()

commander
    .option('--mode <mode>', 'Modo de ejecución')
    .parse()

module.exports = {
    commander
}
