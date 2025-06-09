function validatePillInput(body){
     const errors = [];
  const requiredFields = ['name', 'dosage', 'frequency', 'total', 'ailment'];
  const missingFields = requiredFields.filter(
    field => !body[field] || body[field].toString().trim() === ''
  );
  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  const frequency = parseInt(body.frequency);
  const number = parseInt(body.number) || 1;
  const total = parseInt(body.total);

  if (isNaN(frequency) || frequency < 1 || frequency > 10) {
    errors.push('Frequency must be a number between 1 and 10 times per day');
  }

  if (isNaN(total) || total < 1) {
    errors.push('Total pills must be a positive number');
  }

  if (isNaN(number) || number < 1) {
    errors.push('Number of pills per dose must be a positive number');
  }

  if (!isNaN(number) && !isNaN(total) && number > total) {
    errors.push('Pills per dose cannot exceed total pills available');
  }

  if (body.start && isNaN(Date.parse(body.start))) {
    errors.push('Invalid start date format');
  }

  if (body.end && isNaN(Date.parse(body.end))) {
    errors.push('Invalid end date format');
  }

  if (body.start && body.end) {
    const startDate = new Date(body.start);
    const endDate = new Date(body.end);
    if (endDate <= startDate) {
      errors.push('End date must be after start date');
    }
  }

  // Sanitize string inputs
    // const sanitizedName = req.body.name.trim();
    // const sanitizedDosage = req.body.dosage.trim();
    // const sanitizedAilment = req.body.ailment.trim();

    // // Additional business logic validation
    // if (sanitizedName.length > 100) {
    //  error.push('Medication name must be less than 100 characters')
    // }

    // if (sanitizedDosage.length > 50) {
    //   error.push('Dosage must be less than 50 characters')
    // }

    // if (sanitizedAilment.length > 200) {
    //   error.push('Ailment description must be less than 200 characters')
    // }


  return {
    errors,
    cleaned: {
      frequency,
      number,
      total,
      name:body.name.trim(),
      dosage: body.dosage.trim(),
      ailment: body.ailment.trim(),
      start: body.start ? new Date(body.start) : new Date(),
      end: body.end ? new Date(body.end) : null,
    }
  };
}
module.exports = { validatePillInput }