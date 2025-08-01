/**
 * Hämtar användarens nuvarande geografiska position (latitude och longitude) om geolokalisering stöds av webbläsaren.
 * Om det uppstår ett fel vid hämtning av positionen, loggas ett felmeddelande.
 * 
 * @returns {Promise<{lat: number, lng: number}>} // Hämta användarens position som en Promise.
 */
function getUserLocation() {
    return new Promise ((resolve, reject) => {
    // Kontrollera om webbläsaren stödjer geolokalisering
    if ("geolocation" in navigator) {
        // Om geolokalisering är tillgänglig, hämta den aktuella positionen
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Hämtar latitude och longitude från positionen
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                resolve ({lat: latitude, lng: longitude})

                // Logga latitud och longitud
                console.log("Latitude: " + latitude);
                console.log("Longitude: " + longitude);
            },
            (error) => {
                // Om det uppstår ett fel vid inhämtning av positionen
                console.error("Fel vid inhämtning av position:", error.message);
                reject(error);
            },
            {
                enableHighAccuracy: true, // Försök att få en mer exakt position
                timeout: 5000, // Maximal tid för att hämta positionen (5 sekunder)
                maximumAge: 0 // Ingen cachelagring
            }
        );
    } else {
        // Om geolokalisering inte stöds av webbläsaren
        console.log("Geolokalisering stöds inte av din webbläsare");
        reject(new Error("Geolokaliseringen stöds inte"))
    }
});
}

/**
 * Initierar Google Maps-kartan och markerar användarens aktuella position på kartan.
 * Hämtar användarens geografiska position (latitude och longitude) och använder dessa för att
 * centrera kartan och placera en markör vid användarens position.
 * 
 * Om det inte går att hämta användarens position eller om det sker ett annat fel vid
 * inladdning av kartan, loggas ett felmeddelande i konsolen.
 *
 * @async
 * @function
 * @returns {Promise<void>} 
 */
async function initMap() {
    try {
        // Hämta användarens position från geolokalisering
        const { lat, lng } = await getUserLocation(); 

        // Vänta på att Google Maps biblioteket och markörbiblioteket ska laddas
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        // Definiera positionen med hjälp av användarens latitude och longitude
        const position = { lat, lng };

        // Skapa en ny Google Map instans och centrera på användarens position
        map = new Map(document.querySelector(".mapFrame"), {
            zoom: 13, // Zoomnivå på kartan
            center: position, // Centrerar kartan på användarens position
            mapId: "eee69d787741fca3", // Google Maps karta-id
        });

        // Skapa en markör vid användarens position
        marker = new AdvancedMarkerElement({
            map: map,
            position: position,
            title: "Din position", // Titel på markören
        });
    } catch (error) {
        // Logga ett fel om något går fel vid inladdningen av kartan eller positionen
        console.error("Kunde inte initiera kartan pga platsfel:", error);
    }
}
// Anropa funktionen för att hämta och logga användarens nuvarande position
window.initMap = initMap;

/**
 * Söker en plats via Nominatim och uppdaterar kartan.
 * 
 * @async
 * @function searchLocation
 * @param {string} query - Plats eller adress som ska sökas
 */
async function searchLocation(query) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`;
        const response = await fetch(url);
        const results = await response.json();

        if (results.length > 0) {
            // // Försök hitta stad, ort eller by först
            const place = results.find(r => ["city", "town", "village"].includes(r.type)) || results[0];

            // Hämta lat & lon 
            const lat = place.lat;
            const lon = place.lon;

            const position = { lat: parseFloat(lat), lng: parseFloat(lon) };

            map.setCenter(position);
            map.setZoom(14);
        } else {
            alert("Ingen plats hittades.");
        }
    } catch (error) {
        console.error("Fel vid platsökning:", error);
        alert("Ett fel uppstod vid sökningen.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector(".search_button");
    const locationInput = document.querySelector(".locationInput");

    if (searchButton && locationInput) {
        searchButton.addEventListener("click", () => {
            const query = locationInput.value.trim();
            if (query) {
                searchLocation(query);
            }
        });
    } else {
        console.warn("Sökfält eller sökknapp hittades inte i DOM:en.");
    }
});