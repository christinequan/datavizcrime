var homeMarker, workMarker, homeCircle, workCircle;
var json = "https://dl.dropboxusercontent.com/s/souktjrm67okgkj/scpd_incidents.json?dl=0";
var globalData;

// List of days checked for visualization
var dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var maxDayList = 7;
var timeList = ["04:00", "12:00", "18:00"];
var crimeList = ["VANDALISM", "NON-CRIMINAL", "ASSAULT", "LARCENY/THEFT"];
var addOthers = false;
var otherList = ["OTHER OFFENSES", "WARRANTS", "DISORDERLY CONDUCT", "TRESPASS", "SUSPICIOUS OCC", "DRUG/NARCOTIC", "SEX OFFENSES, FORCIBLE", "BURGLARY", "VEHICLE THEFT", "DRUNKENNESS", "STOLEN PROPERTY", "MISSING PERSON", "ARSON", "ROBBERY", "WEAPON LAWS", "FRAUD", "KIDNAPPING", "SEX OFFENSES, NON FORCIBLE", "SECONDARY CODES", "LIQUOR LAWS", "LOITERING", "FORGERY/COUNTERFEITING", "EMBEZZLEMENT", "DRIVING UNDER THE INFLUENCE", "GAMBLING", "EXTORTION", "RUNAWAY", "SUICIDE", "BRIBERY", "FAMILY OFFENSES", "PROSTITUTION"];
var myLatlng = new google.maps.LatLng(37.767683, -122.433701);
var workLatLng = new google.maps.LatLng(37.75, -122.4391);
var testLatLng = new google.maps.LatLng(37.7605000725995, -122.414845139206);
var workIcon = 'http://www.myiconfinder.com/uploads/iconsets/32-32-6096188ce806c80cf30dca727fe7c237.png';
var homeIcon = 'http://www.myiconfinder.com/uploads/iconsets/32-32-32c51ea858089f8d99ae6a1f62deb573.png';

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
        title: "Drag me!"
    });

    workMarker = new google.maps.Marker({
        position: workLatLng,
        map: map,
        icon: workIcon,
        draggable: true,
        title: "Drag me!"
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

    // -------------- adding all other markers on an overlay

    var padding = 10;
    var overlay = new google.maps.OverlayView();

    var updateMarkers = function(data) {
        console.log("updateMarkers called")
        //console.log(globalData['data'])

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

        console.log(marker)
    };

    function transformMarkers(d) {
        d = new google.maps.LatLng(d.value.Location[1], d.value.Location[0]);
        d = overlay.getProjection().fromLatLngToDivPixel(d);
        return d3.select(this)
            .style("left", (d.x - padding) + "px")
            .style("top", (d.y - padding) + "px");
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
        console.log("We did the overlay thing.")
    });

} // end of initializing