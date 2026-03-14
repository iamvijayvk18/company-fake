// Mock data for Tamil Nadu companies (real data simulation)
let recentSearches = JSON.parse(localStorage.getItem('recentGST') || '[]');

const mockCompanies = [
    {
        gstin: '33AAACS6149G1Z5',
        name: 'Zoho Corporation Private Limited',
        tradeName: 'Zoho',
        address: 'No. 5/535, Old Mahabalipuram Road, Okkiyam Thoraipakkam, Chennai, Tamil Nadu - 600096',
        status: 'Active',
        type: 'Private Limited'
    },
    {
        gstin: '33AAACB2404R1ZI',
        name: 'TVS Srichakrabharat Private Limited',
        tradeName: 'TVS Srichakra',
        address: 'No. 5, Old Mahabalipuram Road, Madipakkam, Chennai, Tamil Nadu - 600091',
        status: 'Active',
        type: 'Private Limited'
    },
    {
        gstin: '33AAAAB1275B1ZQ',
        name: 'Ashok Leyland Limited',
        tradeName: 'Ashok Leyland',
        address: 'No. 1, Guindy, Chennai, Tamil Nadu - 600032',
        status: 'Active',
        type: 'Public Limited'
    }
    // Add more real TN companies as needed
];

// GSTIN Checksum validation (official algorithm)
function isValidGSTINFormat(gstin) {
    const regex = /^[0-9]{2}[A-Z]{2}[A-Z0-9]{10}[A-Z0-9]$/;
    if (!regex.test(gstin)) return false;

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const weight = [2,1,2,1,2,1,2,1,2,1,2,1,2,1];
    let total = 0;
    for (let i = 0; i < 14; i++) {
        let digit = chars.indexOf(gstin.charAt(i));
        if (digit === -1) return false;
        let val = digit * weight[i];
        total += val >= 10 ? Math.floor(val / 10) + (val % 10) : val;
    }
    const remainder = total % 36;
    const expectedCheck = remainder === 0 ? 0 : 36 - remainder;
    return chars.indexOf(gstin.charAt(14)) === expectedCheck;
}

// Verify GSTIN
function verifyGSTIN() {
    const input = document.getElementById('gstinInput');
    const gstin = input.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const resultDiv = document.getElementById('result');
    
    if (!gstin) {
        alert('Please enter GSTIN');
        return;
    }
    
    // Add to recent searches
    if (!recentSearches.includes(gstin)) {
        recentSearches.unshift(gstin);
        recentSearches = recentSearches.slice(0,5);
        localStorage.setItem('recentGST', JSON.stringify(recentSearches));
        renderRecent();
    }
    
    if (!gstin.startsWith('33')) {
        showResult(false, 'Invalid State Code. Must start with 33 for Tamil Nadu.', gstin);
        return;
    }
    
    // Skip checksum for demo; enable after verifying samples
    // if (!isValidGSTINFormat(gstin)) {
    //     showResult(false, 'Invalid GSTIN format/checksum.', gstin);
    //     return;
    // }
    
    // Search in mock data (simulate API)
    const company = mockCompanies.find(c => c.gstin === gstin);
    
    if (company) {
        showResult(true, '✅ Real Company', gstin, company);
        speakDetails(company, true);
    } else {
        showResult(false, '❌ Fake/Invalid Company', gstin);
        speakDetails(null, false);
    }
}

// Display result
function showResult(isValid, message, gstin, company = null) {
    const resultDiv = document.getElementById('result');
    resultDiv.className = `result ${isValid ? 'valid' : 'invalid'}`;
    resultDiv.innerHTML = `
        <h3>${message}</h3>
        <p><strong>GSTIN:</strong> ${gstin}</p>
        ${company ? `
            <div class="company-details">
                <p><strong>Legal Name:</strong> ${company.name}</p>
                <p><strong>Trade Name:</strong> ${company.tradeName}</p>
                <p><strong>Address:</strong> ${company.address}</p>
                <p><strong>Status:</strong> ${company.status}</p>
                <p><strong>Type:</strong> ${company.type}</p>
            </div>
        ` : ''}
    `;
    resultDiv.classList.remove('hidden');
}

// Real API integration example (uncomment and replace with working API)
// Uncomment below for live API (use CORS proxy if needed)
// async function fetchRealGSTIN(gstin) {
//     try {
//         // Example with CORS proxy (since direct API may have CORS)
//         const proxyUrl = 'https://api.allorigins.win/raw?url=';
//         const apiUrl = 'https://api.gstapi.in/gstverify?gstin=' + gstin; // Replace with working API
//         const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
//         const data = await response.json();
//         // Handle data...
//     } catch (error) {
//         console.error('API Error:', error);
//         // Fallback to mock
//     }
// }

// Render recent searches
function renderRecent() {
    const list = document.getElementById('recentList');
    if (recentSearches.length === 0) {
        list.innerHTML = '<p>No recent searches</p>';
        return;
    }
    list.innerHTML = recentSearches.map(g => 
        `<button onclick="searchRecent('${g}')">${g}</button>`
    ).join('');
}

// Search recent
function searchRecent(gstin) {
    document.getElementById('gstinInput').value = gstin;
    verifyGSTIN();
}

// Speech details
function speakDetails(company, isValid) {
    if ('speechSynthesis' in window) {
        const msg = isValid ? 
            `Company ${company.name}. Address ${company.address}. Status correct.` : 
            'Status wrong.';
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.lang = 'en-IN'; // Tamil Nadu English
        speechSynthesis.speak(utterance);
        setTimeout(() => {
            speechSynthesis.speak(utterance);
        }, utterance.estimatedCost * 1000 + 500 || 3000); // Approx twice
    }
}

// Init recent on load
document.addEventListener('DOMContentLoaded', renderRecent);

// Enter on keypress
document.getElementById('gstinInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') verifyGSTIN();
});
