import { conUser } from "../utils/db.js";

export const getNotifications = (req, res) => {

  const { userId } = req.params;

  const sql = `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
  `;

  conUser.query(sql, [userId], (err, result) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.status(200).json(result);

  });
};
export const markAllRead = (req,res)=>{

 const { userId } = req.params;

 const sql=`
 UPDATE notifications
 SET is_read=1
 WHERE user_id=?
 `;

 conUser.query(sql,[userId],(err,result)=>{

   if(err){
     return res.status(500).json(err);
   }

   res.json({
     success:true
   });

 });

};