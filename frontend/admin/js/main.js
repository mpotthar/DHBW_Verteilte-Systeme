document.addEventListener("DOMContentLoaded", () => {
    // Default: Hotels laden
    loadModule("hotels");

    // Sidebar-Links (Desktop)
    document.querySelectorAll("#sidebarMenu a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelectorAll("#sidebarMenu a").forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            loadModule(link.dataset.module);
        });
    });

    // Navbar-Links (Mobile)
    document.querySelectorAll(".navbar-nav.d-lg-none a").forEach(link => {
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
