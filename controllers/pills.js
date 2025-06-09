const Pills = require('../models/Pills')
const Dose = require('../models/Doses')
const { validatePillInput } = require('../utils/validateHelpers')
const { generateScheduledDoses } = require('../utils/scheduleHelper')
// importing the  pills model into the pills controller 
module.exports ={
    getPills: async (req, res) => {
        try {
            //const userId = req.user._id 
           
            const pills = await Pills.find({ user: req.user.id });
            console.log('Pills from DB:', pills.map(p => p.name));

            if (pills.length === 0) {
             return res.render('pills.ejs', {
                pills: [],
                user: req.user,
                message:'No pills found. Add your medication'
             })   
            } else {
               res.render('pills.ejs', {pills: pills, user: req.user})
            }
        } catch (err) {
            console.error('Error fetching pills');
            res.status(500).render('error/500'); // Render 500 error page
        }
  
    },
     
     createPill: async (req, res) => {
        try {
           console.log('Request body:', req.body)
        // const { errors, cleaned } =  validatePillInput(req.body)
        // if(errors.length > 0){
        //   errors.forEach(err => req.flash('errors', {msg: err}))
        // }
       const {
        name,
        dosage,
        ailment,
        frequency,
        number,
        total,
        start,
        
       } = req.body

       const user = req.user._id
        const pill = await Pills.create({
          name,
          dosage,
          ailment,
          frequency : Number(frequency),
          number: Number(number),
          total: Number(total),
          start,
          user
        })
        const doses = generateScheduledDoses({
          frequency,
          number,
          total,
          start,
          user,
          pill: pill._id
        })
        
        await Dose.insertMany(doses)
    
    console.log('New pill created:',name);
        req.flash('success', { msg: 'Medication added successfully!' });
        res.redirect('/pills');
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
        return res.redirect('/pills');
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
          console.log('req.user:', req.user)
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
      const nextDose = await Dose.findOneAndUpdate(
        {
              pill: pill._id,
              user: req.user.id,
              status: 'pending',
              scheduledDate: {$lte: new Date()}
        },
        {
          status: 'taken',
          takenAt: new Date ()
        },
        
          {sort: { scheduledDate: 1}, new: true}
    )

    if (!nextDose) {
      req.flash('info', {
        msg: `Pill count updated, but no due/pending dose was found to mark as taken.`
      });
    } else {
      req.flash('success', {
        msg: `Took ${pill.number} pill(s) of ${pill.name} and marked dose as taken.`
      });
    }

 }
         catch (err) {
            console.error('Error updating pill:', err);
        req.flash('errors', { msg: 'Failed to update medication.' });
        res.redirect('/pills');
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
        return res.redirect('/pills');
      }

      console.log('Pill deleted:', pill.name);
      req.flash('success', { msg: `${pill.name} deleted successfully` });
      res.redirect('/pills');
    
        } catch (err) {
             console.error('Error deleting pill:', err);
            req.flash('errors', { msg: 'Failed to delete medication.' });
            res.redirect('/pills');
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
        return res.redirect('/pills');
      }

      req.flash('success', { msg: `${pill.name} updated successfully!` });
      res.redirect('/pills')
        }
           catch (err) {
           console.error('Error updating pill:', err);
            req.flash('errors', { msg: 'Failed to update medication.' });
            res.redirect('/pills');
        }
        // catch block captures the errors
        
}
}