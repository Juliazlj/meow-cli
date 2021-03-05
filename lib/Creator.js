const Inquirer = require('inquirer');
const {fetchRepoList, fetchTagList} = require('./request');
const {wrapLoading} = require('./util');
const downloadGitRepo = require('download-git-repo');
const util = require('util');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs-extra');
class Creator{
  constructor(projectName, targetDir){
    this.name = projectName;
    this.target = targetDir;

    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }
  async fetchRepo(){
    // 失败重新拉取
    let repos = await wrapLoading(fetchRepoList,'awaiting fetch template');
    if(!repos) return;
    repos = repos.map(item=>item.name);

    const {repo}=await Inquirer.prompt({
      name:'repo',
      type:'list',
      choices: repos,
      message:'please choice a template to create project'
    })
    return repo
  }

  async fetchTag(repo){
    let tags = await wrapLoading(fetchTagList,'waiting fetch tag', repo);
    if(!tags) return;
    tags = tags.map(item=>item.name);
    if(tags.length){
      const {tag}=await Inquirer.prompt({
        name:'tag',
        type:'list',
        choices: tags,
        message:'please choice a tag to create project'
      })
      return tag
    }
    return ''
  }

  async download(repo, tag){
    let requestUrl = `meow-cli/${repo}${tag?'#'+tag:''}`;
    try{
      await wrapLoading(this.downloadGitRepo, 'downloading template...', requestUrl, path.resolve(process.cwd(),this.target));
    }catch(e){
      console.error(e);
    }
    return this.target;
  }

  async processTemplate(){
    const packagePath = path.join(this.target,'package.json');
    let templateData = fs.readFileSync(packagePath,{encoding: 'utf-8'});
    templateData = ejs.render(templateData, {packageName:this.name});
    fs.writeFileSync(packagePath, templateData);
  }

  async create(){
    const repo = await this.fetchRepo();
    const tag = await this.fetchTag(repo);
    const downloadUrl = await this.download(repo,tag);
    await this.processTemplate();
  }
}
module.exports = Creator;