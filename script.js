let map;
let radiusInput;

function initMap() {
    radiusInput = document.getElementById('radius-input');

    const radius = parseInt(radiusInput.value, 10);
    if (isNaN(radius) || radius <= 0) {
        alert('Please enter a valid radius greater than 0.');
        return;
    }

    document.getElementById('input-container').style.display = 'none';
    document.getElementById('map-container').style.display = 'block';

    navigator.geolocation.getCurrentPosition(
        position => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map = new google.maps.Map(document.getElementById("map"), {
                center: userLocation,
                zoom: 15,
            });

            showNearbyRestaurants();
        },
        error => {
            console.error("Error getting user location:", error);
            alert("Error getting user location. Please enable location services and refresh the page.");
        }
    );
}

function showNearbyRestaurants() {
    const userLocation = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
    };

    const request = {
        location: userLocation,
        radius: parseInt(radiusInput.value, 10), 
        types: ['restaurant']
    };

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers(); // Clear existing markers
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        } else {
            console.error("Error fetching nearby restaurants:", status);
        }
    });
}

function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        animation: google.maps.Animation.DROP, 
    });

    const infowindow = new google.maps.InfoWindow({
        content: `<strong>${place.name}</strong><br>${place.vicinity}`,
    });

    
    marker.addListener('click', () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}`;
        window.open(googleMapsUrl, '_blank');
    });

   
    marker.addListener('click', () => {
        infowindow.open(map, marker);
    });
}


function clearMarkers() {
    if (map) {
        map.data.forEach(marker => {
            marker.setMap(null);
        });
    }
}
