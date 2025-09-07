import db from "../../middlewares/db.js"
import express from "express"

const router = express.Router()

//url: https://manfess-backend.onrender.com/api/notifications
router.get("/", async (req, res)=>{
    try{
        db.query("SELECT * FROM notifications ", (err, results)=>{
            if(err){
                console.log(err)
                return res.status(500).json({error: "Database query error"})
            }
            res.status(200).json(results)
        })

    }
    catch(error){
        console.log(error)
    }
})

//url: https://manfess-backend.onrender.com/api/notifications/add
router.post("/add", async (req, res)=>{
    try{
        const { message } = req.body;
        db.query("INSERT INTO notifications ( message) VALUES (?, ?)", [message], (err, results)=>{
            if(err){
                console.log(err)
                return res.status(500).json({error: "Database query error"})
            }
            res.status(201).json({id: results.insertId, title, message})
        })

    }
    catch(error){
        console.log(error)
    }
})

export default router