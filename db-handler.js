var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var f = require('util').format;
var util = require('util')
var express = require('express');

var Stats = require('./stats_model.js')

var db_name = "tele"

var schedule = require('node-schedule');


//Creating cleanup rule
var rule = new schedule.RecurrenceRule();
rule.hour = 23;
rule.minute = 00;

var cleanup = schedule.scheduleJob(rule, function () {
    deleteOlderEntries()
});


//take advantage of openshift env vars when available:
if (process.env.MONGODB_SERVICE_HOST) {
    console.log("Using environment variables")
    //db_name = process.env.MONGODB_DATABASE
    mongodb_connection_string = process.env.MONGODB_SERVICE_HOST + '/' + db_name;
    var user = encodeURIComponent(process.env.MONGODB_USER);
    var password = encodeURIComponent(process.env.MONGODB_PASSWORD);

    //console.log("It is: " + mongodb_connection_string)
}
else {
    console.log("Using local variables")
    var user = encodeURIComponent('test');
    var password = encodeURIComponent('test');
    var mongodb_connection_string = 'localhost:27017/tele'
}


var authMechanism = 'DEFAULT';

//Set up default mongoose connection
var mongoDB = f('mongodb://%s:%s@%s?authMechanism=%s',
    user, password, mongodb_connection_string, authMechanism);

mongoose.connect(mongoDB)
.catch(err => {
    console.log("There was an error when trying to connect to MongoDB")
})
    ;

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


function deleteOlderEntries() {
    var date = new Date();
    var daysToDeletion = 7;
    var deletionDate = new Date(date.setDate(date.getDate() - daysToDeletion));


    console.log("Deleting entries that are older than " + daysToDeletion + " days")

    Stats.deleteMany({ date: { $lt: deletionDate } }, function (err) {
        console.log(err)
    })


}

function saveStatsToDB(req, res, next) {

    console.log("Attempting to save to DB")

    try {

        // Create an instance of model Stats
        var statsInstance = new Stats({
            avgChart: req.parsedChart.avgChart, pieChartData: req.parsedChart.pieChartData, pieChartLabel: req.parsedChart.pieChartLabel,
            allDaysChartData: req.parsedChart.allDaysChartData, allDaysChartLabel: req.parsedChart.allDaysChartLabel,
            monthsChartData: req.parsedChart.monthsChartData, monthsChartLabel: req.parsedChart.monthsChartLabel,
            weekdayChartData: req.parsedChart.weekdayChartData, weekdayChartLabel: req.parsedChart.weekdayChartLabel,
            hourChartData: req.parsedChart.hourChartData, hourChartLabel: req.parsedChart.hourChartLabel,
            emojiChartData: req.parsedChart.emojiChartData,
            heartNumber: req.parsedChart.heartNumber
        });

        // Save the new model instance, passing a callback
        statsInstance.save(function (err) {
            if (err) {
                console.log(err);
                res.status(418).send("An error occured")
            }
            else {
                // saved!
                console.log("Succesfully saved to DB")
                req.savedInstaceId = statsInstance._id
                next();

            }

        });

    } catch (error) {

        throw ('DB-Error or Schema-Error')
        res.send("An error occured")

    }



}

function returnID(req, res) {

    res.send(req.savedInstaceId)


}

function returnStats(req, res) {

    try {

        console.log("Attempting to load stats with id: " + req.params.id)

        Stats.find({ _id: req.params.id }, function (error, results) {
            if (error) {
                console.log(error)
                res.send("ID_invalid")
            }
            else {

                if (results.length < 1 || results == null) {
                    res.send("ID_invalid")
                }
                else {
                    res.send(results[0])
                }

            }
        })

    } catch (error) {

        console.log(error)
        res.send("An error occured")

    }


}

module.exports = {
    saveStatsToDB: saveStatsToDB,
    returnID: returnID,
    returnStats: returnStats
}