import e from "express";
import db from "../../../middlewares/db.js";
const router = e.Router();

// url: https://manfess-backend.onrender.com/api/students/alevel
router.get("/", (req, res) => {
  const q = "SELECT DISTINCT localid, id, FirstName, LastName, level, Department FROM studentsalevel where level= 'uppersixth";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});


// url: https://manfess-backend.onrender.com/api/students/alevel/all

router.get("/all", (req, res) => {
  const q = "SELECT DISTINCT level FROM studentsalevel";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});










//url: https://manfess-backend.onrender.com/api/students/alevel/subjects
router.get("/subjects", async (req, res)=>{
    try{
        db.query("SELECT * FROM subjects where Cycle = 'second_cycle'", (err, results)=>{
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


export default router;