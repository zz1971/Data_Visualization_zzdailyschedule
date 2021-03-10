var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geocoder = require('geocoder'); // geocoder library

// our db model
var calendar = require("../models/model.js");

// simple route to render am HTML form that can POST data to our server
// NOTE that this is not a standard API route, and is really just for testing
router.get('/add-day', function(req,res){
  res.render('day-form.html')
})

//router.get('/add-day-location', function(req,res){
  res.render('pet-form-with-location.html')
})

// simple route to render an HTML page that pulls data from our server and displays it on a page
// NOTE that this is not a standard API route, and is really for testing
router.get('/show-days', function(req,res){
  res.render('show-days.html')
})

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  var jsonData = {
  	'day': 'node-express-api-boilerplate',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new calendar, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the calendar
//  * @return {Object} JSON
//  */

router.post('/api/add', function(req, res){

    console.log(req.body);

    var day = req.body.day;
    var reading = req.body.reading;
    var socialmedia = req.body.socialmedia.split(","); // split string into array
    var studying = req.body.studying;
    var sleep = req.body.sleep;
    var transportation = req.body.transportation;


    var calendarObj = {

      day;day,
      reading: reading,
      socialmedia: socialmedia
      studying: studying,
      sleep: sleep,
      transportation: transportation
    };

    // create a new calendar model instance, passing in the object
    var calendar = new calendar(calendarObj);

    // now, save that calendar instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
    calendar.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving calendar'};
        return res.json(error);
      }

      console.log('saved a new calendar!');
      console.log(data);

      // now return the json data of the new calendar
      var jsonData = {
        status: 'OK',
        calendar: data
      }

      //return res.json(jsonData);
      return res.redirect('/show-pets')

    })
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the calendar to get
//  * @param  {String} req.params.id - The calendarId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  calendar.findById(requestedId, function(err,data){

    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that calendar'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the calendar
    var jsonData = {
      status: 'OK',
      calendar: data
    }

    return res.json(jsonData);

  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all calendar details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  calendar.find(function(err, data){
    // if err or no calendars found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find calendars'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      calendars: data
    }

    res.json(jsonData);

  })

})

// /**
//  * GET '/api/search'
//  * Receives a GET request to search an calendar
//  * @return {Object} JSON
//  */
router.get('/api/search', function(req,res){

  // first use req.query to pull out the search query
  var searchTerm = req.query.day;
  console.log("we are searching for " + searchTerm);

  // let's find that calendar
  calendar.find({day: searchTerm}, function(err,data){
    // if err, respond with error
    if(err){
      var error = {status:'ERROR', message: 'Something went wrong'};
      return res.json(error);
    }

    //if no calendars, respond with no calendars message
    if(data==null || data.length==0){
      var message = {status:'NO RESULTS', message: 'We couldn\'t find any results'};
      return res.json(message);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      calendars: data
    }

    res.json(jsonData);
  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the calendar to update, updates db, responds back
//  * @param  {String} req.params.id - The calendarId to update
//  * @param  {Object} req. An object containing the different attributes of the calendar
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.params.id;

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    //var day, reading, studying, sleep, transportation;

    var day, reading, socialmedia, studying, sleep, transportation;

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.day) {
      day = req.body.day;
      // add to object that holds updated data
      dataToUpdate['day'] = day;
    }
    if(req.body.reading) {
      reading = req.body.reading;
      // add to object that holds updated data
      dataToUpdate['reading'] = reading;
    }
    if(req.body.studying) {
      studying = req.body.studying;
      // add to object that holds updated data
      dataToUpdate['description'] = {};
      dataToUpdate['description']['studying'] = studying;
    }
    if(req.body.sleep) {
      sleep = req.body.sleep;
      // add to object that holds updated data
      if(!dataToUpdate['description']) dataToUpdate['description'] = {};
      dataToUpdate['description']['sleep'] = sleep;
    }
    if(req.body.transportation) {
      transportation = req.body.transportation;
      // add to object that holds updated data
      dataToUpdate['transportation'] = transportation;
    }

    var socialmedia = []; // blank array to hold socialmedia
    if(req.body.socialmedia){
      socialmedia = req.body.socialmedia.split(","); // split string into array
      // add to object that holds updated data
      dataToUpdate['socialmedia'] = socialmedia;
    }


    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that calendar
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    calendar.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', messreading: 'Error updating calendar'};
        return res.json(error);
      }

      console.log('updated the calendar!');
      console.log(data);

      // now return the json data of the new calendar
      var jsonData = {
        status: 'OK',
        calendar: data
      }

      return res.json(jsonData);

    })

})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the calendar to delete
 * @param  {String} req.params.id - The calendarId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.params.id;

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  calendar.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that calendar to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

// examples of a GET route using an HTML template

router.get('/pets', function(req,res){

  calendar.find(function(err, data){
    // if err or no calendars found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find calendars'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var templateData = {
      status: 'OK',
      calendars: data
    }

    res.render('pet-template.html',templateData);

  })

})

module.exports = router;


// examples of a GET route using an HTML template
router.get('/edit/:id', function(req,res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  calendar.findById(requestedId, function(err,data){
    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that calendar'};
       return res.json(error);
    }

    // otherwise preprate data of the calendar
    var templateData = data;

    return res.render('edit-form.html', templateData);

  })
})

router.post('/api/create/location', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var day = req.body.day;
    var reading = req.body.reading;
    var socialmedia = req.body.socialmedia.split(","); // split string into array
    var studying = req.body.studying;
    var sleep = req.body.sleep;
    var transportation = req.body.transportation;
    //var location = req.body.location;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var calendarObj = {
      day: day,
      reading: reading,
      socialmedia: socialmedia,
      description: {
        studying: studying,
        sleep: sleep
      },
      transportation: transportation
    };

  // if there is no location, return an error
    if(!location) return res.json({status:'ERROR', messreading: 'You are missing a required field or have submitted a malformed request.'})

    console.log('location is --> ' + location);
    //now, let's geocode the location
    geocoder.geocode(location, function (err,data) {

      // if we get an error, or don't have any results, respond back with error
      if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
        var error = {status:'ERROR', message: 'Error finding location'};
        return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
      }

      console.log(data);
      // else, let's pull put the lat lon from the results
      var lon = data.results[0].geometry.location.lng;
      var lat = data.results[0].geometry.location.lat;

      // now, let's add this to our calendar object from above
      calendarObj.location = {
        geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
        day: data.results[0].formatted_address // the location day
      }

      // now, let's save it to the database
      // create a new calendar model instance, passing in the object we've created
      var calendar = new calendar(calendarObj);

      // now, save that calendar instance to the database
      // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
      calendar.save(function(err,data){
        // if err saving, respond back with error
        if (err){
          var error = {status:'ERROR', message: 'Error saving calendar'};
          return res.json(error);
        }

        console.log('saved a new calendar!');
        console.log(data);

        // now return the json data of the new calendar
        var jsonData = {
          status: 'OK',
          calendar: data
        }

        return res.json(jsonData);

      })

    });
});

module.exports = router;
