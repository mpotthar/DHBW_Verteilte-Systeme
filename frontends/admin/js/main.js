document.addEventListener("DOMContentLoaded", () => {
    // Default: Hotels laden
    loadModule("hotels");

    // Navigation
    document.querySelectorAll("#sidebarMenu a").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelectorAll("#sidebarMenu a").forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            loadModule(link.dataset.module);
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
    }
}
