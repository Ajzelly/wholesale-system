const db = require("../config/db");


exports.updateProfile = async (req,res)=>{

  try{

    const { id, name, phone, address } = req.body;


    await db.query(

      `UPDATE users
       SET name=?, phone=?, address=?
       WHERE id=?`,

      [name, phone, address, id]

    );


    res.json({success:true});


  }catch(err){

    console.error("PROFILE UPDATE:",err);

    res.status(500).json({error:"Server error"});

  }

};
