document.getElementById('convertBtn').addEventListener('click', function () {
    const lat = document.getElementById('latitude').value.trim();
    const long = document.getElementById('longitude').value.trim();

    // Simple validation to check if values are entered
    if (lat === '' || long === '') {
        alert('Please enter both latitude and longitude.');
        return;
    }

    // Convert latitude and longitude to decimal format
    const latitude = dmsToDecimal(lat);
    const longitude = dmsToDecimal(long);

    if (latitude === null || longitude === null) {
        alert('Invalid input format. Please enter a valid DMS format.');
        return;
    }

    // Display the result with bolded text for the decimal values
    const result = `Latitude: <strong>${latitude.toFixed(6)}</strong>, Longitude: <strong>${longitude.toFixed(6)}</strong>`;
    document.getElementById('result').innerHTML = result;  // Use innerHTML for HTML tags like <strong>
    document.getElementById('resultContainer').style.display = 'flex';

    // Show the copy button
    document.getElementById('copyBtn').style.display = 'inline-block';

    // Store the raw coordinates for copying
    document.getElementById('copyBtn').setAttribute('data-coordinates', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
});

function dmsToDecimal(dms) {
    // Regular expression to extract DMS components
    const dmsRegex = /(\d+)°(\d+)'(\d+(?:\.\d+)?)"(N|S|E|W)/i;
    const matches = dms.match(dmsRegex);

    if (!matches) {
        return null;  // Return null if format is invalid
    }

    let degrees = parseFloat(matches[1]);
    const minutes = parseFloat(matches[2]);
    const seconds = parseFloat(matches[3]);
    const direction = matches[4].toUpperCase();

    // Convert DMS to decimal degrees
    let decimal = degrees + (minutes / 60) + (seconds / 3600);

    // If direction is S or W, make the value negative
    if (direction === 'S' || direction === 'W') {
        decimal = -decimal;
    }

    return decimal;
}
