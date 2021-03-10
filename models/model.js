var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var calendarSchema = new Schema({
	name: String,
	// name: {type: String, required: true}, // this version requires this field to exist
	// name: {type: String, unique: true}, // this version requires this field to be unique in the db
  reading:[Number],
	socialmedia: [Number],
	studying: [Number],
	sleep: [Number],
	transportation: [Number],
	dateAdded : { type: Date, default: Date.now },
})

// export 'calendar' model so we can interact with it in other files
module.exports = mongoose.model('calendar',calendarSchema);
