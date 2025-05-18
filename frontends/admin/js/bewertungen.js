// js/bewertungen.js

const REVIEWS_API_BASE_URL = 'http://localhost:3003/api';
let reviewsData = [];

function loadBewertungen() {
    document.getElementById("mainContent").innerHTML = `
        <h2>Bewertungen</h2>
        <div class="row mb-3">
            <div class="col-md-4">
                <input type="text" id="reviewFilter" class="form-control" placeholder="Bewertungen filtern...">
            </div>
            <div class="col-md-3">
                <select id="serviceTypeFilter" class="form-select">
                    <option value="alle">Alle Dienstleistungen</option>
                    <option value="hotel">Hotels</option>
                    <option value="flug">Flüge</option>
                    <option value="mietwagen">Mietwagen</option>
                </select>
            </div>
            <div class="col-md-5 text-md-end">
                <button class="btn btn-success" onclick="showReviewForm()">
                    <i class="bi bi-plus-circle"></i> Neue Bewertung
                </button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-striped align-middle" id="reviewsTable">
                <thead>
                    <tr>
                        <th>Rezensent</th>
                        <th>Titel</th>
                        <th>Beschreibung</th>
                        <th>Sterne</th>
                        <th>Dienstleistung</th>
                        <th>Datum</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody id="reviewsList">
                    <tr>
                        <td colspan="7" class="text-center">Lade Bewertungen...</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="reviewFormContainer"></div>
        <div id="statusMessageReviews" class="alert d-none mt-3"></div>
    `;

    document.getElementById('reviewFilter').addEventListener('keyup', filterReviews);
    document.getElementById('serviceTypeFilter').addEventListener('change', filterReviews);

    fetchReviews();
}

async function fetchReviews() {
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}/reviews`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        reviewsData = await response.json();
        displayReviews(reviewsData);
    } catch (error) {
        showStatusMessageReviews(`Fehler beim Laden der Bewertungen: ${error.message}`, 'danger');
        document.getElementById("reviewsList").innerHTML =
            '<tr><td colspan="7" class="text-center text-danger">Fehler beim Laden der Bewertungen</td></tr>';
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById("reviewsList");
    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = '<tr><td colspan="7" class="text-center">Keine Bewertungen gefunden</td></tr>';
        return;
    }
    reviewsList.innerHTML = reviews.map(review => `
        <tr>
            <td>${review.nameRezensent}</td>
            <td>${review.titel}</td>
            <td>${truncateText(review.beschreibung, 50)}</td>
            <td>${getStars(review.sterne)}</td>
            <td>${getServiceTypeLabel(review.dienstleistungsTyp)}</td>
            <td>${formatDate(review.datum)}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick='showReviewForm(${JSON.stringify(review)})'>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteReview('${review._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function getStars(count) {
    let stars = '';
    for (let i = 0; i < count; i++) {
        stars += '<i class="bi bi-star-fill text-warning"></i> ';
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

function showReviewForm(review = null) {
    document.getElementById("reviewFormContainer").innerHTML = `
        <div class="card mt-4">
            <div class="card-header">
                <h5>${review ? 'Bewertung bearbeiten' : 'Neue Bewertung anlegen'}</h5>
            </div>
            <div class="card-body">
                <form id="reviewForm">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Name des Rezensenten</label>
                            <input type="text" class="form-control" name="nameRezensent" value="${review ? review.nameRezensent : ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Titel</label>
                            <input type="text" class="form-control" name="titel" value="${review ? review.titel : ''}" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Beschreibung</label>
                        <textarea class="form-control" name="beschreibung" rows="3" required>${review ? review.beschreibung : ''}</textarea>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Sterne</label>
                            <select class="form-select" name="sterne" required>
                                ${[1, 2, 3, 4, 5].map(i => `
                                    <option value="${i}" ${review && review.sterne == i ? 'selected' : ''}>${i} Stern${i !== 1 ? 'e' : ''}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Dienstleistungstyp</label>
                            <select class="form-select" name="dienstleistungsTyp" required>
                                <option value="hotel" ${review && review.dienstleistungsTyp === 'hotel' ? 'selected' : ''}>Hotel</option>
                                <option value="flug" ${review && review.dienstleistungsTyp === 'flug' ? 'selected' : ''}>Flug</option>
                                <option value="mietwagen" ${review && review.dienstleistungsTyp === 'mietwagen' ? 'selected' : ''}>Mietwagen</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" onclick="cancelReviewForm()">Abbrechen</button>
                        <button type="submit" class="btn btn-primary">Speichern</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById("reviewForm").onsubmit = async function(e) {
        e.preventDefault();
        const formData = {
            nameRezensent: this.nameRezensent.value,
            titel: this.titel.value,
            beschreibung: this.beschreibung.value,
            sterne: parseInt(this.sterne.value),
            dienstleistungsTyp: this.dienstleistungsTyp.value
        };
        
        if (review && review._id) {
            await updateReview({ ...formData, _id: review._id });
        } else {
            await createReview(formData);
        }
    };
}

function cancelReviewForm() {
    document.getElementById("reviewFormContainer").innerHTML = "";
}

function showStatusMessageReviews(message, type = 'success') {
    const statusElement = document.getElementById("statusMessageReviews");
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type} mt-3`;
    setTimeout(() => {
        statusElement.className = 'alert d-none mt-3';
    }, 3000);
}

async function createReview(reviewData) {
    try {
        const response = await fetch(`${REVIEWS_API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessageReviews("Bewertung erfolgreich erstellt");
        cancelReviewForm();
        fetchReviews();
    } catch (error) {
        showStatusMessageReviews(`Fehler beim Erstellen der Bewertung: ${error.message}`, 'danger');
    }
}

async function updateReview(reviewData) {
    try {
        const id = reviewData._id;
        delete reviewData._id;
        const response = await fetch(`${REVIEWS_API_BASE_URL}/reviews/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        showStatusMessageReviews("Bewertung erfolgreich aktualisiert");
        cancelReviewForm();
        fetchReviews();
    } catch (error) {
        showStatusMessageReviews(`Fehler beim Aktualisieren der Bewertung: ${error.message}`, 'danger');
    }
}

async function deleteReview(id) {
    if (confirm("Bewertung wirklich löschen?")) {
        try {
            const response = await fetch(`${REVIEWS_API_BASE_URL}/reviews/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            showStatusMessageReviews("Bewertung erfolgreich gelöscht");
            fetchReviews();
        } catch (error) {
            showStatusMessageReviews(`Fehler beim Löschen der Bewertung: ${error.message}`, 'danger');
        }
    }
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
