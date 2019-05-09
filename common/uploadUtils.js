let path = require('path');
let fs = require("fs");
let multer = require('multer');

exports.createUploadObject = function (folders) {
  let uploadPath = path.resolve(__dirname, '..');
  for(let i = 0; i < folders.length; i++){
    uploadPath = path.join(uploadPath, folders[i]);
  }
  createFolder(uploadPath);
  //let uploadPath = path.join(path.resolve(__dirname, '..'), 'public', 'images', 'upload');

  let storage = multer.diskStorage({
    destination: function (req, file, cb){
      //文件上传成功后会放入public下的upload文件夹
      cb(null, uploadPath)
    },
    filename: function (req, file, cb){
      //设置文件的名字为其原本的名字，也可以添加其他字符，来区别相同文件，例如file.originalname+new Date().getTime();利用时间来区分
      cb(null, file.originalname)
    }
  });

  return multer({storage: storage});
};

function createFolder(folder) {
  try{
    fs.accessSync(folder);
  }catch(e){
    fs.mkdirSync(folder);
  }
}