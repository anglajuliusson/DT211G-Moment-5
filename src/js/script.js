/**
 * Hämtar antagningsdata från Mittuniversitetets API och returnerar den som JSON.
 * @returns {Promise<Object[]>} En Promise som löser sig med en array av objekt.
 */
async function fetchData() {
    try {
        const response = await fetch('https://studenter.miun.se/~mallar/dt211g/');
        if (!response.ok) {
            throw new Error(`HTTP-fel! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Hämtad data:", data); // Logga data till konsolen för felsökning
        return data;
    } catch (error) {
        console.error("Ett fel uppstod vid hämtning:", error);
        return [];
    }
}

/**
 * Filtrerar ut kurser, sorterar efter antal sökande och returnerar de 6 mest populära.
 * @param {Object[]} data - Data hämtad från API:et.
 * @returns {Object[]} En array med de 6 mest sökta kurserna.
 */
function getTopCourses(data) {
    const courses = data
        .filter(item => 
            item.type === 'Kurs') // Filtrera ut endast kurser
            // Hade problem att sortera ut program och kurser först men hade skrivit kurs istället för Kurs, vilktigt med stor bokstav!
        .map(course => ({
            name: course.name,
            applicantsTotal: course.applicantsTotal
        }))
        .sort((a, b) => b.applicantsTotal - a.applicantsTotal) // Sortera fallande
        .slice(0, 6); // Ta de 6 mest sökta

    console.log("De 6 mest sökta kurserna:", courses); // Logga för felsökning
    return courses;
}

/**
 * Skapar ett stapeldiagram med de mest sökta kurserna.
 * @param {Object[]} courses - En array med kursnamn och antal sökande.
 */
function createBarChart(courses) {
    const ctx = document.querySelector('.courseChart').getContext('2d');
    const labels = courses.map(course => course.name);
    const data = courses.map(course => course.applicantsTotal);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Antal sökande',
                data: data,
                backgroundColor: 'white',
                borderColor: 'white',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Antal sökande' // Y-axel för antal sökande
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Kurser' // X-axel för kursnamn
                    }
                }
            }
        }
    });
}

/**
 * Filtrerar ut program, sorterar efter antal sökande och returnerar de 5 mest populära.
 * @param {Object[]} data - Data hämtad från API:et.
 * @returns {Object[]} En array med de 5 mest sökta kurserna.
 */
function getTopPrograms(data) {
    const courses = data
        .filter(item => 
            item.type === 'Program') // Filtrera ut endast program
        .map(course => ({
            name: course.name,
            applicantsTotal: course.applicantsTotal
        }))
        .sort((a, b) => b.applicantsTotal - a.applicantsTotal) // Sortera fallande
        .slice(0, 5); // Ta de 5 mest sökta

    console.log("De 5 mest sökta kurserna:", courses); // Logga för felsökning
    return courses;
}

/**
 * Skapar ett cirkeldiagram med de mest sökta programmen.
 * @param {Object[]} programs - En array med programnamn och antal sökande.
 */
function createPieChart(programs) {
    const ctx = document.querySelector('.programChart').getContext('2d');

    const labels = programs.map(program => program.name);
    const data = programs.map(program => program.applicantsTotal);

    new Chart(ctx, {
        type: 'pie', // Cirkeldiagram
        data: {
            labels: labels,
            datasets: [{
                label: 'Antal sökande',
                data: data,
                backgroundColor: [
                    'white',
                    'lightgrey',
                    'grey',
                    'darkgrey',
                    'black'
                ],
                borderColor: [
                        'white',
                        'lightgrey',
                        'grey',
                        'darkgrey',
                        'black'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true
                }
            }
        }
    });
}

// Huvudfunktion som körs när sidan laddas
async function main() {
    try {
        const data = await fetchData(); // Hämta data från API
        const topCourses = getTopCourses(data); // Filtrera de mest sökta kurserna
        const topPrograms = getTopPrograms(data); // Filtrera de mest sökta programmen
        createBarChart(topCourses); // Skapa diagrammet
        createPieChart(topPrograms); // Skapa cirkeldiagram
    } catch (error) {
        console.error("Ett fel uppstod:", error);
    }
}

// Kör skriptet när sidan har laddats helt
window.onload = main;