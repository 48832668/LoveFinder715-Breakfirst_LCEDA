# 嘉立创EDA API 软件转译封装计划

## TL;DR

> **快速摘要**: 为嘉立创EDA的TypeScript API创建JavaScript软封装层，通过字符串构造onclick技术绕过TS类型限制，实现JS/HTML/CSS职责分离的插件开发架构。

> **交付物**: 
> - `LCEDA_API_Translater.js` - 核心封装库
> - `api_sys_debug.html` - 测试页面
> - `styles.css` - 样式文件

> **预估工作量**: Short (2-3小时)
> **并行执行**: YES - 多个文件可并行创建

---

## 背景

### 原始问题
- 嘉立创EDA的API由TypeScript编写，无法直接在.js文件中调用
- 在HTML的`<script>`标签中可以直接调用EDA API
- 用户希望保持JS/HTML/CSS各司其职的架构

### 技术方案
通过字符串构造onclick属性，利用DOM事件触发机制间接调用EDA的TS API：

```javascript
// 示例：封装思路
function showToastMessage(message, messageType = 'info', timer = 3) {
    const apiCall = `eda.sys_Message.showToastMessage('${message}', '${messageType}', ${timer})`;
    const btn = document.createElement('button');
    btn.onclick = new Function(apiCall);
    btn.click();
    btn.remove();
}
```

---

## 工作目标

### 核心目标
将文档中的**系统类(SYS_*) API**共 **25个类，约136个方法** 封装为JavaScript函数。

### 具体交付物
- [x] 核心封装库 `LCEDA_API_Translater.js`
- [x] 测试页面 `iframe/api_sys_debug.html`
- [x] 使用文档/注释

### 定义完成
- [ ] 所有SYS类方法完成封装
- [ ] 测试页面可演示所有封装函数
- [ ] 代码注释完整，可维护

---

## API统计 (SYS类)

| 类别 | 类名 | 方法数 | 封装优先级 |
|------|------|--------|------------|
| 消息 | SYS_Message | 3 | P0 |
| 消息框 | SYS_MessageBox | 2 | P0 |
| 吐司 | SYS_ToastMessage | 1 | P0 |
| 对话框 | SYS_Dialog | 5 | P0 |
| 日志 | SYS_Log | 5 | P1 |
| 面板 | SYS_PanelControl | 12 | P1 |
| 存储 | SYS_Storage | 6 | P1 |
| IFrame | SYS_IFrame | 4 | P2 |
| 窗口 | SYS_Window | 7 | P2 |
| 环境 | SYS_Environment | 11 | P2 |
| 文件系统 | SYS_FileSystem | 10 | P2 |
| 文件管理 | SYS_FileManager | 12 | P2 |
| 消息总线 | SYS_MessageBus | 18 | P3 |
| 快捷键 | SYS_ShortcutKey | 3 | P3 |
| 加载 | SYS_LoadingAndProgressBar | 4 | P3 |
| 多语言 | SYS_I18n | 6 | P3 |
| 其他 | SYS_ClientUrl, SYS_FontManager, SYS_HeaderMenu, SYS_Timer, SYS_Tool, SYS_Unit, SYS_WebSocket, SYS_Setting, SYS_RightClickMenu | ~24 | P4 |

---

## 实施计划

### 阶段1: 核心框架搭建 (P0-P1高频API)

**目标**: 封装最常用的消息、对话框、日志、面板控制、存储类API

**封装函数清单**:

#### P0 - 消息与对话框类 (11个方法)
| 序号 | 原API | 封装后函数名 | 参数 |
|------|-------|---------------|------|
| 1 | eda.sys_Message.showToastMessage | showToastMessage | (message, messageType?, timer?, bottomPanel?, buttonTitle?, buttonCallbackFn?) |
| 2 | eda.sys_Message.showFollowMouseTip | showFollowMouseTip | (tip, msTimeout?) |
| 3 | eda.sys_Message.removeFollowMouseTip | removeFollowMouseTip | (tip?) |
| 4 | eda.sys_Dialog.showConfirmationMessage | showConfirmationMessage | (content, title?, mainButtonTitle?, buttonTitle?, callbackFn?) |
| 5 | eda.sys_Dialog.showInformationMessage | showInformationMessage | (content, title?, buttonTitle?) |
| 6 | eda.sys_Dialog.showInputDialog | showInputDialog | (beforeContent?, afterContent?, title?, type?, value?, otherProperty?, callbackFn?) |
| 7 | eda.sys_Dialog.showSelectDialog (单选) | showSelectDialog | (options, beforeContent?, afterContent?, title?, defaultOption?, callbackFn?) |
| 8 | eda.sys_Dialog.showSelectDialog (多选) | showSelectDialogMulti | (options, beforeContent?, afterContent?, title?, defaultOption?, callbackFn?) |

#### P1 - 日志、面板、存储类 (23个方法)
| 序号 | 原API | 封装后函数名 | 参数 |
|------|-------|---------------|------|
| 9 | eda.sys_Log.add | logAdd | (message, type?) |
| 10 | eda.sys_Log.clear | logClear | () |
| 11 | eda.sys_Log.export | logExport | (types?) |
| 12 | eda.sys_Log.find | logFind | (message, types?) |
| 13 | eda.sys_Log.sort | logSort | (types?) |
| 14 | eda.sys_PanelControl.openLeftPanel | openLeftPanel | (tab?) |
| 15 | eda.sys_PanelControl.closeLeftPanel | closeLeftPanel | () |
| 16 | eda.sys_PanelControl.openRightPanel | openRightPanel | (tab?) |
| 17 | eda.sys_PanelControl.closeRightPanel | closeRightPanel | () |
| 18 | eda.sys_PanelControl.openBottomPanel | openBottomPanel | (tab?) |
| 19 | eda.sys_PanelControl.closeBottomPanel | closeBottomPanel | () |
| 20 | eda.sys_PanelControl.toggleLeftPanelLockState | toggleLeftPanelLock | (state?) |
| 21 | eda.sys_PanelControl.toggleRightPanelLockState | toggleRightPanelLock | (state?) |
| 22 | eda.sys_PanelControl.toggleBottomPanelLockState | toggleBottomPanelLock | (state?) |
| 23 | eda.sys_PanelControl.isLeftPanelLocked | isLeftPanelLocked | () |
| 24 | eda.sys_PanelControl.isRightPanelLocked | isRightPanelLocked | () |
| 25 | eda.sys_PanelControl.isBottomPanelLocked | isBottomPanelLocked | () |
| 26 | eda.sys_Storage.setExtensionUserConfig | setConfig | (key, value) |
| 27 | eda.sys_Storage.getExtensionUserConfig | getConfig | (key) |
| 28 | eda.sys_Storage.deleteExtensionUserConfig | deleteConfig | (key) |
| 29 | eda.sys_Storage.setExtensionAllUserConfig | setAllConfig | (configs) |
| 30 | eda.sys_Storage.getExtensionAllUserConfig | getAllConfig | () |
| 31 | eda.sys_Storage.clearExtensionAllUserConfigs | clearAllConfig | () |

### 阶段2: 扩展封装 (P2类)

**目标**: 环境、窗口、文件系统、IFrame类

| 序号 | 原API | 封装后函数名 | 参数 |
|------|-------|---------------|------|
| 32 | eda.sys_Environment.getUserInfo | getUserInfo | () |
| 33 | eda.sys_Environment.getEditorCurrentVersion | getVersion | () |
| 34 | eda.sys_Environment.isClient | isClient | () |
| 35 | eda.sys_Environment.isWeb | isWeb | () |
| 36 | eda.sys_Environment.isOnlineMode | isOnlineMode | () |
| 37 | eda.sys_Environment.isOfflineMode | isOfflineMode | () |
| 38 | eda.sys_Environment.isJLCEDAProEdition | isProEdition | () |
| 39 | eda.sys_Window.open | windowOpen | (url, target?) |
| 40 | eda.sys_Window.openUI | openUI | (uiName, args?) |
| 41 | eda.sys_Window.getUrlParam | getUrlParam | (key) |
| 42 | eda.sys_Window.getUrlAnchor | getUrlAnchor | () |
| 43 | eda.sys_Window.getCurrentTheme | getTheme | () |
| 44 | eda.sys_IFrame.openIFrame | openIFrame | (htmlFileName, width?, height?, id?, props?) |
| 45 | eda.sys_IFrame.closeIFrame | closeIFrame | (id?) |
| 46 | eda.sys_IFrame.showIFrame | showIFrame | (id?) |
| 47 | eda.sys_IFrame.hideIFrame | hideIFrame | (id?) |
| 48 | eda.sys_FileSystem.getDocumentsPath | getDocumentsPath | () |
| 49 | eda.sys_FileSystem.getProjectsPaths | getProjectsPaths | () |
| 50 | eda.sys_FileSystem.getLibrariesPaths | getLibrariesPaths | () |
| 51 | eda.sys_FileSystem.openReadFileDialog | openReadFileDialog | (filenameExtensions?, multiFiles?) |
| 52 | eda.sys_FileSystem.saveFile | saveFile | (fileData, fileName?) |

### 阶段3: 高级封装 (P3-P4类)

**目标**: 消息总线、快捷键、加载条、定时器、多语言等

---

## 技术实现细节

### 封装函数模板

```javascript
/**
 * 显示吐司消息
 * 对应API: eda.sys_Message.showToastMessage
 * @param {string} message - 消息内容
 * @param {string} [messageType='info'] - 消息类型: info/success/warn/error/question
 * @param {number} [timer=3] - 显示秒数
 * @param {string} [bottomPanel] - 底部面板标签
 * @param {string} [buttonTitle] - 按钮标题
 * @param {string} [buttonCallbackFn] - 回调函数(字符串形式)
 */
function showToastMessage(message, messageType = 'info', timer = 3, bottomPanel, buttonTitle, buttonCallbackFn) {
    // 1. 构造API调用字符串
    let apiCall = `eda.sys_Message.showToastMessage('${message}', '${messageType}', ${timer}`;
    
    if (bottomPanel || buttonTitle || buttonCallbackFn) {
        apiCall += `, '${bottomPanel || ''}'`;
    }
    if (buttonTitle || buttonCallbackFn) {
        apiCall += `, '${buttonTitle || ''}'`;
    }
    if (buttonCallbackFn) {
        apiCall += `, '${buttonCallbackFn.replace(/'/g, "\\'")}'`;
    }
    apiCall += ')'';
    
    // 2. 通过onclick触发
    const tempId = '_temp_api_btn_' + Date.now();
    const div = document.createElement('div');
    div.id = 'tempDiv';
    div.style.display = 'none';
    div.innerHTML = `<button id="${tempId}" onclick="${apiCall}"></button>`;
    document.body.appendChild(div);
    
    const btn = document.getElementById(tempId);
    btn.click();
    
    // 3. 清理
    setTimeout(() => {
        div.remove();
    }, 100);
}
```

### 参数处理策略

| 参数类型 | 处理方式 |
|----------|----------|
| 字符串 | 直接插入单引号转义 |
| 数字 | 直接插入不加引号 |
| 布尔 | 转换为true/false不加引号 |
| 数组 | JSON.stringify后插入 |
| 对象 | JSON.stringify后插入 |
| 函数 | 转换为字符串（用户需要传入字符串形式） |
| undefined/null | 不传递或传空字符串 |

---

## 文件结构

```
Debug_LoveFinder_LCAPI_SoftTranslaterLayer/
├── src/
│   └── index.ts                    # 入口文件
├── iframe/
│   ├── LCEDA_API_Translater.js     # 核心封装库 (新建)
│   ├── api_sys_debug.html          # 测试页面 (已有)
│   └── styles.css                  # 样式文件 (新建)
└── extension.json
```

---

## QA测试场景

### 场景1: 消息提示测试
- 调用 showToastMessage('测试消息', 'success', 3)
- 预期: 显示3秒成功提示

### 场景2: 对话框测试
- 调用 showConfirmationMessage('确认删除?', '警告', '删除', '取消')
- 预期: 弹出确认对话框

### 场景3: 面板控制测试
- 调用 openLeftPanel('project_list')
- 预期: 打开左侧面板到工程标签

### 场景4: 存储测试
- 调用 setConfig('testKey', 'testValue')
- 调用 getConfig('testValue')
- 预期: 存储和读取成功

---

## 成功标准

1. **功能完整**: 所有P0-P1类API（共34个方法）封装完成
2. **可运行**: 测试页面可以正常调用所有封装函数
3. **无报错**: 控制台无JavaScript错误
4. **可维护**: 代码注释完整，参数说明清晰
