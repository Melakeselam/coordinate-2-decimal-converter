document.addEventListener('DOMContentLoaded', () => {
    const conversionTypeSelect = document.getElementById('conversionType');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const convertBtn = document.getElementById('convertBtn');
    const resultContainer = document.getElementById('resultContainer');
    const resultText = document.getElementById('result');
    const copyBtn = document.getElementById('copyBtn');
    const banner = document.getElementById('banner'); // New banner element for success message

    // Function to update placeholders based on conversion type
    const updatePlaceholders = () => {
        const conversionType = conversionTypeSelect.value;
        if (conversionType === 'dmsToDecimal') {
            latitudeInput.placeholder = 'e.g., 9°00\'39.2"N';
            longitudeInput.placeholder = 'e.g., 38°51\'23.5"E';
        } else {
            latitudeInput.placeholder = 'e.g., 9.010889';
            longitudeInput.placeholder = 'e.g., 38.856528';
        }
    };

    // Function to handle paste events
    const handlePaste = (event) => {
        const conversionType = conversionTypeSelect.value;
        const pastedData = event.clipboardData.getData('text').trim();
        const splitData = pastedData.split(/\s+|\s*,\s*/);

        if (splitData.length === 2) {
            const [firstValue, secondValue] = splitData;
            if (conversionType === 'dmsToDecimal') {
                event.preventDefault();
                if (isLatitude(firstValue) && isLongitude(secondValue)) {
                    latitudeInput.value = firstValue;
                    longitudeInput.value = secondValue;
                } else if (isLongitude(firstValue) && isLatitude(secondValue)) {
                    latitudeInput.value = secondValue;
                    longitudeInput.value = firstValue;
                }
            } else if (conversionType === 'decimalToDms') {
                event.preventDefault();
                latitudeInput.value = firstValue;
                longitudeInput.value = secondValue;
            }
        }
    };

    // Function to validate latitude input
    const isLatitude = (value) => {
        const dmsRegex = /[NS]/i;
        const decimalRegex = /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/;
        return dmsRegex.test(value) || decimalRegex.test(value);
    };

    // Function to validate longitude input
    const isLongitude = (value) => {
        const dmsRegex = /[EW]/i;
        const decimalRegex = /^-?(1[0-7]?[0-9](\.\d+)?|180(\.0+)?)$/;
        return dmsRegex.test(value) || decimalRegex.test(value);
    };

    // Function to convert DMS to decimal
    const dmsToDecimal = (dms) => {
        const dmsRegex = /(\d+)°(\d+)'(\d+(?:\.\d+)?)"(N|S|E|W)/i;
        const matches = dms.match(dmsRegex);
        if (!matches) return null;

        const degrees = parseFloat(matches[1]);
        const minutes = parseFloat(matches[2]);
        const seconds = parseFloat(matches[3]);
        const direction = matches[4].toUpperCase();

        let decimal = degrees + (minutes / 60) + (seconds / 3600);
        if (direction === 'S' || direction === 'W') decimal = -decimal;

        return decimal;
    };

    // Function to convert decimal to DMS
    const decimalToDms = (decimal) => {
        const degrees = Math.floor(Math.abs(decimal));
        const minutes = Math.floor((Math.abs(decimal) - degrees) * 60);
        const seconds = ((Math.abs(decimal) - degrees - (minutes / 60)) * 3600).toFixed(2);
        const direction = decimal >= 0 ? ['N', 'E'] : ['S', 'W'];

        return `${degrees}°${minutes}'${seconds}"${decimal >= 0 ? direction[0] : direction[1]}`;
    };

    // Event listener for conversion type change
    conversionTypeSelect.addEventListener('change', () => {
        updatePlaceholders();
        latitudeInput.value = '';
        longitudeInput.value = '';
        resultText.innerHTML = '';
        resultContainer.style.display = 'none';
        copyBtn.style.display = 'none';
    });

    // Event listeners for paste events
    latitudeInput.addEventListener('paste', handlePaste);
    longitudeInput.addEventListener('paste', handlePaste);

    // Event listener for convert button
    convertBtn.addEventListener('click', () => {
        const conversionType = conversionTypeSelect.value;
        const latValue = latitudeInput.value.trim();
        const longValue = longitudeInput.value.trim();

        if (!latValue || !longValue) {
            alert('Please enter both latitude and longitude.');
            return;
        }

        let result;
        if (conversionType === 'dmsToDecimal') {
            const latitude = dmsToDecimal(latValue);
            const longitude = dmsToDecimal(longValue);
            if (latitude === null || longitude === null) {
                alert('Invalid DMS format.');
                return;
            }
            result = `Latitude: <strong>${latitude.toFixed(6)}</strong>, Longitude: <strong>${longitude.toFixed(6)}</strong>`;
        } else {
            const latitude = parseFloat(latValue);
            const longitude = parseFloat(longValue);
            if (isNaN(latitude) || isNaN(longitude)) {
                alert('Invalid decimal format.');
                return;
            }
            result = `Latitude: <strong>${decimalToDms(latitude)}</strong>, Longitude: <strong>${decimalToDms(longitude)}</strong>`;
        }

        resultText.innerHTML = result;
        resultContainer.style.display = 'flex';
        copyBtn.style.display = 'inline-block';
    });

    // Event listener for copy button
    copyBtn.addEventListener('click', () => {
        let textToCopy = resultText.innerText;
        textToCopy = textToCopy.replace('Latitude: ','')
        textToCopy = textToCopy.replace('Longitude: ','')
        navigator.clipboard.writeText(textToCopy).then(() => {
            showBanner(`Coordinates (${textToCopy}) copied to clipboard.`);
        }).catch(err => {
            showBanner('Failed to copy coordinates.', 'red');
        });
    });

    // Function to show the green banner with a success message
    const showBanner = (message, color = '#41b45c') => {
        banner.innerText = message;
        banner.style.backgroundColor = color;
        banner.style.display = 'block';

        setTimeout(() => {
            banner.style.display = 'none';
        }, 5000); // Banner disappears after 5 seconds
    };

    // Initialize placeholders
    updatePlaceholders();
});
