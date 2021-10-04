var SERVER_NAME = 'Image-api'
var PORT = 5000;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the images
  , ImagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /images')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all images in the system
server.get('/images', function (req, res, next) {

  // Find every entity within the given collection
  ImagesSave.find({}, function (error, images) {

    // Return all of the images in the system
    res.send(images)
  })
})

// Create a new user
server.post('/images', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  var newUser = {
		name: req.params.name, 
		age: req.params.age
	}

  // Create the user using the persistence engine
  ImagesSave.create( newUser, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the user if no issues
    res.send(201, user)
  })
})


// Delete user with the given id
server.del('/images/:id', function (req, res, next) {

  // Delete the user with the persistence engine
  ImagesSave.delete(req.params.id, function (error, user) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


