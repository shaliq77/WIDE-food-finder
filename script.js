let map;
let radiusInput;

function initMap() {
    // Get the radius input element
    radiusInput = document.getElementById('radius-input');

    // Validate the radius input
    const radius = parseInt(radiusInput.value, 10);
    if (isNaN(radius) || radius <= 0) {
        alert('Please enter a valid radius greater than 0.');
        return;
    }

    // Hide the input container and show the map container
    document.getElementById('input-container').style.display = 'none';
    document.getElementById('map-container').style.display = 'block';

    // Initialize the map centered at the user's location
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

            // Call function to show nearby restaurants with the specified radius
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
        radius: parseInt(radiusInput.value, 10), // Convert to integer
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
        animation: google.maps.Animation.DROP, // Add drop animation
    });

    const infowindow = new google.maps.InfoWindow({
        content: `<strong>${place.name}</strong><br>${place.vicinity}`,
    });

    // Open Google Maps when the marker is clicked
    marker.addListener('click', () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}`;
        window.open(googleMapsUrl, '_blank');
    });

    // Show info window when the marker is clicked
    marker.addListener('click', () => {
        infowindow.open(map, marker);
    });
}

// Clear all markers from the map
function clearMarkers() {
    if (map) {
        map.data.forEach(marker => {
            marker.setMap(null);
        });
    }
}
