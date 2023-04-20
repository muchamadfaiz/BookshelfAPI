const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: () => { return 'Hello Faiz!'; }
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();