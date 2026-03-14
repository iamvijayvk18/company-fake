<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fake Company Detection - Tamil Nadu GSTIN Verifier</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🕵️ Fake Company Detection</h1>
        <p>Enter Tamil Nadu GSTIN (starts with 33) to check if it's real or fake.</p>
        
        <div class="form-group">
            <input type="text" id="gstinInput" placeholder="e.g., 33AAACS6149G1Z5" maxlength="15">
            <button onclick="verifyGSTIN()">Verify GSTIN</button>
        </div>
        
        <div id="result" class="result hidden"></div>
        
        <div id="recentSearches" class="recent-list">
            <h3>Recent Searches (Last 5):</h3>
            <div id="recentList"></div>
        </div>
        
        <div class="samples">
            <h3>Sample TN GSTINs:</h3>
            <ul>
                <li>33AAACS6149G1Z5 (Zoho)</li>
                <li>33AAACB2404R1ZI (TVS)</li>
            </ul>
        </div>
        
        <footer>
            <p>Note: Demo with mock data. For production, integrate official GST API with CORS proxy.</p>
        </footer>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
