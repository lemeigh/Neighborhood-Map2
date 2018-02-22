var map;
var markers = [];
var marker;
var largeInfoWindow;
var locations = [{
        title: 'Kalapawai Market',
        location: {
            lat: 21.397472,
            lng: -157.729859
        },
        foursquareId: '4b6724dcf964a5207b3d2be3',

        showLocation: ko.observable(true)
    },
    {
        title: 'Lanikai Beach',
        location: {
            lat: 21.393053,
            lng: -157.715435
        },
        foursquareId: '4bd94c75e914a593222456fa',

        showLocation: ko.observable(true)
    },
    {
        title: 'Kailua Beach',
        location: {
            lat: 21.397594,
            lng: -157.727089
        },
        foursquareId: '4fb59a1ce4b0b85e6ee6fbe4',

        showLocation: ko.observable(true)
    },
    {
        title: 'Lanikai Pillboxes Hike',
        location: {
            lat: 21.390017,
            lng: -157.718947
        },
        foursquareId: '4b05865bf964a520c45e22e3',

        showLocation: ko.observable(true)
    },
    {
        title: 'Mokulua Islands',
        location: {
            lat: 21.391614,
            lng: -157.699148
        },
        foursquareId: '4ba3c9f1f964a520715f38e3',

        showLocation: ko.observable(true)
    }
];

var ViewModel = function() {
    var self = this;
    this.hawaiiLocations = ko.observableArray([]);

    locations.forEach(function(faveLocation) {
        self.hawaiiLocations.push(faveLocation);
    });

    this.currentLocation = ko.observable(this.hawaiiLocations()[0]);

    for (var i = 0; i < locations.length; i++) {
        this.hawaiiLocations()[i].marker = markers[i];
    };


// set user filter as ko observable
    self.searchItem = ko.observable('');

    // filter function: updates observableArray and 
    // sets visibility of location markers
    self.runLocationSearch = function() {
        var hawaiiSearch = self.searchItem().toLowerCase();

        // 1. clear the array
        self.hawaiiLocations.removeAll();

        // 2. run the filter and only add to the array if a match
        self.hawaiiLocations.forEach(function(faveLocation) {

            // set marker to false i.e. invisible
            faveLocation.marker.setVisible(false);

            if(faveLocation.name.toLowerCase().indexOf(searchFilter) !== -1) {
                self.hawaiiLocations.push(faveLocation);
            }
        });
    };        

self.searchItem.subscribe(self.searchFilter);
self.searchItem.subscribe(self.markerFilter);  

}

// Function to initialize the map within the map
ViewModel.prototype.initMap = function() {
    var styles = [{
        featureType: 'water',
        stylers: [{
            color: '#00CED1'
        }]
    }];

    this.map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 21.393053,
            lng: -157.715435
        },
        zoom: 14,
        styles: styles,
        mapTypeControl: false,
        clickableIcons: false
    });

    var foursquareId = 'WXOHJHJAKROJ3AKAN0IGRBQLZXQGUHLAABU1DX4S1UDKD4X5';
    var foursquareSecret = '5LFQG2K51SOHGDRYG1ZQUNP5ZWK1SWFIOAX5140KINVQRZ4I';

    //this creates the infowindow
    largeInfoWindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        marker = new google.maps.Marker({
            map: this.map,
            position: position,
            title: title,
            id: locations[i].foursquareId
        });

        markers.push(marker);

        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfoWindow);
            toggleBounce(this);
        });
    }
    //this makes the marker bounce on click and stops it after approx 3 bounces
    function toggleBounce(marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null)
      }, 2000);
    }

    function populateInfoWindow(marker, infowindow) {
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                infowindow.setContent('<div>' + marker.title + '<div>');
                infowindow.open(map, marker);
                infowindow.addListener('closeclick', function() {
                    infowindow.setmarker(null);
                });
            }
        }

   //these control the show and hide buttons - clearing or replacing the markers
    document.getElementById('show-places').addEventListener('click', function() {
      showMarkers(markers);
    });
    
    document.getElementById('hide-places').addEventListener('click', function() {
      hideMarkers(markers);
    });

    
    function showMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(true);
        }
    }

    function hideMarkers(markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
        }
    }
};
// set user filter as ko observable
    self.searchItem = ko.observable('');

    // filter function: updates observableArray and 
    // sets visibility of location markers
    self.runLocationSearch = function() {
        var hawaiiSearch = self.searchItem().toLowerCase();

        // 1. clear the array
        self.hawaiiLocations.removeAll();

        // 2. run the filter and only add to the array if a match
        self.hawaiiLocations.forEach(function(locationItem) {

            // set marker to false i.e. invisible
            locationItem.marker.setVisible(false);

            if(locationItem.name.toLowerCase().indexOf(searchFilter) !== -1) {
                self.hawaiiLocations.push(locationItem);
            }
        });
    };    

self.searchItem.subscribe(self.searchFilter);
self.searchItem.subscribe(self.markerFilter);    




function errorHandling() {
    alert("Wait, what? Please try again.");
}

var locationVM = new ViewModel();
ko.applyBindings(locationVM);