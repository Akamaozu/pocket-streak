var supervisor = require('supe')(),
    citizen_supervision_api = require('supe-addon-citizen-supervision-api');

supervisor.use( citizen_supervision_api );
supervisor.start( 'brain', './citizens/brain/citizen.js' );