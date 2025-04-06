#!/usr/bin/env node

const { program } = require('commander');

program
    .version('1.0.0')
    .description('Esta es una CLI sencilla creada con Node.js')
    .option('-n, --nombre <nombre>', 'Tu nombre')
    .parse(process.argv);

const options = program.opts();

async function main() {
    if (options.nombre) {
        console.log(`¡Hola, ${options.nombre}!`);
        try {
            let data = await obtenerDatosGithub(options.nombre);
            console.log(data);
        } catch (error) {
            console.error('Error al obtener datos de GitHub:', error.message);
        }
    } else {
        console.log('¡Hola, mundo!');
    }
}

async function obtenerDatosGithub(usuario) {
    const response = await fetch(`https://api.github.com/users/${usuario}/events`);
    if (!response.ok) {
        throw new Error('Error al obtener datos de GitHub');
    }
    return response.json();
}

main();