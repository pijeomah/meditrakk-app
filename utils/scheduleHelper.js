function generateScheduledDoses({ frequency, number, total, start, end, user, pill }){
    const doses = []
    const totalDoses = Math.ceil(total/number)
    const dosesPerDay = frequency
    const totalDays = Math.ceil(totalDoses/dosesPerDay)
    const doseHours = getDoseTimes(frequency)


    // loop to
    let doseCount = 0
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : null

    for(let day =0; day < totalDays && doseCount < totalDoses; day++ ){
        for(let doseIndex = 0; doseIndex < dosesPerDay && doseCount < totalDoses; doseIndex++){
            const scheduledDate = new Date(startDate)
            scheduledDate.setDate(startDate.getDate() + day )
            scheduledDate.setHours(doseHours[doseIndex], 0, 0, 0)

            if(endDate && scheduledDate > endDate){
                break
            }
            doses.push({
        pill,
        user,
        scheduledDate,
        status: scheduledDate <= new Date() ? 'missed' : 'pending',
        takenAt: scheduledDate <= new Date() ? scheduledDate : undefined
      });
      doseCount++
        }
    }
return doses
}


function getDoseTimes(frequency) {
  const commonSchedules = {
    1: [8],
    2: [8, 20],
    3: [8, 14, 20],
    4: [8, 12, 16, 20],
    5: [7, 11, 15, 19, 23],
    6: [7, 11, 15, 19, 23, 3]
  };

  if (commonSchedules[frequency]) {
    return commonSchedules[frequency];
  }

  // Fallback for frequencies > 6
  const hours = [];
  const interval = 24 / frequency;

  for (let i = 0; i < frequency; i++) {
    hours.push(Math.round(8 + (i * interval)) % 24);
  }

  return hours.sort((a, b) => a - b);
}

module.exports = { generateScheduledDoses }