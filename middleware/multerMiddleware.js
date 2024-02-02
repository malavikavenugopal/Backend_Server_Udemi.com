//import Multer

const multer = require('multer')

const storage = multer.diskStorage({
   
    destination:(req,file,callback)=>{
        callback(null,'./uploads') // it should be stored in uploads folder
    },
    filename:(req,file,callback)=>{
      
      const filename = `image-${Date.now()}-${file.originalname}`
      //to set the name
      callback(null,filename)
    }
})

const fileFilter = (req,file,callback)=>{
    if(file.mimetype === 'image/png' || file.mimetype ==='image/jpeg' || file.mimetype === 'image/jpg'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error("Only png,jpg,jpeg files are allowed !!"))
    }
}

const multerConfig  = multer({
    storage,
    fileFilter
})

module.exports = multerConfig