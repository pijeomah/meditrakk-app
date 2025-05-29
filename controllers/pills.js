const Pills = require('../models/Pills')
// importing the  pills model into the pills controller 
module.exports ={
    getDashboard: async (req, res) => {
        try {
            //const userId = req.user._id 
            const pills = await Pills.find({ user: req.user.id });

            if (pills.length === 0) {
             return res.render('dashboard.ejs', {
                pills: [],
                user: req.user,
                message:'No pills found. Add your medication'
             })   
            } else {
               res.render('dashboard.ejs', {pills: pills, user: req.user})
            }
        } catch (err) {
            console.error('Error fetching pills');
            res.status(500).render('error/500'); // Render 500 error page
        }
        // try catch block is used here to get the pills that matches the users id we
        // if there are no pillz then then the response returns a 404 status and a renders an error page
        // if there are pillz that matches the users id then the pills ejs page is rendered and the pills data is sent to the view as well as the user information 
    },
     
     createPill: async (req, res) => {
        try {
            const requiredFields = ['name', 'dosage', 'frequency', 'total', 'ailment']
            const missingFields = requiredFields.filter(field => 
      !req.body[field] || req.body[field].toString().trim() === ''
    );
    if (missingFields.length > 0) {
      req.flash('errors', { msg: `Missing required fields: ${missingFields.join(', ')}` });
      return res.redirect('/pills/form');
    }

         // Parse and validate numeric fields
        const frequency = parseInt(req.body.frequency);
        const number = parseInt(req.body.number) || 1;
        const total = parseInt(req.body.total);

        const validationErrors = [];

        if (isNaN(frequency) || frequency < 1 || frequency > 10) {
        validationErrors.push('Frequency must be a number between 1 and 10 times per day');
        }

        if (isNaN(total) || total < 1) {
        validationErrors.push('Total pills must be a positive number');
        }

        if (isNaN(number) || number < 1) {
        validationErrors.push('Number of pills per dose must be a positive number');
        }

        // Validate that number doesn't exceed total
        if (!isNaN(number) && !isNaN(total) && number > total) {
        validationErrors.push('Pills per dose cannot exceed total pills available');
        }

        // Validate date fields if provided
        if (req.body.start && isNaN(Date.parse(req.body.start))) {
        validationErrors.push('Invalid start date format');
        }

        if (req.body.end && isNaN(Date.parse(req.body.end))) {
        validationErrors.push('Invalid end date format');
        }

        if (req.body.start && req.body.end) {
      const startDate = new Date(req.body.start);
      const endDate = new Date(req.body.end);
      if (endDate <= startDate) {
        validationErrors.push('End date must be after start date');
      }
    }

    // If there are validation errors, flash them and redirect
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        req.flash('errors', { msg: error });
      });
      return res.redirect('/pills/form');
    }

     // Sanitize string inputs
    const sanitizedName = req.body.name.trim();
    const sanitizedDosage = req.body.dosage.trim();
    const sanitizedAilment = req.body.ailment.trim();

    // Additional business logic validation
    if (sanitizedName.length > 100) {
      req.flash('errors', { msg: 'Medication name must be less than 100 characters' });
      return res.redirect('/pills/form');
    }

    if (sanitizedDosage.length > 50) {
      req.flash('errors', { msg: 'Dosage must be less than 50 characters' });
      return res.redirect('/pills/form');
    }

    if (sanitizedAilment.length > 200) {
      req.flash('errors', { msg: 'Ailment description must be less than 200 characters' });
      return res.redirect('/pills/form');
    }

        const pillData = {
        name: sanitizedName,
        dosage: sanitizedDosage,
        frequency: frequency,
        number: number,
        start: req.body.start || new Date(),
        end: req.body.end,
        ailment: sanitizedAilment,
        total: total,
        user: req.user.id
      };

      const pill = await Pills.create(pillData);
    
    console.log('New pill created:', pill.name);
        req.flash('success', { msg: 'Medication added successfully!' });
        res.redirect('pills/dashboard');
        } catch (error) {
        console.error('Error creating pill:', error);
        req.flash('errors', { msg: 'Failed to add medication. Please try again.' });
        res.redirect('/pills/form');
        }
    },
      

    getForm: async (req, res) => {
        try {
            res.render('form.ejs');
        } catch (error) {
            console.error('Error loading form',error);
            // You can render an error page or send an error response
            res.status(500).render('errors/500');
        }
        // trycatch block for rendering the form ejs file and catching any errors 
    },

    viewPillInfo: async(req, res) => {
        try {
            const pill = await Pills.findOne({
            _id: req.params.id,
            user: req.user.id // Security: ensure user owns this pill
        }).lean();
      
      if (!pill) {
        req.flash('errors', { msg: 'Medication not found or access denied.' });
        return res.redirect('pills/dashboard');
        } 
        res.render('view.ejs', { pills: pill });
    }
        catch (err) {
      console.error('Error viewing pill:', err);
      res.status(500).render('error/500');
    }
  
    },

    updatePill: async (req, res) => {
        try {
            const pill = await Pills.findOne({
        _id: req.params.id,
        user: req.user.id // Security check
      });

      if (!pill) {
        req.flash('errors', { msg: 'Medication not found or access denied.' });
        return res.redirect('/pills');
      }

      if (pill.total < pill.number) {
        req.flash('errors', { msg: 'Insufficient pills available.' });
        return res.redirect('/pills');
      }

      await Pills.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $inc: { total: -pill.number } }
      );

      req.flash('success', { msg: `Took ${pill.number} pill(s) of ${pill.name}` });
      res.redirect('pills/dashboard');
    }
         catch (err) {
            console.error('Error updating pill:', err);
        req.flash('errors', { msg: 'Failed to update medication.' });
        res.redirect('pills/dashboard');
        }
        // catch all errors and log them in the console for debugging
    },

    deletePills: async (req, res) => {
        try {
           const pill = await Pills.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id // Security check
      });

      if (!pill) {
        req.flash('errors', { msg: 'Medication not found or access denied.' });
        return res.redirect('pills/dashboard');
      }

      console.log('Pill deleted:', pill.name);
      req.flash('success', { msg: `${pill.name} deleted successfully` });
      res.redirect('/dashboard');
    
        } catch (err) {
             console.error('Error deleting pill:', err);
            req.flash('errors', { msg: 'Failed to delete medication.' });
            res.redirect('pills/dashboard');
        }
        // catch all the errorsin the catch block
    },

    editPill: async(req,res)=>{
        try {
            const pill = await Pills.findOne({
                _id: req.params.id
            }).lean()
            // finding the pill that matches the id in the URL and use lean to convert it to plain JS
            if(!pill){
                req.flash('errors', { msg: 'Medication not found or access denied.' });
                return res.redirect('/dasboard');
            }
            res.render('edit.ejs', { pill: pill });
            // if the pill is found then we render the edit  page and the pill object 
        } catch (err) {
            console.error('Error loading edit form:', err);
            res.status(500).render('error/500');
        }
},

upgradePill: async(req,res)=>{
        try {
           // Input validation
      const updateData = {};
      if (req.body.name) updateData.name = req.body.name.trim();
      if (req.body.dosage) updateData.dosage = req.body.dosage.trim();
      if (req.body.frequency) {
        const frequency = parseInt(req.body.frequency);
        if (frequency >= 1 && frequency <= 10) {
          updateData.frequency = frequency;
        }
      }
      if (req.body.total) {
        const total = parseInt(req.body.total);
        if (total >= 0) {
          updateData.total = total;
        }
      }
      if (req.body.ailment) updateData.ailment = req.body.ailment.trim();
      if (req.body.start) updateData.start = req.body.start;
      if (req.body.end) updateData.end = req.body.end;

      const pill = await Pills.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!pill) {
        req.flash('errors', { msg: 'Medication not found or access denied.' });
        return res.redirect('pills/dashboard');
      }

      req.flash('success', { msg: `${pill.name} updated successfully!` });
      res.redirect('pills/dashboard')
        }
           catch (err) {
           console.error('Error updating pill:', err);
            req.flash('errors', { msg: 'Failed to update medication.' });
            res.redirect('pills/dashboard');
        }
        // catch block captures the errors
        
}
}