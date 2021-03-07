const path = require('path');
const fs = require('fs-extra');
const Inquirer = require('inquirer');
const Creator = require('./Creator');

module.exports = async function (projectName, options){
  const cwd = process.cwd(); //获取当前命令执行时的工作目录
  const targetDir = path.join(cwd, projectName); // 目标路径
  // 如果目标路径存在 且有force参数则删除
  if(fs.existsSync(targetDir)){
    if(options.force){
      await fs.remove(targetDir);
    }else{
      // 提示用户是否确定覆盖
      const {action} =await Inquirer.prompt([{
        name:'action',
        type:'list',
        message:'target directory already, please exists Pick an action.',
        choices:[
          {name:'Overwrite', value:'overwrite'},
          {name:'Cancel', value:false},
        ]
      }])
      if(!action){
        return;
      }else if(action === 'overwrite'){
        console.log(`\r\nRemoving...`);
        await fs.remove(targetDir);
        console.log(`\r\nremove ${targetDir} success!`);
      }
    }
  }
  
  // 创建项目
  const creator = new Creator(projectName, targetDir)

  creator.create();
}