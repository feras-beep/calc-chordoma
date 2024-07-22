document.getElementById('recurrence-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const tumorVolume = parseFloat(document.getElementById('tumorVolume').value);
    const spineLevel = document.getElementById('spineLevel').value;
    const neoadjuvantRadiotherapy = document.getElementById('neoadjuvantRadiotherapy').value;
    const gender = document.getElementById('gender').value;
    
    const probability = calculateProbability(tumorVolume, spineLevel, neoadjuvantRadiotherapy, gender);
    
    document.getElementById('result').innerText = `The probability of recurrence is: ${(probability * 100).toFixed(2)}%`;
});

function calculateProbability(tumorVolume, spineLevel, neoadjuvantRadiotherapy, gender) {
    const HR_tumor_volume = 5.89;
    const HR_spine_level = 7.73;
    const HR_neoadjuvant_radiotherapy = 0.09;
    const HR_gender = 2.23;

    const beta_tumor_volume = Math.log(HR_tumor_volume);
    const beta_spine_level = Math.log(HR_spine_level);
    const beta_neoadjuvant_radiotherapy = Math.log(HR_neoadjuvant_radiotherapy);
    const beta_gender = Math.log(HR_gender);

    const beta_0 = 0;  // Adjust this value based on statistical data or assumptions

    tumorVolume = tumorVolume >= 100 ? 1 : 0;
    spineLevel = spineLevel === 'Mobile' ? 1 : 0;
    neoadjuvantRadiotherapy = neoadjuvantRadiotherapy === 'Yes' ? 1 : 0;
    gender = gender === 'Female' ? 1 : 0;
    
    const logit_p = beta_0 + 
                    beta_tumor_volume * tumorVolume + 
                    beta_spine_level * spineLevel + 
                    beta_neoadjuvant_radiotherapy * neoadjuvantRadiotherapy + 
                    beta_gender * gender;
    
    const p = 1 / (1 + Math.exp(-logit_p));
    
    return p;
}
