document.addEventListener("DOMContentLoaded", () => {
    // Default: Hotels laden
    loadModule("hotels");

    // Navbar-Links
    document.querySelectorAll(".navbar-nav.ms-auto a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            loadModule(link.dataset.module);

            // Optional: Menü nach Klick automatisch schließen
            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });
});


function loadModule(module) {
    switch(module) {
        case "hotels":
            loadHotels();
            break;
        case "bewertungen":
            loadBewertungen();
            break;
        case "fluege":
            loadFlights();
            break;
        case "mietwagen":
            loadMietwagen();
            break;
        case "demodaten":
            loadDemoData();
            break;
    }
}
