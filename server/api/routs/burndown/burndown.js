



const Burndown = require('./burndownModel')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')


// First route, get all visiting
/**Da chiamare
 * http://localhost:3000/burndowns/
 * 
 */
// First route, get all Menu
router.get('/', (req, res, next) => {

    Burndown.find()
        .sort({ createdAt: 1 })
        .exec().
        then(doc => {

            if (doc.length) {
                console.log(doc)
                res.status(200).json({
                    message: doc
                })
            }
            else
                res.status(200).json({
                    message: false
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'err:: ' + err })
        })
})



// 
/**
 * http://localhost:3000/board/getBoard/33453
 */
router.get('/getOneBurndown/:sprint', (req, res, next) => {

    // const storyPoint_ = req.body.storyPoint;
    const sprint_ = req.params.sprint;
    const giorni_ = req.body.giorni;


    Burndown.find({ sprint: sprint_ })
        .sort({ createdAt: 1 })
        .exec().
        then(doc => {
            if (doc.length) {
                var resultAsArray = []

                doc.forEach(x => {
                    resultAsArray.push(x.storyPointTot)
                })


                res.status(200)
                    .json({ message: resultAsArray });
            }
            else
                res.status(200)
                    .json({ message: false });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})




/**
 *  POST REQUEST Inserisce un burndown solo se non esiste. 
 * // Da chimare  
{
    "sprint": "Sprint 14",
    "giorno" : "15",
    "storyPointTot": 0,25
}

 */
router.post('/insert', (req, res, next) => {

    const storyPoint_ = req.body.storyPoint;
    const sprint_ = req.body.sprint;
    const giorni_ = req.body.giorni;

    // console.log(req.body)
    Burndown.find({ sprint: sprint_, giorni: giorni_ }, function (err, docs) {

        console.log("dentro 44454545:   " + sprint_)

        // Se esiste già
        if (docs.length) {
            Burndown.updateOne(
                { sprint: sprint_, giorni: giorni_ },
                { $inc: { storyPointTot: storyPoint_ } }          
            ).exec()
                .then(result => {
                    if (result.nModified != 0)
                        res.status(200)
                            .json({ message: true });
                    else
                        res.status(200)
                            .json({ message: false });
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                });

        } else {
            // Lo creo nuovo
            const burndown = new Burndown({
                _id: new mongoose.Types.ObjectId(),
                sprint: sprint_,
                giorni: giorni_,
                storyPointTot: storyPoint_,
                time: Date.now
            });

            console.log("Nuovo : " + burndown)
            // Lo salvo
            burndown.save()
                .then(result => {
                    console.log(result)

                    if (result._id)
                        res.status(200)
                            .json({ message: true });
                    else
                        res.status(200)
                            .json({ message: false });

                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                });

        }
    });

})













module.exports = router;