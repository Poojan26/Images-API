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

  console.log("/images - GET REQUEST- REQUEST RECEIVED")
  // Find every entity within the given collection
  ImagesSave.find({}, function (error, images) {

    // Return all of the images in the system
    res.send(images)
  })
})

// Create a new image
server.post('/images', function (req, res, next) {

  console.log("/images - POST REQUEST- REQUEST RECEIVED")
  var newImage = {
		imageId: req.params.imageId, 
		name: req.params.name, 
    url: req.params.url, 
    size: req.params.size 
	}

  // Create the image using the persistence engine
  ImagesSave.create(newImage, function (error, image) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the image if no issues
    res.send(201, image)
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
