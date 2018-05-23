var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create new Schema for statistics
var statsSchema = new Schema({
    avgChart: String,
    pieChartData: [Number],
    pieChartLabel: [String],
    allDaysChartData: [Number],
    allDaysChartLabel: [String],
    monthsChartData: [Number],
    monthsChartLabel: [String],
    weekdayChartData: [Number],
    weekdayChartLabel: [String],
    hourChartData: [Number],
    hourChartLabel: [String],
    heartNumber:String,
    emojiChartData:[],
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Stats', statsSchema)