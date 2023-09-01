const Pills = require('../models/Pills')

module.exports ={
    getPills: async (req, res) => {
        try {
            //const userId = req.user._id 
            const pills = await Pills.find({ user: req.user.id });
    
            if (!pills) {
                res.status(404).render(error404Page); // Render 404 error page
            } else {
                res.render('pills.ejs', { pills: pills, user: req.user });
            }
        } catch (err) {
            console.error(err);
            res.status(500).render('error/500'); // Render 500 error page
        }
    },
     
     createPill: async (req, res) => {
        try {
            const pillName = req.body.name;
            const pillDosage = req.body.dosage;
            const pillFrequency = req.body.frequency;
            const pillNumber = req.body.number;
            const pillStart = req.body.start;
            const pillEnd = req.body.end;
            const pillTotal = req.body.total;
            const pillUser = req.user.id;
            const ailment = req.body.ailment;
    
            const pills = await Pills.create({
                name: pillName,
                dosage: pillDosage,
                frequency: pillFrequency,
                number: pillNumber,
                start: pillStart,
                end: pillEnd,
                ailment: ailment,
                total: pillTotal,
                user: pillUser
            });
    
            console.log(pills);
            res.redirect('/pills');
        } catch (error) {
            console.error(error);
            res.status(500).render('error/500'); // Render 500 error page
        }
    },

    getForm: async (req, res) => {
        try {
            res.render('form.ejs');
        } catch (error) {
            console.error(error);
            // You can render an error page or send an error response
            res.status(500).render('errors/500');
        }
    },

    viewPillInfo: async(req, res) => {
        try {
            let pills = await Pills.findById(req.params.id).lean()
            if (!pills) {
                return res.render("Nothing to see here")
            } else {
                return res.render('view.ejs', { pills: pills })
            }
        } catch (err) {
            console.error(err);
            res.status(500).render('errors/500');
        }
    },

    updatePill: async (req, res) => {
        try {
            const pill = await Pills.findById(req.params.id);
    
            if (!pill) {
                return res.status(404).render('error/404'); // Render a 404 error page
            }
    
            if (pill.total < pill.number) {
                return res.status(400).render('error/404', { message: "Insufficient pills available." }); // Render a custom 400 error page
            }
    
            await Pills.findOneAndUpdate(
                { _id: req.params.id },
                { $inc: { total: -pill.number } }
            );
    
            res.redirect('/pills');
        } catch (err) {
            console.error('Error updating pill:', err);
            res.status(500).render('error/500'); // Render a 500 error page
        }
    },

    deletePills: async (req, res) => {
        try {
            const pill = await Pills.findByIdAndDelete(req.params.id);
    
            if (!pill) {
                return res.status(404).render('404.ejs'); // Render a 404 error page
            }
    
            console.log('Pill Deleted');
            res.redirect('/pills');
        } catch (err) {
            console.error('Error deleting pill:', err);
            res.status(500).render('500.ejs'); // Render a 500 error page
        }
    },

    editPill: async(req,res)=>{
        try {
            const pill = await Pills.findOne({
                _id: req.params.id
            }).lean()
            if(!pill){
                return res.render(`You can't touch this pill`)
            }else{
                return res.render('edit.ejs',  { pill: pill })
            }
        } catch (err) {
            console.log(err)
        }
},

upgradePill: async(req,res)=>{
        try {
            let pill = await Pills.findById(req.params.id).lean()

            
        if(!pill) {
            return res.render('error/404')
        }
            else{
                pill= await Pills.findOneAndUpdate({_id: req.params.id},  req.body, {
                    new: true,
                    runValidators: true
                })
                res.redirect('/pills')
            }
            

        } catch (err) {
            console.log(err)
        }
}
}