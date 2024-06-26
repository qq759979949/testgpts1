var fs = require('fs');
const path = require('path');

//写入文件
const writeToFilePath = (info, output) => {
  console.log('outPut'+output);
  let time = new Date();
  try {
    let file = path.resolve(__dirname, output);
    const str = `\nexport default${JSON.stringify(info)}`
    const result = str.replace(/,\"/g, ",\n   \"")
    .replace(/t{/g, "t{\n   ")
    .replace(/\"}/g,"\"\n}")
    .replace(/\":{/g,"\":{\n   ");
    // 异步写入数据到文件
    fs.writeFile(file, result, { encoding: 'utf8' }, (err) => {
      if (!err){
        console.log(`>>>>>>写入${output}  成功：${new Date()-time }ms`)
      }
    });
  }catch (e) {
    console.log(e)
  }
};
// 根据路径获取文件内容，识别文件内容，根据内容获取到对应的国际化对象
const getFileLocalesObj = (path, config) => {
  return new Promise((resolve,reject) => {
    let result = {}
    var buf = new Buffer.alloc(102400000);
    fs.open(path, 'r+', function (err, fd) {
      if (err) {
        resolve({})
      }
      try {
        fs.read(fd, buf, 0, buf.length, 0, function (err, bytes) {
          if (err || bytes == 0) {
            resolve({})
          } else {
            const source = buf.slice(0, bytes).toString(); //转为字符串
            // const component = config.component.join('|')
            // const reg = /<(FormItemEx|LocaleText)(.+?)>/ig;
            // eval(  `var reg = /<(${component})(.+?)>/ig`);
            // intl({key: 'projectList', text: '项目列表'})
            const reg = config.reg;
            let matchs = source.match(reg);
            // 获取符合条件的标签列表
            if (matchs&&matchs.length>0) {
              console.log(`>>>>>>文件路径：${path}\n>>>>>>共${matchs.length}个组件`)
              matchs.forEach(m => {
                // eval(  `var keyReg = /(intl\(\\s*\'|intl\(\\s*\")(.*?)(\'\)|\"\))/;`);
                // eval(  `var valueReg = /(${config.value}:\\s*\'|${config.value}:\\s*\")(.*?)(\'|\")/;`);
                // const labelReg = /(label=\'|label=\")(.*?)(\'|\")/;
                // let matchName = m.match(/(name=\'|name=\")(.*?)(\'|\")/);
                // let matchLabel = m.match(/(label=\'|label=\")(.*?)(\'|\")/);
                let keyReg = /(intl\(\s*\'|intl\(\s*\")(.*?)(\'\)|\"\))/
                let valueReg = /(d\(\s*\'|d\(\s*\")(.*?)(\'\)|\"\))/
                let matchName = m.match(keyReg);
                let matchLabel = m.match(valueReg);
                // console.log('matchLabel', matchLabel)
                if (matchName && matchLabel) {
                  result[matchName[2]] = matchLabel[2];
                }
              })
            }else{
              resolve({});
            }
            if (JSON.stringify(result)!=='{}'){
              resolve(result)
            }else {
              resolve({});
            }
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }).catch(err=>{
    console.log(JSON.stringify(err));
  });
};





// 根据路径获取文件内容，识别文件内容
const getFileContent = (path, config) => {
  return new Promise((resolve,reject) => {
    const  result = [];
    var buf = new Buffer.alloc(102400000);
    fs.open(path, 'r+', function (err, fd) {
      if (err) {
        resolve({})
      }
      try {
        fs.read(fd, buf, 0, buf.length, 0, function (err, bytes) {
          if (err || bytes == 0) {
            resolve({})
          } else {
            const source = buf.slice(0, bytes).toString(); //转为字符串
            const keyValuesReg = /(\'|\")(.*?)(\'\,|\"\,)/ig;
            let matchs = source.match(keyValuesReg);
            if (matchs) {
              matchs.forEach((item, index) => {
                const ObjStr = item.split(':');
                // const key = /(\')(.*?)(\'\:")/;
                var reg = new RegExp( '\'|\"' , "g" )
                var breakReg = new RegExp( '\n' , "g" )
                var breakReg2 = new RegExp( /&nbsp;/ig , "g" )
                const key = ObjStr[0]?ObjStr[0].replace(reg,'').trim():'';
                const value = ObjStr[1]?ObjStr[1].replace(reg,'').replace(breakReg,'').replace(breakReg2,'').replace(',','').trim():'';
                if (key&&value){
                  const obj = {};
                  obj[key] = value;
                  result.push(obj);
                }
              })
            }
            resolve(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }).catch(err=>{
    console.log(JSON.stringify(err));
  });
};

module.exports.writeToFilePath = writeToFilePath;
module.exports.getFileLocalesObj = getFileLocalesObj;
module.exports.getFileLocalesContent = getFileContent;
