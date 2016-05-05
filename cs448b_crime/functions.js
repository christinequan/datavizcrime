function updateHomeRadius(val) {
    homeCircle.setRadius(Number(val));
}

function updateWorkRadius(val) {
    workCircle.setRadius(Number(val));
    document.getElementById('textInputWork').value = val;
}

function showInput(id, display) {

    var message_entered =  document.getElementById(id).value;
    document.getElementById(display).innerHTML = message_entered;
}

function updateTextInput(val) {
      document.getElementById('textInput').value=val; 
    }

/*$(function() {
  $( "#home_slider" ).slider({
    orientation: "horizontal",
    range: "min",
    min: 1,
    max: 10,
    value: 10,
    slide: function( event, ui ) {
     updateRadius(circle, ui.value);
    }


     $( "#work_slider" ).slider({
    orientation: "horizontal",
    range: "min",
    min: 1,
    max: 10,
    value: 10,
    slide: function( event, ui ) {
     updateRadius(circle, ui.value);
    }
});*/


function updateRadius(circle, rad){
  circle.setRadius(rad);
}


// Mapping the variables to bin them
var CRIME_BIN = {
  "ARSON": "PROPERTY",
  "ASSAULT": "PERSONAL",
  "BRIBERY": "FINANCIAL",
  "BURGLARY": "PROPERTY",
  "DISORDERLY CONDUCT": "AlCOHOL/DRUG",
  "DRIVING UNDER THE INFLUENCE": "ALCOHOL/DRUG",
  "DRUG/NARCOTIC": "ALCOHOL/DRUG",
  "DRUNKENNESS": "ALCOHOL/DRUG",
  "EMBEZZLEMENT": "FINANCIAL",
  "EXTORTION": "PERSONAL",
  "FAMILY OFFENSES": "PERSONAL",
  "FORGERY/COUNTERFEITING": "FINANCIAL",
  "FRAUD": "FINANCIAL",
  "GAMBLING": "FINANCIAL",
  "KIDNAPPING": "PERSONAL",
  "LARCENY/THEFT": "PROPERTY",
  "LIQUOR LAWS": "AlCOHOL/DRUG",
  "LOITERING": "OTHER",
  "MISSING PERSON": "PERSONAL",
  "NON-CRIMINAL": "OTHER",
  "OTHER OFFENSES": "OTHER",
  "PROSTITUTION": "OTHER",
  "ROBBERY": "PROPERTY",
  "RUNAWAY": "PERSONAL",
  "SECONDARY CODES": "OTHER",
  "SEX OFFENSES, FORCIBLE": "PERSONAL",
  "SEX OFFENSES, NON FORCIBLE": "PERSONAL",
  "STOLEN PROPERTY": "PROPERTY",
  "SUICIDE": "OTHER",
  "SUSPICIOUS OCC": "OTHER",
  "TRESPASS": "PROPERTY",
  "VANDALISM": "PROPERTY",
  "VEHICLE THEFT": "PROPERTY",
  "WARRANTS": "OTHER",
  "WEAPON LAWS": "OTHER"
}

// Visualize the data

/*var see_points = [];
var marker_images = [];

var crime_categories_on = {
  "PERSONAL": true,
  "PROPERTY": true,
  "FINANCIAL": true,
  "ALCOHOL/DRUG": true,
  "OTHER": true
};


function isCrimeTypeOn(type) {
  var crime_type = CRIME_BIN[type];
  return crimes_checked[crime_type];
}

function updatePoints (globalData, projection) {
  visible_crime_data = globalData.filter(function(entry) {
   
    //check that crime category has been checked
    var crime_type = entry["Category"];
    if (!isCrimeTypeOn(crime_type)) {
      return false;
    }

    return true;
  });*/


// jquery two-tailed slider
$(function() {
    $( "#time_slider" ).slider({
      range: true,
      min: 0,
      max: 23,
      values: [8, 18],

      slide: function( event, ui ) {
        $( "#time" ).val(ui.values[0] + ":00 - " + ui.values[ 1 ] + ":00");
      }
    });

    $( "#time" ).val($( "#time_slider" ).slider( "values", 0 ) +
      ":00 - " + $( "#time_slider" ).slider( "values", 1 ) + ":00");
});
