/**
 * Hämtar användarens nuvarande geografiska position (latitude och longitude) om geolokalisering stöds av webbläsaren.
 * Om det uppstår ett fel vid hämtning av positionen, loggas ett felmeddelande.
 * 
 * @returns {void} Funktionen returnerar ingenting, den använder en callback för att hantera resultaten.
 */
function getUserLocation() {
    // Kontrollera om webbläsaren stödjer geolokalisering
    if ("geolocation" in navigator) {
        // Om geolokalisering är tillgänglig, hämta den aktuella positionen
        navigator.geolocation.getCurrentPosition(
            function(position) {
                // Hämtar latitude och longitude från positionen
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Logga latitud och longitud
                console.log("Latitude: " + latitude);
                console.log("Longitude: " + longitude);

                // Här kan du använda koordinaterna för att exempelvis uppdatera en karta
            },
            function(error) {
                // Om det uppstår ett fel vid inhämtning av positionen
                console.error("Fel vid inhämtning av position:", error.message);
            },
            {
                enableHighAccuracy: true, // Försök att få en mer exakt position
                timeout: 10000, // Maximal tid för att hämta positionen (5 sekunder)
                maximumAge: 0 // Ingen cachelagring
            }
        );
    } else {
        // Om geolokalisering inte stöds av webbläsaren
        console.log("Geolokalisering stöds inte av din webbläsare");
    }
}

// Anropa funktionen för att hämta och logga användarens nuvarande position
getUserLocation();