const ora = require('ora');

async function sleep(n){
  return new Promise((resolve, reject)=>{
    setTimeout(resolve,n);
  })
}

async function wrapLoading(fn, message, ...args){
  const spinner = ora(message);
  spinner.start();
  try{
    let res = await fn(...args);
    spinner.succeed();
    return res;
  }catch(e){
    console.error(e.message);
    spinner.fail('request failed, refetch...');
    await sleep(1000);
    return wrapLoading(fn,message, ...args);
  }
}

module.exports = {
  wrapLoading,
  sleep
}