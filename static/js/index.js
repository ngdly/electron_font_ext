const {ipcRenderer} = require('electron');
const {dialog} = require('electron').remote;
// const { exec } = require('child_process')

const fileData = {
  name: '',
  path: '',
  content: '',
  toFileType: 'ttf',

};

/*拖拽的目标对象------ document 监听drop 并防止浏览器打开客户端的图片*/
document.ondragover = function(e) {
  e.preventDefault();  //只有在ondragover中阻止默认行为才能触发 ondrop 而不是 ondragleave
};
document.ondrop = function(e) {
  e.preventDefault();  //阻止 document.ondrop的默认行为  *** 在新窗口中打开拖进的图片
};
const drag = document.getElementById('drag');
drag.ondragover = function(e) {
  e.preventDefault();
};
drag.ondrop = (event) => {
  var list = event.dataTransfer.files;
  if (list.length > 1) {
    alert('最多选一个文件');
    return;
  }
  const name = list[0].name;
  const path = list[0].path;
  changeFile(list[0].name, list[0].path);
  event.preventDefault();
};

function changeFile(name, path) {
  if (!/\.ttf$/.test(name)) {
    alert('须选择.ttf文件');
    return;
  }
  fileData.name = name;
  fileData.path = path;
  drag.innerHTML = path;
}

drag.addEventListener('click', function() {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: 'TTF字体文件', extensions: ['ttf']},
    ],
  }, function(filePaths) {
    if (!filePaths) {
      return;
    }
    const path = filePaths[0];
    const name = path.replace(/.+\/([^\/]+\.ttf)$/, '$1');
    changeFile(name, path);
  });
});

document.querySelector('#btn_submit').addEventListener('click', function(e) {
  fileData.content = document.querySelector('#content').value;
  fileData.toFileType = document.querySelector('[name=toFileType]:checked').value;
  fileData.characterSet = [];
  document.querySelectorAll('[name=characterSet]:checked').forEach(e => fileData.characterSet.push(e.value));
  if (!fileData.path) {
    alert('请选择文件');
    return;
  }
  if (!fileData.content && !fileData.characterSet.length) {
    alert('请输入内容');
    return;
  }
  ipcRenderer.send('onttfConver', fileData);
  e.preventDefault();
});
ipcRenderer.on('ttfConverEnd', function(e, data) {
  document.getElementById('tip').innerHTML = '提取成功：' + data.toPath;
});
