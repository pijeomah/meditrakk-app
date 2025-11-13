const Dose = require('../models/Doses')


module.exports = {
    renderDashboard: async(req,res)=> {
        try {
           const userId = req.user.id
           const adherenceData = await Dose.aggregate([
            { $match: {user : userId} },
            {
                $group: {
                    _id: {$dateToString: {format: '%Y-%m-%d', date: '$scheduledDate'}},
                    total: {$sum: 1},
                    taken:{
                        $sum: {
                            $cond: [{$eq: ['$status','taken']}, 1 ,0]
                        }
                    }
                }
            }

           ])
           console.log('Aggregation result:', adherenceData);
           res.render('dash.ejs', { adherenceData }) 
        } catch (error) {
            console.error('Error rendering dashboard')
            req.flash('errors', { msg: 'Failed to render dashboard. Please try again.' });
            res.redirect('/pills');
        }
    },
//      getDash: async (req, res) => {
//          try {
//          res.render('dash.ejs');
//      } catch (error) {
//          console.error('Error loading form',error);
//     //     You can render an error page or send an error response
//          res.status(500).render('errors/500');
//      }
//     // trycatch block for rendering the form ejs file and catching any errors 
// }
    
}