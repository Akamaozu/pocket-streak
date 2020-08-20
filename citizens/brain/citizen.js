var citizen = require('supe'),
    path = require('path'),
    create_task = require('cjs-task'),
    supervision_api = require('supe-addon-citizen-supervision-api'),
    app = create_task();

citizen.use( supervision_api );

app.set( 'citizen', citizen );
app.set( 'path-to-root', path.join( __dirname, '../..' ) );

app.step( 'handle http server lifecycle hooks', function(){
  var citizen = app.get( 'citizen' );

  citizen.noticeboard.once( 'http-shutdown', 'exit', exit_app( 'http has shut down' ) );
  citizen.noticeboard.once( 'http-excessive-crash', 'exit', exit_app( 'http crashed excessively' ));

  app.next();

  function exit_app( reason ){
    return function(){
      if( reason ) console.log( 'action=log-exit-reason reason="'+ reason + '"' );
      app.end();
    }
  }
});

app.step( 'start http server', function(){
  var citizen = app.get( 'citizen' ),
      path_to_http_citizen = app.get( 'path-to-root' ) + '/citizens/http/citizen.js';

  citizen.supervisor.start( 'http', path_to_http_citizen, function( error ){
    if( error ) return app.end( error );

    console.log( 'action=start-server success=true' );
  });
});

app.callback( function( error ){
  var log_entry = [
    'action=stop-app',
    'error='+ ( error ? 'true' : 'false' )
  ];

  if( error ){
    log_entry.push( 'reason="'+ error.message + '"' )
    log_entry.push( 'stack=\n---\n'+ error.stack + '\n---' );
  }

  console.log( log_entry.join(' ') );
  process.exit( error ? 1 : 0 );
});

app.start();