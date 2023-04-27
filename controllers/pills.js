const Pills = require('../models/Pills')

module.exports ={
    getPills: async(req,res) => {
        try {
            const pills = await Pills.find()
            res.render('pills.ejs', {pills: pills})
        } catch (err) {
            console.log(err)
        }
    },
    createPill: async (req, res)=>{
   
                try{
                    const pills = await Pill.create({pill: req.body.pills, completed: false})
                    console.log('Todo has been added!')
                    res.redirect('/pills')
                }catch(err){
                    console.log(err)
                }
            },
    getForm: async(req,res) =>{
        res.render('form.ejs')
    }
}