//Register dependencies
var helmet = require('helmet'),
    express = require('express'),
    Promise = require('bluebird'),
    parentApp = express(),
    ghost = require('./ghost/core'),
    errors = require('./ghost/core/server/errors');



//Register Middleware
parentApp.use(helmet());
parentApp.use(helmet.hidePoweredBy({setTo: "Perl 2.0.0"}));

//Register route
parentApp.use(express.static(__dirname + '/public'));

//Start Ghost (Blogging application) at /blog

require('./ghost/core/server/utils/startup-check').check(); //Check ghost

ghost().then(function (ghostServer) { //Start ghost
    // Mount our ghost instance on our desired subdirectory path if it exists.
    parentApp.use('/blog', ghostServer.rootApp);

}).catch(function (err) {
    errors.logErrorAndExit(err, err.context, err.help);
}); //Start ghost

//Listen
parentApp.listen(process.env.PORT || 3000);