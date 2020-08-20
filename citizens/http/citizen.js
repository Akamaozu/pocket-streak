var http = require('http'),
    citizen = require('supe'),
    create_task = require('cjs-task');

var app = create_task();

app.step( 'say hello', function(){
  console.log( 'hello world' );
  app.next();
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