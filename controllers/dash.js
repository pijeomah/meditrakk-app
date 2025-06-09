const Dose = require('../models/Doses')


module.exports = {
    renderDashboard: async(req,res)=> {
        try {
           const userId = req.user.id
           const adherenceData = await Doses.aggregate([
            { $match: {user : userId} },
            {
                $group: {
                    _id: {$dateToString: {format: '%Y-%m-%d', date: '$scheduledDate'}},
                    total: {sum: 1},
                    taken:{
                        $sum: {
                            $cond: [{$eq: ['status','taken']}, 1 ,0]
                        }
                    }
                }
            }

           ])
           res.render('dashboard.ejs', { adherenceData }) 
        } catch (error) {
            console.error('Error rendering dashboard')
            req.flash('errors', { msg: 'Failed to render dashboard. Please try again.' });
            res.redirect('/pills');
        }
    }
}