// 通过axios获取结果

const axios = require('axios');

axios.interceptors.response.use(res=>res.data);

async function fetchRepoList(){
  return axios.get('https://api.github.com/orgs/meow-cli/repos')
}

async function fetchTagList(repo){
  console.log(repo);
  return axios.get(`https://api.github.com/repos/meow-cli/${repo}/tags`)
}

module.exports = {
  fetchRepoList,
  fetchTagList
}