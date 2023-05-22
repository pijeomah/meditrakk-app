const Pills = require('../models/Pills')

module.exports ={
    getPills: async(req,res) => {
        try {
            const pills = await Pills.find({userId: req.user.id})
            res.render('pills.ejs', {pills: pills, user:req.user.id})
        } catch (err) {
            console.log(err)
        }
    },
    createPill: async (req, res)=>{
        console.log(req)
                try{
                    const pillName =  req.body.name
                    const pillDosage =req.body.dosage
                    const pillFrequency = req.body.frequency
                    const pillNumber = req.body.number
                    const pillStart = req.body.start
                    const pillEnd = req.body.end
                    const pillTotal = req.body.total
                    const ailment = req.body.ailment
                    const pills = await Pills.create(
                        {name:pillName, 
                        dosage: pillDosage,
                        frequency: pillFrequency,
                        number: pillNumber,
                        start: pillStart,
                        end: pillEnd,
                        ailment: ailment,
                        total: pillTotal
                        })
                    console.log()
                    res.redirect('/pills')
                }catch(err){
                    console.log(err)
                }
            },
    addPill: async(req,res) =>{
        res.render('form.ejs')
    },

    showPillInfo: async(req,res)=>{
        try {
            let pills = await Pills.findById(req.params.id).lean()
            if(!pills){
                return res.render("Nothing to see here")
            }else{
                return res.render('show.ejs', {pills: pills})
            }
            
        } catch (err) {
            console.log(err)
        }

    },

    updatePill: async(req,res)=>{
        try {
           
            await Pills.findOneAndUpdate(
                {_id: req.params.id},
                {$inc: {total: -1},
            }
            )
            res.redirect(`/pills`)
        } catch (err) {
            console.log(err)
        }
    },
    deletePills: async(req,res)=>{
        try {
            await Pills.findByIdAndDelete({ _id: req.params.id },
                console.log('Pill Deleted')
                );
            res.redirect('/pills')
        } catch (err) {
            console.log(err)
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