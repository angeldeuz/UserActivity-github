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

            const eventosPorTipo = contarEventosPorTipo(data);
            console.log(`Eventos del usuario ${options.nombre}:`);
            for (const [tipo, cantidad] of Object.entries(eventosPorTipo)) {
                const descripcion = obtenerDescripcionEvento(tipo, cantidad)
                console.log(descripcion);
            }
        } catch (error) {
            console.error('Error al obtener datos de GitHub:', error.message);
        }
    } else {
        console.log('No se encontró el nombre. Por favor, usa la opción -n o --nombre para especificar tu nombre.')
    }
}

async function obtenerDatosGithub(usuario) {
    const response = await fetch(`https://api.github.com/users/${usuario}/events`);
    if (!response.ok) {
        throw new Error('Error al obtener datos de GitHub');
    }
    return response.json();
}

function contarEventosPorTipo(eventos) {
    return eventos.reduce((contador, evento) => {
        const tipo = evento.type;
        contador[tipo] = (contador[tipo] || 0) + 1;
        return contador;
    }, {});
}

function obtenerDescripcionEvento(tipo, cantidad) {
    const descripciones = {
        PushEvent: `realizó ${cantidad} push(es) a una rama en GitHub.`,
        PullRequestEvent: `creó o actualizó ${cantidad} pull request(s).`,
        IssuesEvent: `abrió o actualizó ${cantidad} issue(s).`,
        ForkEvent: `hizo ${cantidad} fork(s) de repositorios.`,
        WatchEvent: `marcó ${cantidad} repositorio(s) como favorito(s).`
    };

    // Si el tipo de evento tiene una descripción personalizada, úsala; de lo contrario, usa un mensaje genérico.
    return descripciones[tipo] || `registró ${cantidad} evento(s) del tipo ${tipo}.`;
}

main();