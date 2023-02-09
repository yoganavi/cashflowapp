const util = require('util');
const exec = util.promisify(require('child_process').exec)

async function openFile(path) {
  const { stdout, stderr, err } = await exec(path);
  if (err) {
    console.log(err);
    return;
  }
  process.exit(0);
}

openFile('D:\\aa.txt')
console.log('adasdasda');