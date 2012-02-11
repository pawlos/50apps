//http://www.elated.com/articles/working-with-dates/

var month_names = new Array ( );
month_names[month_names.length] = "January";
month_names[month_names.length] = "February";
month_names[month_names.length] = "March";
month_names[month_names.length] = "April";
month_names[month_names.length] = "May";
month_names[month_names.length] = "June";
month_names[month_names.length] = "July";
month_names[month_names.length] = "August";
month_names[month_names.length] = "September";
month_names[month_names.length] = "October";
month_names[month_names.length] = "November";
month_names[month_names.length] = "December";

var day_names = new Array ( );
day_names[day_names.length] = "Sunday";
day_names[day_names.length] = "Monday";
day_names[day_names.length] = "Tuesday";
day_names[day_names.length] = "Wednesday";
day_names[day_names.length] = "Thursday";
day_names[day_names.length] = "Friday";
day_names[day_names.length] = "Saturday";

var date = {
	format: function(dateToFormat) {
		return day_names[dateToFormat.getDay()]+  ", " +  month_names[dateToFormat.getMonth()] + " " + 
			  date.addLeadingZero(dateToFormat.getDate())  + " " + dateToFormat.getFullYear() + " " + 
			  date.addLeadingZero(dateToFormat.getHours()) + ":" + date.addLeadingZero(dateToFormat.getMinutes()) + ":" + date.addLeadingZero(dateToFormat.getSeconds());
	},
	
	addLeadingZero: function(part) {
		if (part <= 9)
			return '0'+part;
		return part;
	}
};