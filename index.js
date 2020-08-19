var supervisor = require('supe')();

supervisor.start( 'brain', './citizens/brain/citizen.js' );