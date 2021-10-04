var SERVER_NAME = 'Image-api'
var PORT = 5000;
var HOST = '127.0.0.1';

// Declaration of counter 
var getCount = 0; 
var postCount = 0;

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
  // Increment count
  getCount = getCount + 1;

  console.log("/images - GET REQUEST- REQUEST RECEIVED");
  // Find every entity within the given collection
  ImagesSave.find({}, function (error, images) {

    // Return all of the images in the system
    console.log("/images - GET REQUEST- SENDING RESPONSE GetCount: "+getCount);
    res.send(images)
  })
})

// Create a new image
server.post('/images', function (req, res, next) {

  console.log("/images - POST REQUEST- REQUEST RECEIVED");
  var newImage = {
		imageId: req.params.imageId, 
		name: req.params.name, 
    url: req.params.url, 
    size: req.params.size 
	}

  // Create the image using the persistence engine
  ImagesSave.create(newImage, function (error, images) {

    //Increment count 
    postCount = postCount + 1; 

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the image if no issues
    console.log("/images - POST REQUEST- SENDING RESPONSE PostCount: "+postCount);
    res.send(201, images)
  })
})

// Delete all images
server.del('/images', function (req, res, next) {

  // Delete the many images with the persistence engine
  ImagesSave.deleteMany(req.params, function (error, images) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})
