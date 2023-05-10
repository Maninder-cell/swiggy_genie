const models = require('../models');
const use=models.User;

const { Op } = require('sequelize');

const order=models.Order;




exports.getuser=async(req,res)=>{
    try {
        
        const page = req.body.page ||4
        console.log(page);
       const limit = req.body.limit ||5
        console.log(limit);

      const offset = (page - 1) * limit;
      console.log(offset);
         const account_type=req.body.account_type;
         console.log("Account type",account_type);
       const keyword=req.body.searchText;
 
      if(keyword && account_type){
      const {rows ,count} = await use.findAndCountAll({ 
        where: {
            [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } },
                { address: { [Op.like]: `%${keyword}%` } },
                { contact: { [Op.like]: `%${keyword}%` } }
            ],
            account_type: account_type,
            
        },
        attributes:["id",'name','contact','address','account_type','image'],
       offset,
       limit
       
    });
   

  return res.status(200).json({ success:true, data: rows ,count:count});
   
   
   
}
else {

    if (account_type){
      const custo=await use.findAll({
        where:{
            account_type:account_type
        },
        attributes:['id','name','contact','address','account_type','image'],
       offset,
       limit
      });
      console.log(custo);
      res.status(200).json({sucess:true ,data: custo});

       }  
         
}
    
    } catch (error) {
        console.log(error);
         res.status(500).json({ msg: error });
    }
}



exports.createdriver=async(req,res,next)=>{
    try {
    
        
      //  const filename=req.file.filename
      //  console.log(filename);
      const userid=req.userid;
      const accountt=await use.findOne({where:{id:userid}});
      const account=accountt.account_type;
      if(account===0){
       console.log("ddriverdata",req.body.driverdata);
       const drive=await use.create({
        name:req.body.driverdata.name,
        address:req.body.driverdata.address,
        contact:req.body.driverdata.contact,
        // image:filename,
        email:req.body.driverdata.email,
        account_type:req.body.account_type
        
        

       });
      console.log(drive);
      res.status(200).json({data:drive });
      }else{
        res.status(500).json("You Don't Have Access To Create The Driver");
      }


   
   
 } catch (error) {
    console.log(error); 
    res.status(400).json({msg:error});
 }
   
}



exports.getdriver=async(req,res)=>{
    try {
      const page = req.body.page ||4
      console.log(page);
     const limit = req.body.limit ||5
      console.log(limit);

    const offset = (page - 1) * limit;
    console.log(offset);
    const id = req.body.id;

  
        const keyword=req.body.searchText;
        const account_type=req.body.account_type;
        console.log(account_type);
        if (id ) {
          const dri = await use.findByPk(id);
                  if (dri) {
                   return res.status(200).json({ data: dri});
                   } else {
                   return res.status(404).json({ message: "driver not found" });
                  }
                 }
        if(keyword && account_type){
            const {rows,count} = await use.findAndCountAll({ 
              where: {
                  [Op.or]: [
                      { name: { [Op.like]: `%${keyword}%` } },
                      { address: { [Op.like]: `%${keyword}%` } },
                      { contact: { [Op.like]: `%${keyword}%` } }
                  ],
                  account_type: account_type,
              },
              offset,
              limit
              
          });
          console.log("driver data",rows);
          res.status(200).json({data:rows,count:count});
          return;
         
      }
      else{
        if (account_type){
        
        const data=await use.findAll({where:{
          account_type:account_type
        },
      offset,
     limit});
        return res.status(200).json({data});
        }

    }
       
      
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:error});
        
    }
}


exports.createorder=async(req,res)=>{
    try {
        const userid=req.body.user_id;
        const custom=await use.findOne({where:{id:userid}});
     
        
       const orde=await order.create({
            user_id:userid,
            pickup_from:req.body.pickup_from,
            deliver_to:req.body.deliver_to,
            item_type:req.body.item_type,
            billing_details:req.body.billing_details,
            instructions:req.body.instructions,
            driver_id:req.body.driver_id,
            status:req.body.status,
            name:custom.name,
            contact:custom.contact
       });
       res.status(200).json({orders:orde});
    
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:error});
    }
}


exports.getorders = async (req, res) => {
    try {
    

        const page = req.body.page ||4
      console.log(page);
     const limit = req.body.limit ||5
      console.log(limit);

    const offset = (page - 1) * limit;
    console.log(offset);
        const id = req.body.id;
        const searchText=req.body.searchText;
  
        if (id) {
             const ord = await order.findByPk(id);
                     if (ord) {
                      return res.status(200).json({ data: ord});
                      } else {
                      return res.status(404).json({ message: "order not found" });
                     }
                    }
      if (searchText) {
        const {rows,count} = await order.findAndCountAll({
          where: {
            [Op.or]: [
              { pickup_from: { [Op.like]: `%${searchText}%` } },
              { deliver_to: { [Op.like]: `%${searchText}%` } },
              { item_type: { [Op.like]: `%${searchText}%` } },
              { status: { [Op.like]: `%${searchText}%` } },
              { name: { [Op.like]: `%${searchText}%` } },
              { contact: { [Op.like]: `%${searchText}%` } },
            ],

          },
          offset,
          limit
        });
  
        console.log("order data", rows);
        return res.status(200).json({ data: rows,count:count });
      } else {
        const data = await order.findAll({
          offset,
          limit

        });
        res.status(200).json({ data: data });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error });
    }
  };


// exports.getorders=async(req,res)=>{
//     try {
//         // const page = parseInt(req.query.page) ||4;
//         // console.log(page);
//         // const limit = parseInt(req.query.limit) || 2;
//         // console.log(limit);

//         // const offset = (page - 1) * limit;
//         // console.log(offset);
//         const keyword = req.params.searchText || '';
//         // const order_id = req.params.order_id;
//         // if (order_id) {
//         //     const ord = await order.findByPk(order_id);
//         //     if (ord) {
//         //       return res.status(200).json({ data: ord});
//         //     } else {
//         //       return res.status(404).json({ message: "order not found" });
//         //     }
//         //   }
//            if(keyword){
//             const userorder = await order.findAll({ 
//               where: {
//                   [Op.or]: [
//                       { pickup_from: { [Op.like]: `%${keyword}%` } },
//                       { deliver_to: { [Op.like]: `%${keyword}%` } },
//                       { item_type: { [Op.like]: `%${keyword}%` } },
//                       { status: { [Op.like]: `%${keyword}%` } },
//                       { name: { [Op.like]: `%${keyword}%` } },
//                       { contact: { [Op.like]: `%${keyword}%` } },

//                   ]
//               },
              
//           });
//             console.log("order data",userorder);
//           return res.status(200).json({data:userorder});
            
          
         
//       }
//       else{
//         // const data=await order.findAll({  offset,
//         //     limit});
//         const data=await order.findAll();
//         res.status(200).json({data:data});
//         return;
        
//     }

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({msg:error});
//     }
// }

    //   exports.isblocked=async(req,res)=>{
    //     try {
    //  const block=req.body.block;
    //   console.log(block);      
     
    //   const userid=req.userid;
    //   console.log(userid);
    //  const arr=[] ;


    //  if(block ==='1'){
    //   arr.push({ block: 1});
    //   const usedata=await use.update(arr[0],{where:{id:userid}})
    //   console.log("userdata",usedata);
    //   res.status(200).json({msg:"User  Updated"})
    //   return;
    //  }
    //  else if(block==='0'){
    //   arr.push({ block:0});
    //   const usedat=await use.update(arr[0],{where:{id:userid}})
    //   console.log("userda",usedat);

    //   res.status(200).json({msg:"User  blocked"})
    //   return;
    //  }
    //  else{
    //   res.status(500).json({msg:"User  not found"})
    //   return;
    //  }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }






    // exports.isblocked = async (req, res) => {
    //   try {
    //     const block = req.body.block;
    //     console.log(block);

    //    const userid=req.body.id

    //     const user_id = req.userid;

    //   const userda=await use.findOne({where:{id:user_id}});

    //   const account_type=userda.account_type;
      
    //   console.log("account_type",account_type);

    //   if(account_type === 2){
        
  
    
    //    if (block === '1') {
    //     await use.update({block:block},{ where: { id: userid },returning: true});
       
      
    //     res.status(200).json({ msg: "User unblocked" });
    //       return;
   
    //     } else if (block === '0') {
          
    //       await use.update({block:block},{ where: { id: userid },returning: true});
    
    //       res.status(200).json({ msg: "User blocked" });
    //       return;
     
    //     } else {
    //       res.status(500).json({ msg: "User not found" });
    //       return;
    //     }
    //   }
    //   else{
    //     res.status(500).json("dont access");
    //   }
   


    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ error: "Internal server error" });
    //   }
    // };



    exports.isblocked = async (req, res) => {
      try {
    
        const block = parseInt(req.body.block);
        console.log(block);
    
        const userid = req.body.id;

        const user_id = req.userid;

        const user = await use.findOne({ where: { id: user_id } });
     
        const account_type = user.account_type;
        console.log('account_type', account_type);
    
        if (account_type === 0) {
      
          if (block === 1) {
          
            await use.update({ block: block }, { where: { id: userid }, returning: true });
           
      
            res.status(200).json({ msg: 'User block' });
            return;
          
          } else if (block === 0) {
         
            await use.update({ block: block }, { where: { id: userid }, returning: true });
         
            res.status(200).json({ msg: 'User unblocked' });
            return;
          } 
         
        
   
        } else {
     
          res.status(500).json({ msg: 'Unauthorized ' });
        }



        
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
   
    
    
    
    
    
    



   