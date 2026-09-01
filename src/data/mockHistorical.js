const generateData = (multiplier) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => {
    // Generate seasonal curves
    const rainCurve = Math.max(0, Math.sin((i / 11) * Math.PI) * 200 + 20); // Rain peaks in summer
    const tempCurve = Math.sin(((i - 4) / 11) * Math.PI) * 12 + 26; // Temp peaks around Jun/Jul
    
    // Historical Averages
    const rainHist = Math.round(rainCurve * multiplier);
    const tempHist = Math.round(tempCurve);
    const humHist = Math.round(65 + Math.sin((i / 11) * Math.PI) * 15);
    const daysHist = Math.round((rainHist / 250) * 18);
    const extremeHist = Math.random() > 0.8 ? Math.floor(Math.random() * 2) + 1 : 0;

    // Current Forecast (add some variance)
    const rainCur = Math.round(rainHist * (0.8 + Math.random() * 0.5));
    const tempCur = Math.round(tempHist + (Math.random() * 4 - 1)); // Slightly hotter trend
    const humCur = Math.round(humHist + (Math.random() * 10 - 5));
    const daysCur = Math.round((rainCur / 250) * 18);
    const extremeCur = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;

    return {
      month,
      rainHist, rainCur,
      tempHist, tempCur,
      humHist, humCur,
      daysHist, daysCur,
      extremeHist, extremeCur
    }
  });
}

export const mockHistoricalData = {
  '1 Year': generateData(1),
  '5 Years': generateData(0.92),
  '10 Years': generateData(0.85) // older average was slightly less rain in this mock scenario
}
