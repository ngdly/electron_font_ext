const {app, BrowserWindow, ipcMain} = require('electron');
const {exec} = require('child_process');

function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({width: 1200, height: 700});

  // 然后加载应用的 index.html。
  win.loadFile('index.html');

  // 打开开发者工具
  win.webContents.openDevTools();

}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// // 当全部窗口关闭时退出。
// app.on('window-all-closed', () => {
//   // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
//   // 否则绝大部分应用及其菜单栏会保持激活。
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
// app.on('activate', () => {
//   // 在macOS上，当单击dock图标并且没有其他窗口打开时，
//   // 通常在应用程序中重新创建一个窗口。
//   if (win === null) {
//     createWindow()
//   }
// })

const characterSetData = {
  half_symbol: '+-×÷±/=≈≡≠∧∨<>()[]{}',
  half_letter: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  half_digital: '1234567890',
  all_symbol: '＋－×÷±／＝≈≡≠∧∨＜＞（）［］｛｝',
  all_letter: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
  all_digital: '1234567890',
  number_hz: '零壹贰叁肆伍陆柒捌玖拾佰仟万亿一二三四五六七八九十',
};
ipcMain.on('onttfConver', (event, data) => {
  let toPath = data.path.replace(/\.ttf$/, '_sub.ttf');
  let toFileTypeOptionKey = '';
  if (data.toFileType == 'woff') {
    toFileTypeOptionKey = '-w';
    toPath = toPath.replace(/\.ttf$/, '.woff');
  } else if (data.toFileType == 'eot') {
    toFileTypeOptionKey = '-e';
    toPath = toPath.replace(/\.ttf$/, '.eot');
  }

  data.characterSet.forEach(e => {
    data.content += characterSetData[e];
  });
  console.log(data);

  exec(`java -jar jar/sfnttool.jar ${toFileTypeOptionKey} -s '${data.content}' ${data.path} ${toPath}`, {
    // cwd:"/my/test/electron_font_ext/"
  }, function(error, stdout, stderr) {
    console.log(error, stdout, stderr);
  });
  event.sender.send('ttfConverEnd', {
    toPath,
  });
});
