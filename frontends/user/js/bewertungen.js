const REVIEWS_API_BASE_URL = 'http://localhost:3003/api';
let reviewsData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadReviews();
    document.getElementById('reviewFilter').addEventListener('keyup', filterReviews);
    document.getElementById('serviceTypeFilter').addEventListener('change', filterReviews);
});

async function loadReviews() {
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}/reviews`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        reviewsData = await response.json();
        displayReviews(reviewsData);
    } catch (error) {
        document.getElementById('reviewCards').innerHTML =
            `<div class="col-12 text-center">
                <div class="alert alert-danger">
                    Fehler beim Laden der Bewertungen. Bitte versuchen Sie es später erneut.
                </div>
            </div>`;
    }
}

function displayReviews(reviews) {
    const container = document.getElementById('reviewCards');
    if (!reviews || reviews.length === 0) {
        container.innerHTML = `<div class="col-12 text-center">
            <div class="alert alert-info">Keine Bewertungen gefunden.</div>
        </div>`;
        return;
    }
    container.innerHTML = reviews.map(review => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="review-title">${review.titel}</h5>
                    <div class="star-rating mb-2">
                        ${getStars(review.sterne)}
                    </div>
                    <p class="mb-1"><strong>Dienstleistung:</strong> ${getServiceTypeLabel(review.dienstleistungsTyp)}</p>
                    <p class="card-text">${truncateText(review.beschreibung, 100)}</p>
                </div>
                <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                    <span class="text-muted small"><i class="bi bi-person-circle"></i> ${review.nameRezensent}</span>
                    <button class="btn btn-outline-primary btn-sm" onclick='showReviewDetails(${JSON.stringify(review)})'>
                        Details ansehen
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getStars(count) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += '<i class="bi bi-star-fill"></i> ';
    }
    return stars;
}

function getServiceTypeLabel(type) {
    switch(type) {
        case 'hotel': return 'Hotel';
        case 'flug': return 'Flug';
        case 'mietwagen': return 'Mietwagen';
        default: return type;
    }
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function showReviewDetails(review) {
    const modalBody = document.getElementById('reviewModalBody');
    const modalTitle = document.getElementById('reviewModalLabel');
    modalTitle.textContent = review.titel;
    modalBody.innerHTML = `
        <div class="mb-3">
            <div class="star-rating mb-2">${getStars(review.sterne)}</div>
            <p><strong>Dienstleistung:</strong> ${getServiceTypeLabel(review.dienstleistungsTyp)}</p>
            <p><strong>Rezensent:</strong> ${review.nameRezensent}</p>
            <p><strong>Datum:</strong> ${formatDate(review.datum)}</p>
        </div>
        <div class="mb-3">
            <h6>Beschreibung:</h6>
            <p>${review.beschreibung}</p>
        </div>
    `;
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    reviewModal.show();
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function filterReviews() {
    const filterText = document.getElementById("reviewFilter").value.toUpperCase();
    const serviceTypeFilter = document.getElementById("serviceTypeFilter").value;
    let filtered = reviewsData.filter(review => {
        // Text-Filter
        const matchesText =
            (review.nameRezensent && review.nameRezensent.toUpperCase().includes(filterText)) ||
            (review.titel && review.titel.toUpperCase().includes(filterText)) ||
            (review.beschreibung && review.beschreibung.toUpperCase().includes(filterText));
        // Service-Typ-Filter
        const matchesType = serviceTypeFilter === 'alle' || review.dienstleistungsTyp === serviceTypeFilter;
        return matchesText && matchesType;
    });
    displayReviews(filtered);
}
