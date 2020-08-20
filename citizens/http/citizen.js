var http = require('http'),
    citizen = require('supe'),
    create_task = require('cjs-task');

var app = create_task();

app.step( 'create server', function(){
  var server = http.createServer();

  app.set( 'server', server );
  app.next();
});

app.step( 'handle incoming requests', function(){
  var server = app.get( 'server' );

  server.on( 'request', function( req, res ){
    var dissected_req_url = req.url.split( '/' );
    if( dissected_req_url.length < 3 ) return res.end( 'hello world' );

    dissected_req_url.shift();

    if( ['#', '?'].indexOf( dissected_req_url[0][0] ) === 0 ) return res.end( 'hello world' );

    res.statusCode = 444;
    res.statusMessage = 'something went wrong; please try again later';

    res.end();
  });

  app.next();
});

app.step( 'start server', function(){
  app.get( 'server' ).listen( 5050 );
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