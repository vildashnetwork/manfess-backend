// import db from "../../middlewares/db.js"
// import express from "express"

// const router = express.Router()

// //url: https://manfess-backend.onrender.com/api/subjects/all
// router.get("/", async (req, res)=>{
//     try{
//         db.query("SELECT * FROM subjects", (err, results)=>{
//             if(err){
//                 console.log(err)
//                 return res.status(500).json({error: "Database query error"})
//             }
//             res.status(200).json(results)
//         })

//     }
//     catch(error){
//         console.log(error)
//     }
// })

// export default router








import db from "../../middlewares/db.js";
import express from "express";

const router = express.Router();

// url: https://manfess-backend.onrender.com/api/subjects/all
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM subjects");
    res.status(200).json(results);
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
