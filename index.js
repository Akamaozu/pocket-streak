var supervisor = require('supe')(),
    citizen_supervision_api = require('supe-addon-citizen-supervision-api');

supervisor.use( citizen_supervision_api );

supervisor.hook.add( 'brain-shutdown', 'exit', exit_app( 'brain shut down' ) );
supervisor.hook.add( 'brain-excessive-crash', 'exit', exit_app( 'brain crashed excessively' ) );

supervisor.start( 'brain', './citizens/brain/citizen.js' );

function exit_app( reason ){
  return function(){
    if( reason && typeof reason === 'string' ) console.log( 'action=log-exit-reason reason="'+ reason + '"' );
    process.exit();
  }
}