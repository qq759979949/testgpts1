const localUtils = require('./localeFs.js');
const folderUtils = require('./folder.js');
const config = {
  readFolder: './src',                    // 读取的目标文件夹
  output: '../src/assets/lang/zh.js',          // 输出目录
  suffix: '.vue|.js',                                 // 指定的文件后缀
  // component: ['FormItemEx','LocaleText','IconLabel'],
  // reg:  /intl\(\s*\{(.+?)\}\s*\)\.d\(\s*\{(.+?)\}\s*\)/g,        // 识别的目标组件
  reg:  /intl\(\s*(.+?)\s*\)\.d\(\s*(.+?)\s*\)/g,        // 识别的正则
  // key: 'key',                                   // 国际化的key
  // value: 'text',                                // 翻译后的值
};
const execFun = async ()=>{
  let startData = new Date()
  // 获取项目所有的jsx路径
  const AllPath = await folderUtils.getProjectAllTSXFile(config);
  const TotalObj = {};
// 根据每一个文件路径，获取{key:value,key:value},组成一个promise数组
  const promiseArray = AllPath.map((path) => {
    return localUtils.getFileLocalesObj(path, config);
  });
// 读取所有的文件，生成一个对象，并写入文件
  Promise.all(promiseArray)
    .then((res) => {
      const filteredList = res.filter((item) => {
        return JSON.stringify(item) != '{}';
      });
      // console.log(filteredList)
      filteredList.forEach((item) => {
        Object.keys(item).forEach((key) => {
          // TotalObj[key] = item[key];
          buildTotalObj(TotalObj, key, item)
        });
      });
      console.log(`>>>>>>开始写入文件：${(new Date() - startData)}ms`)
      localUtils.writeToFilePath(TotalObj,config.output);
    })
    .then(reject=>{
      console.log(reject);
    })
    .catch((err) => {
      console.log(err);
    });
}


function buildTotalObj (TotalObj, keyValue, item) {
  let keyList = keyValue.split('.')
  let i = -1
  function recursion (obj) {
    i++
    if (i < keyList.length - 1 && typeof obj[keyList[i]] !== 'object') {
      obj[keyList[i]] = {}
    } else if (i === keyList.length - 1) {
      obj[keyList[i]] = item[keyValue]
    }
    if (i < keyList.length - 1) {
      recursion(obj[keyList[i]])
    }
  }
  recursion(TotalObj)
}
execFun()
