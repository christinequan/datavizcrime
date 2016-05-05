var json = "https://dl.dropboxusercontent.com/s/souktjrm67okgkj/scpd_incidents.json?dl=0";

// List of days checked for visualization
var dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    valid_days = [true, true, true, true, true, true, true],
    valid_res = [true, true];

var crimeList = ["VANDALISM", "NON-CRIMINAL", "ASSAULT", "LARCENY/THEFT"];
var otherList = ["OTHER OFFENSES", "WARRANTS", "DISORDERLY CONDUCT", "TRESPASS", "SUSPICIOUS OCC", "DRUG/NARCOTIC", "SEX OFFENSES, FORCIBLE", "BURGLARY", "VEHICLE THEFT", "DRUNKENNESS", "STOLEN PROPERTY", "MISSING PERSON", "ARSON", "ROBBERY", "WEAPON LAWS", "FRAUD", "KIDNAPPING", "SEX OFFENSES, NON FORCIBLE", "SECONDARY CODES", "LIQUOR LAWS", "LOITERING", "FORGERY/COUNTERFEITING", "EMBEZZLEMENT", "DRIVING UNDER THE INFLUENCE", "GAMBLING", "EXTORTION", "RUNAWAY", "SUICIDE", "BRIBERY", "FAMILY OFFENSES", "PROSTITUTION"];

var myLatlng = new google.maps.LatLng(37.767683, -122.433701),
    workLatLng = new google.maps.LatLng(37.75, -122.4391);

var workIcon = 'http://www.myiconfinder.com/uploads/iconsets/32-32-6096188ce806c80cf30dca727fe7c237.png',
    homeIcon = 'http://www.myiconfinder.com/uploads/iconsets/32-32-32c51ea858089f8d99ae6a1f62deb573.png';

var homeMarker, workMarker, homeCircle, workCircle, globalData;

function initialize() {

    // -------------- map
    var map = new google.maps.Map(d3.select("#map").node(), {
        center: myLatlng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
        },
        streetViewControl: false,
    });

    // -------------- home and work marker, binding
    homeMarker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: homeIcon,
        draggable: true,
    });

    workMarker = new google.maps.Marker({
        position: workLatLng,
        map: map,
        icon: workIcon,
        draggable: true,
    });

    homeCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 0,
        fillColor: '#FF0000',
        fillOpacity: 0.15,
        map: map,
        center: myLatlng,
        radius: 1000,
        draggable: true,
        editable: false,
    });

    workCircle = new google.maps.Circle({
        strokeColor: '#4e64d1',
        strokeOpacity: 0.8,
        strokeWeight: 0,
        fillColor: '#4e64d1',
        fillOpacity: 0.15,
        map: map,
        center: workLatLng,
        radius: 1500,
        draggable: true,
        editable: false,
    });

    homeCircle.bindTo('center', homeMarker, 'position');
    workCircle.bindTo('center', workMarker, 'position');

    // -------------- adding in some listeners when circles + markers change

    google.maps.event.addListener(homeMarker, 'dragend', function() {
            applyFilters();
    });

    google.maps.event.addListener(workMarker, 'dragend', function() {
            applyFilters();
    });

    google.maps.event.addListener(workCircle, 'radius_changed', function() {
            applyFilters();
    });

    google.maps.event.addListener(homeCircle, 'radius_changed', function() {
            applyFilters();

    });

    // -------------- what are we filtering?

    $("input[class='day']").change(function() {
            $("input[class='day']").each(function(index, element) {
                valid_days[index] = element.checked;
            });
            //console.log(valid_days)
            applyFilters();
      });

    $("input[class='res']").change(function() {
            $("input[class='res']").each(function(index, element) {
                valid_res[index] = element.checked;
            });
            applyFilters();
      });

    // -------------- many filters such filter i'm meme'ing wrong

    var filterRes = function(d) {
      var res = d.value.Resolution;
      //console.log(res)
      if ((res == 'NONE') && (valid_res[1] == true)) {
        return true;
      } else if ((res != 'NONE') && (valid_res[0] == true)) {
        return true;
      } else {
        return false;
      }
      
    }

    var filterDays = function(d) {
        var index = dayList.indexOf(d.value.DayOfWeek),
            is_valid = valid_days[index];
            //console.log(valid_days)
        if (is_valid) {
            return true;
        } else {
            return false;
        }
    }

    var filterIntersection = function(d) {
        var _dLatLng = new google.maps.LatLng(d.value.Location[1], d.value.Location[0]);
        var distToWork = google.maps.geometry.spherical.computeDistanceBetween(workMarker.getPosition(), _dLatLng);
        var distToHome = google.maps.geometry.spherical.computeDistanceBetween(homeMarker.getPosition(), _dLatLng);
        if (distToWork < workCircle.radius && distToHome < homeCircle.radius) {
            return true;
        } else {
            return false;
        }
    }

    var filterAll = function(d) {
        if (filterIntersection(d) && filterDays(d) && filterRes(d)) {
            d3.select(this).style('visibility', 'visible');
        } else {
            d3.select(this).style('visibility', 'hidden');
        }
        //console.log(countMovement)
    };

    // -------------- adding all other markers on an overlay

    var padding = 10;
    var overlay = new google.maps.OverlayView();

    var updateMarkers = function(data) {

        var marker = d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(transformMarkers) // update existing markers
            .enter().append("svg")
            .each(transformMarkers)
            .attr("class", "marker");

        // Add a circle.
        marker.insert("circle")
            .attr("r", 1.5)
            .attr("cx", padding)
            .attr("cy", padding);
    };

    function transformMarkers(d) {
        d = new google.maps.LatLng(d.value.Location[1], d.value.Location[0]);
        d = overlay.getProjection().fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
    };

    var applyFilters = function() {
        //console.log("Applying filters")
        countMovement = 0;
        d3.select('.incidents').selectAll("svg")
            .data(d3.entries(globalData['data']))
            .each(filterAll); // update existing markers
    };

    d3.json("scpd_incidents.json", function(error, data) {
        if (error) throw error;
        globalData = data;
        // Add the container when the overlay is added to the map.

        overlay.onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "incidents");

            // Draw each marker as a separate SVG element.
            overlay.draw = function() {
                updateMarkers(data)
            };
        };

        overlay.setMap(map);
    });

} // end of initializing


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

