document.getElementById('recurrence-form').addEventListener('submit', function(event) { 
    event.preventDefault();
    
    const tumorVolume = parseFloat(document.getElementById('tumorVolume').value);
    const spineLevel = document.getElementById('spineLevel').value;
    const neoadjuvantRadiotherapy = document.getElementById('neoadjuvantRadiotherapy').value;
    const charlsonComorbidityScore = document.getElementById('charlsonComorbidityScore').value;
    const race = document.getElementById('race').value;
    const daysFromDxToSurgery = parseFloat(document.getElementById('daysFromDxToSurgery').value);
    
    const probabilityLOS = calculateProlongedLOSProbability(tumorVolume, spineLevel, neoadjuvantRadiotherapy, charlsonComorbidityScore, daysFromDxToSurgery);
    const probabilityReadmission = calculateReadmissionProbability(charlsonComorbidityScore, race, daysFromDxToSurgery);
    
    document.getElementById('result').innerText = `The probability of prolonged length of hospital stay is: ${(probabilityLOS * 100).toFixed(2)}%\n` + 
                                                    `The probability of 30-day readmission is: ${(probabilityReadmission * 100).toFixed(2)}%`;
});

function calculateProlongedLOSProbability(tumorVolume, spineLevel, neoadjuvantRadiotherapy, charlsonComorbidityScore, daysFromDxToSurgery) {
    const beta_spine_level = Math.log(4.594);
    const beta_neoadjuvant_radiotherapy = Math.log(0.107);
    const beta_tumor_volume = 0.001;
    const beta_charlson_comorbidity_score_1 = Math.log(1.02); // Charlson Score 1
    const beta_charlson_comorbidity_score_2plus = Math.log(3.03); // Charlson Score 2+
    const beta_daysFromDxToSurgery = 0.01;  // Coefficient for days from diagnosis to surgery
    
    const beta_0 = 0;

    spineLevel = spineLevel === 'Mobile' ? 1 : 0;
    neoadjuvantRadiotherapy = neoadjuvantRadiotherapy === 'Yes' ? 1 : 0;
    charlsonComorbidityScore = charlsonComorbidityScore === '1' ? 1 : (charlsonComorbidityScore === '2+' ? 2 : 0);
    
    const logit_p = beta_0 + 
                    beta_tumor_volume * tumorVolume + 
                    beta_spine_level * spineLevel + 
                    beta_neoadjuvant_radiotherapy * neoadjuvantRadiotherapy + 
                    (charlsonComorbidityScore === 1 ? beta_charlson_comorbidity_score_1 : 
                     charlsonComorbidityScore === 2 ? beta_charlson_comorbidity_score_2plus : 0) + 
                    beta_daysFromDxToSurgery * daysFromDxToSurgery;
    
    const p = 1 / (1 + Math.exp(-logit_p));
    
    return p;
}

function calculateReadmissionProbability(charlsonComorbidityScore, race, daysFromDxToSurgery) {
    const beta_charlson_comorbidity_score_1 = Math.log(1.02); // Charlson Score 1
    const beta_charlson_comorbidity_score_2plus = Math.log(3.03); // Charlson Score 2+
    const beta_race_black = Math.log(3.92);    // Coefficient for Black race
    const beta_daysFromDxToSurgery = 0.01;    // Coefficient for days from diagnosis to surgery
    
    const beta_0 = 0;

    charlsonComorbidityScore = charlsonComorbidityScore === '1' ? 1 : (charlsonComorbidityScore === '2+' ? 2 : 0);
    race = race === 'Black' ? 1 : 0;
    
    const logit_p = beta_0 + 
                    (charlsonComorbidityScore === 1 ? beta_charlson_comorbidity_score_1 : 
                     charlsonComorbidityScore === 2 ? beta_charlson_comorbidity_score_2plus : 0) + 
                    beta_race_black * race + 
                    beta_daysFromDxToSurgery * daysFromDxToSurgery;
    
    const p = 1 / (1 + Math.exp(-logit_p));
    
    return p;
}

