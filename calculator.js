document.getElementById('recurrence-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const tumorVolume = parseFloat(document.getElementById('tumorVolume').value);
    const spineLevel = document.getElementById('spineLevel').value;
    const neoadjuvantRadiotherapy = document.getElementById('neoadjuvantRadiotherapy').value;
    
    const probability = calculateProbability(tumorVolume, spineLevel, neoadjuvantRadiotherapy);
    
    document.getElementById('result').innerText = `The probability of recurrence is: ${(probability * 100).toFixed(2)}%`;
});

function calculateProbability(tumorVolume, spineLevel, neoadjuvantRadiotherapy) {
    const beta_spine_level = Math.log(4.594);  // Log of odds ratio for Mobile spine
    const beta_neoadjuvant_radiotherapy = Math.log(0.107);  // Log of odds ratio for Pre-Op XRT
    const beta_tumor_volume = 0.001;  // Coefficient for tumor volume

    const beta_0 = 0;  // Assuming intercept is 0, adjust based on your model

    spineLevel = spineLevel === 'Mobile' ? 1 : 0;
    neoadjuvantRadiotherapy = neoadjuvantRadiotherapy === 'Yes' ? 1 : 0;
    
    const logit_p = beta_0 + 
                    beta_tumor_volume * tumorVolume + 
                    beta_spine_level * spineLevel + 
                    beta_neoadjuvant_radiotherapy * neoadjuvantRadiotherapy;
    
    const p = 1 / (1 + Math.exp(-logit_p));
    
    return p;
}

