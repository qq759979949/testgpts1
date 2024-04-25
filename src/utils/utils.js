//  格式化布局接口的数据
export const formatData = function (data, submitData) {
  const formData = JSON.parse(JSON.stringify(data));
  formData.forEach((el, i) => {
    el.list = [];
    el.tab = 'tab' + i;
    el.items.forEach((item) => {
      if (submitData) {
        if (item.value === true) {
          submitData[item.name] = '是';
        } else if (item.value === false) {
          submitData[item.name] = '否';
        } else {
          // value 内部值；displayValue 展示值
          if (item.filedType === 'SELECT' && !item.single) {
            if (isArray(item.value)) {
              submitData[item.name] = item.value.length > 0 ? item.value : [];
            } else {
              submitData[item.name] = item.value ? item.value?.split(',') : [];
            }
          } else {
            submitData[item.name] = item.value;
          }
        }
      }
      if (item.filedType === 'BUTTON') {
        item.showDialog = false;
      }
      if (item.filedType === 'SELECT') {
        item.options = handOptionsData(item.options);
      }

      if (el.list[item.row]) {
        el.list[item.row].push(item);
      } else {
        el.list[item.row] = [item];
      }
    });
  });
  return formData;
};
// 判断是否为数组
export function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}
// export default isArray;

// 整理下拉框格式
function handOptionsData(data) {
  if (data.length > 0) {
    let newData = data.map((v) => {
      let label = 'label' in v,
        value = 'value' in v;
      if (!(label && value)) {
        let keysArr = Object.keys(v);
        return Object.assign({}, v, { label: v[keysArr[0]], value: keysArr[0] });
      } else {
        return v;
      }
    });
    return newData;
  }
}

//  格式化布局接口的数据
export const formatData1 = function (data, submitData) {
  const formData = JSON.parse(JSON.stringify(data));
  formData.forEach((el, i) => {
    el.tab = 'tab' + i;
    el.list = el.rows.map((row) => {
      row.items.forEach((item) => {
        if (submitData) {
          submitData[item.id] = item.valueInner;
        }
      });
      return row.items;
    });
  });
  return formData;
};

// 获取url上面的参数
export const GetQueryString = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

// 导出
export function saveFile(data, name) {
  try {
    const blobUrl = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.download = name;
    a.href = blobUrl;
    a.click();
  } catch (error) {
    window.$message.error('导出文件出错');
  }
}

// 表格里面状态转换UI方法
export function getStateColor(key, list, alpha = 1) {
  const color = list.find((i) => i.key === key)?.value;
  if (color) {
    return hexToRGB(color, alpha);
  }
}
const hexToRGB = (hex, alpha = 1) => {
  // eslint-disable-next-line no-useless-escape
  if (!/(^\#([a-fA-F0-9]{3})$)|(^\#([a-fA-F0-9]{6})$)/g.test(hex)) {
    return null;
  }
  const allNumberStr = '0123456788abcdef'; // 十六进制的所有数字
  const len = hex.slice(1).length;
  const str = len === 6 ? hex.slice(1) : hex.slice(1)[0].repeat(2) + hex.slice(1)[1].repeat(2) + hex.slice(1)[2].repeat(2);
  const arrStr = str.split('');
  const newArrStr = arrStr.map((item) => {
    return allNumberStr.indexOf((item + '').toLowerCase());
  });
  const num1 = newArrStr[0] * 16 + newArrStr[1];
  const num2 = newArrStr[2] * 16 + newArrStr[3];
  const num3 = newArrStr[4] * 16 + newArrStr[5];
  return `rgb(${num1}, ${num2}, ${num3}, ${alpha})`;
};
// 生成随机id
export function randomString(len) {
  const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const rdmIndex = (text) => (Math.random() * text.length) | 0;
  let rdmString = '';
  for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
  return rdmString;
}

/**数组去重 */
export function uniqueFunc(arr, uniId) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}

// 数组对象去重
export function uniqueArray(arr) {
  return Array.from(new Set(arr));
}

// property是你需要排序传入的key,bol为true时是升序，false为降序
export function arrSortByDate(property, bol) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    if (bol) {
      // 升序
      return Date.parse(value1) - Date.parse(value2);
    } else {
      // 降序
      return Date.parse(value2) - Date.parse(value1);
    }
  };
}
