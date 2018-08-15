const {app, BrowserWindow, ipcMain} = require('electron');
const {exec} = require('child_process');

function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({width: 800, height: 600});

  // 然后加载应用的 index.html。
  win.loadFile('index.html');

  // 打开开发者工具
  win.webContents.openDevTools();

}

ipcMain.on('onttfConver', (event, data) => {
  console.log(data);
  let toPath = data.path.replace(/\.ttf$/, '_sub.ttf');
  let toFileTypeOptionKey = '';
  if (data.toFileType == 'woff') {
    toFileTypeOptionKey = '-w';
    toPath = toPath.replace(/\.ttf$/, '.woff');
  } else if (data.toFileType == 'eot') {
    toFileTypeOptionKey = '-e';
    toPath = toPath.replace(/\.ttf$/, '.eot');
  }
  exec(`java -jar jar/sfnttool.jar ${toFileTypeOptionKey} -s '${data.content}' ${data.path} ${toPath}`, {
    // cwd:"/my/test/electron_font_ext/"
  }, function(error, stdout, stderr) {
    console.log(error, stdout, stderr);
  });
  // event.sender.startDrag({
  //   file: filePath,
  //   icon: '/path/to/icon.png'
  // })
});

app.on('ready', createWindow);