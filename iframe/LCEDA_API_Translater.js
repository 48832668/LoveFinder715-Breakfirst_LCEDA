/**
 * 嘉立创EDA API 软件转译层
 * LCEDA_API_Translater.js
 * 
 * 使用说明：
 * 1. 在HTML中引入此脚本: <script src="LCEDA_API_Translater.js"></script>
 * 2. 直接调用封装后的函数，如: showToastMessage('Hello', 'success', 3)
 * 
 * 技术原理：通过字符串构造onclick属性，利用DOM事件触发机制间接调用EDA的TS API
 */

(function() {
    'use strict';

    // ============================================
    // 工具函数：构造临时按钮执行API调用
    // ============================================
    
    /**
     * 执行EDA API调用
     * @param {string} apiCallStr - API调用字符串，如 "eda.sys_Message.showToastMessage('msg', 'info', 3)"
     */
    function executeApiCall(apiCallStr) {
        const tempId = '_temp_api_btn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        let tempDiv = document.getElementById('tempDiv');
        if (!tempDiv) {
            tempDiv = document.createElement('div');
            tempDiv.id = 'tempDiv';
            tempDiv.style.display = 'none';
            document.body.appendChild(tempDiv);
        }
        
        // 使用encodeURIComponent确保特殊字符正确处理
        tempDiv.innerHTML = `<button id="${tempId}" onclick="${apiCallStr}"></button>`;
        
        const btn = document.getElementById(tempId);
        if (btn) {
            btn.click();
            // 延迟清理
            setTimeout(() => {
                btn.remove();
            }, 100);
        }
    }

    /**
     * 转义单引号
     * @param {string} str 
     * @returns {string}
     */
    function escapeQuote(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/'/g, "\\'");
    }

    /**
     * 处理参数为JSON字符串
     * @param {any} obj 
     * @returns {string}
     */
    function toJsonParam(obj) {
        return JSON.stringify(obj).replace(/"/g, '&quot;');
    }

    // ============================================
    // P0 - 消息与对话框类 (8个方法)
    // ============================================

    /**
     * 显示吐司消息
     * 对应API: eda.sys_Message.showToastMessage
     * @param {string} message - 消息内容
     * @param {string} [messageType='info'] - 消息类型: info/success/warn/error/question
     * @param {number} [timer=3] - 显示秒数，0为不自动关闭
     * @param {string} [bottomPanel] - 底部面板标签: findResult/library/log/drcResult/schDrcResult
     * @param {string} [buttonTitle] - 按钮标题
     * @param {string} [buttonCallbackFn] - 回调函数(字符串形式)
     */
    window.showToastMessage = function(message, messageType, timer, bottomPanel, buttonTitle, buttonCallbackFn) {
        messageType = messageType || 'info';
        timer = timer || 3;
        
        let apiCall = `eda.sys_Message.showToastMessage('${escapeQuote(message)}', '${messageType}', ${timer}`;
        
        if (bottomPanel || buttonTitle || buttonCallbackFn) {
            apiCall += `, '${bottomPanel || ''}'`;
        }
        if (buttonTitle || buttonCallbackFn) {
            apiCall += `, '${buttonTitle || ''}'`;
        }
        if (buttonCallbackFn) {
            apiCall += `, '${escapeQuote(buttonCallbackFn)}'`;
        }
        apiCall += ')';
        
        executeApiCall(apiCall);
    };

    /**
     * 显示跟随鼠标的提示
     * 对应API: eda.sys_Message.showFollowMouseTip
     * @param {string} tip - 提示内容
     * @param {number} [msTimeout] - 显示时长(毫秒)，不传则持续显示
     */
    window.showFollowMouseTip = function(tip, msTimeout) {
        let apiCall = `eda.sys_Message.showFollowMouseTip('${escapeQuote(tip)}'`;
        if (msTimeout !== undefined) {
            apiCall += `, ${msTimeout}`;
        }
        apiCall += ')';
        executeApiCall(apiCall);
    };

    /**
     * 移除跟随鼠标的提示
     * 对应API: eda.sys_Message.removeFollowMouseTip
     * @param {string} [tip] - 提示内容，如不传则移除所有
     */
    window.removeFollowMouseTip = function(tip) {
        let apiCall = `eda.sys_Message.removeFollowMouseTip('${escapeQuote(tip || '')}')`;
        executeApiCall(apiCall);
    };

    /**
     * 显示确认对话框
     * 对应API: eda.sys_Dialog.showConfirmationMessage
     * @param {string} content - 消息文本，支持\n换行
     * @param {string} [title] - 弹出窗口标题
     * @param {string} [mainButtonTitle] - 主要按钮标题
     * @param {string} [buttonTitle] - 取消按钮标题
     * @param {string} [callbackFn] - 回调函数(字符串形式)，参数为mainButtonClicked
     */
    window.showConfirmationMessage = function(content, title, mainButtonTitle, buttonTitle, callbackFn) {
        let apiCall = `eda.sys_Dialog.showConfirmationMessage('${escapeQuote(content)}'`;
        
        if (title !== undefined) apiCall += `, '${escapeQuote(title)}'`;
        if (mainButtonTitle !== undefined) apiCall += `, '${escapeQuote(mainButtonTitle)}'`;
        if (buttonTitle !== undefined) apiCall += `, '${escapeQuote(buttonTitle)}'`;
        if (callbackFn !== undefined) apiCall += `, '${escapeQuote(callbackFn)}'`;
        
        apiCall += ')';
        executeApiCall(apiCall);
    };

    /**
     * 显示信息对话框
     * 对应API: eda.sys_Dialog.showInformationMessage
     * @param {string} content - 消息文本，支持\n换行
     * @param {string} [title] - 弹出窗口标题
     * @param {string} [buttonTitle] - 按钮标题，为空则不显示
     */
    window.showInformationMessage = function(content, title, buttonTitle) {
        let apiCall = `eda.sys_Dialog.showInformationMessage('${escapeQuote(content)}'`;
        
        if (title !== undefined) apiCall += `, '${escapeQuote(title)}'`;
        if (buttonTitle !== undefined) apiCall += `, '${escapeQuote(buttonTitle)}'`;
        
        apiCall += ')';
        executeApiCall(apiCall);
    };

    /**
     * 显示输入对话框
     * 对应API: eda.sys_Dialog.showInputDialog
     * @param {string} [beforeContent] - 输入框上方文字
     * @param {string} [afterContent] - 输入框下方文字
     * @param {string} [title] - 弹出窗口标题
     * @param {string} [type] - 输入框类型: color|date|datetime-local|email|mouth|number|password|tel|text|time|url|week
     * @param {string|number} [value] - 输入框默认值
     * @param {object} [otherProperty] - 其它HTML input属性对象
     * @param {string} [callbackFn] - 回调函数(字符串形式)，参数为用户输入的值
     */
    window.showInputDialog = function(beforeContent, afterContent, title, type, value, otherProperty, callbackFn) {
        let apiCall = `eda.sys_Dialog.showInputDialog('${escapeQuote(beforeContent || '')}'`;
        
        if (afterContent !== undefined) apiCall += `, '${escapeQuote(afterContent)}'`;
        if (title !== undefined) apiCall += `, '${escapeQuote(title)}'`;
        if (type !== undefined) apiCall += `, '${type}'`;
        if (value !== undefined) apiCall += `, '${escapeQuote(String(value))}'`;
        if (otherProperty !== undefined) apiCall += `, ${toJsonParam(otherProperty)}`;
        if (callbackFn !== undefined) apiCall += `, '${escapeQuote(callbackFn)}'`;
        
        apiCall += ')';
        executeApiCall(apiCall);
    };

    /**
     * 显示单选选择对话框
     * 对应API: eda.sys_Dialog.showSelectDialog (单选模式)
     * @param {array|object} options - 选项列表，字符串数组或对象数组
     * @param {string} [beforeContent] - 选择框上方文字
     * @param {string} [afterContent] - 选择框下方文字
     * @param {string} [title] - 选择框标题
     * @param {string} [defaultOption] - 默认选项值
     * @param {string} [callbackFn] - 回调函数(字符串形式)，参数为选中的值
     */
    window.showSelectDialog = function(options, beforeContent, afterContent, title, defaultOption, callbackFn) {
        let optionsStr;
        if (Array.isArray(options)) {
            if (options.length > 0 && typeof options[0] === 'object') {
                optionsStr = toJsonParam(options);
            } else {
                optionsStr = toJsonParam(options);
            }
        } else {
            optionsStr = toJsonParam([options]);
        }
        
        let apiCall = `eda.sys_Dialog.showSelectDialog(${optionsStr}`;
        
        if (beforeContent !== undefined) apiCall += `, '${escapeQuote(beforeContent)}'`;
        if (afterContent !== undefined) apiCall += `, '${escapeQuote(afterContent)}'`;
        if (title !== undefined) apiCall += `, '${escapeQuote(title)}'`;
        if (defaultOption !== undefined) apiCall += `, '${escapeQuote(defaultOption)}'`;
        if (callbackFn !== undefined) apiCall += `, '${escapeQuote(callbackFn)}'`;
        
        apiCall += ')';
        executeApiCall(apiCall);
    };

    /**
     * 显示多选选择对话框
     * 对应API: eda.sys_Dialog.showSelectDialog (多选模式)
     * @param {array|object} options - 选项列表
     * @param {string} [beforeContent] - 选择框上方文字
     * @param {string} [afterContent] - 选择框下方文字
     * @param {string} [title] - 选择框标题
     * @param {array} [defaultOption] - 默认选项数组
     * @param {string} [callbackFn] - 回调函数(字符串形式)，参数为选中的值数组
     */
    window.showSelectDialogMulti = function(options, beforeContent, afterContent, title, defaultOption, callbackFn) {
        let optionsStr;
        if (Array.isArray(options)) {
            optionsStr = toJsonParam(options);
        } else {
            optionsStr = toJsonParam([options]);
        }
        
        let apiCall = `eda.sys_Dialog.showSelectDialog(${optionsStr}`;
        
        if (beforeContent !== undefined) apiCall += `, '${escapeQuote(beforeContent)}'`;
        if (afterContent !== undefined) apiCall += `, '${escapeQuote(afterContent)}'`;
        if (title !== undefined) apiCall += `, '${escapeQuote(title)}'`;
        if (defaultOption !== undefined) apiCall += `, ${toJsonParam(defaultOption)}`;
        
        apiCall += `, true`; // 多选模式
        
        if (callbackFn !== undefined) apiCall += `, '${escapeQuote(callbackFn)}'`;
        
        apiCall += ')';
        executeApiCall(apiCall);
    };

    // ============================================
    // P1 - 日志类 (5个方法)
    // ============================================

    /**
     * 添加日志条目
     * 对应API: eda.sys_Log.add
     * @param {string} message - 日志内容
     * @param {string} [type] - 日志类型: info|warn|error|fatalError
     */
    window.logAdd = function(message, type) {
        type = type || 'info';
        let apiCall = `eda.sys_Log.add('${escapeQuote(message)}', '${type}')`;
        executeApiCall(apiCall);
    };

    /**
     * 清空日志
     * 对应API: eda.sys_Log.clear
     */
    window.logClear = function() {
        executeApiCall('eda.sys_Log.clear()');
    };

    /**
     * 导出日志
     * 对应API: eda.sys_Log.export
     * @param {string|array} [types] - 日志类型，可为单个或数组
     */
    window.logExport = function(types) {
        let apiCall = `eda.sys_Log.export('${types}')`;
        executeApiCall(apiCall);
    };

    /**
     * 查找日志条目
     * 对应API: eda.sys_Log.find
     * @param {string|array} message - 查找内容
     * @param {string|array} [types] - 日志类型筛选
     */
    window.logFind = function(message, types) {
        let apiCall = `eda.sys_Log.find('${escapeQuote(message)}'`;
        if (types !== undefined) {
            apiCall += `, '${escapeQuote(types)}'`;
        }
        apiCall += ')';
        executeApiCall(apiCall);
    };

    /**
     * 筛选并获取日志条目
     * 对应API: eda.sys_Log.sort
     * @param {string|array} [types] - 日志类型
     */
    window.logSort = function(types) {
        let apiCall = `eda.sys_Log.sort()`;
        if (types !== undefined) {
            apiCall = `eda.sys_Log.sort('${escapeQuote(types)}')`;
        }
        executeApiCall(apiCall);
    };

    // ============================================
    // P1 - 面板控制类 (12个方法)
    // ============================================

    /**
     * 打开左侧面板
     * 对应API: eda.sys_PanelControl.openLeftPanel
     * @param {string} [tab] - 标签页: basicLibrary|device-standardization|libDesign|projectDesign|project_list
     */
    window.openLeftPanel = function(tab) {
        let apiCall = `eda.sys_PanelControl.openLeftPanel()`;
        if (tab !== undefined) {
            apiCall = `eda.sys_PanelControl.openLeftPanel('${tab}')`;
        }
        executeApiCall(apiCall);
    };

    /**
     * 关闭左侧面板
     * 对应API: eda.sys_PanelControl.closeLeftPanel
     */
    window.closeLeftPanel = function() {
        executeApiCall('eda.sys_PanelControl.closeLeftPanel()');
    };

    /**
     * 打开右侧面板
     * 对应API: eda.sys_PanelControl.openRightPanel
     * @param {string} [tab] - 标签页: annotation|pcb-attr|pcb-filter|pcb-layer|sch-attr|sch-filter等
     */
    window.openRightPanel = function(tab) {
        let apiCall = `eda.sys_PanelControl.openRightPanel()`;
        if (tab !== undefined) {
            apiCall = `eda.sys_PanelControl.openRightPanel('${tab}')`;
        }
        executeApiCall(apiCall);
    };

    /**
     * 关闭右侧面板
     * 对应API: eda.sys_PanelControl.closeRightPanel
     */
    window.closeRightPanel = function() {
        executeApiCall('eda.sys_PanelControl.closeRightPanel()');
    };

    /**
     * 打开底部面板
     * 对应API: eda.sys_PanelControl.openBottomPanel
     * @param {string} [tab] - 标签页: findResult|library|log|drcResult|schDrcResult
     */
    window.openBottomPanel = function(tab) {
        let apiCall = `eda.sys_PanelControl.openBottomPanel()`;
        if (tab !== undefined) {
            apiCall = `eda.sys_PanelControl.openBottomPanel('${tab}')`;
        }
        executeApiCall(apiCall);
    };

    /**
     * 关闭底部面板
     * 对应API: eda.sys_PanelControl.closeBottomPanel
     */
    window.closeBottomPanel = function() {
        executeApiCall('eda.sys_PanelControl.closeBottomPanel()');
    };

    /**
     * 切换左侧面板锁定状态
     * 对应API: eda.sys_PanelControl.toggleLeftPanelLockState
     * @param {boolean} [state] - 是否锁定，不传则反置当前状态
     */
    window.toggleLeftPanelLock = function(state) {
        let apiCall = `eda.sys_PanelControl.toggleLeftPanelLockState()`;
        if (state !== undefined) {
            apiCall = `eda.sys_PanelControl.toggleLeftPanelLockState(${state})`;
        }
        executeApiCall(apiCall);
    };

    /**
     * 切换右侧面板锁定状态
     * 对应API: eda.sys_PanelControl.toggleRightPanelLockState
     * @param {boolean} [state] - 是否锁定，不传则反置当前状态
     */
    window.toggleRightPanelLock = function(state) {
        let apiCall = `eda.sys_PanelControl.toggleRightPanelLockState()`;
        if (state !== undefined) {
            apiCall = `eda.sys_PanelControl.toggleRightPanelLockState(${state})`;
        }
        executeApiCall(apiCall);
    };

    /**
     * 切换底部面板锁定状态
     * 对应API: eda.sys_PanelControl.toggleBottomPanelLockState
     * @param {boolean} [state] - 是否锁定，不传则反置当前状态
     */
    window.toggleBottomPanelLock = function(state) {
        let apiCall = `eda.sys_PanelControl.toggleBottomPanelLockState()`;
        if (state !== undefined) {
            apiCall = `eda.sys_PanelControl.toggleBottomPanelLockState(${state})`;
        }
        executeApiCall(apiCall);
    };

    /**
     * 查询左侧面板是否已锁定
     * 对应API: eda.sys_PanelControl.isLeftPanelLocked
     */
    window.isLeftPanelLocked = function() {
        // 注意：此API返回Promise，但通过onclick调用无法获取返回值
        // 如需获取返回值，建议直接使用eda.sys_PanelControl.isLeftPanelLocked()
        executeApiCall('eda.sys_PanelControl.isLeftPanelLocked()');
    };

    /**
     * 查询右侧面板是否已锁定
     * 对应API: eda.sys_PanelControl.isRightPanelLocked
     */
    window.isRightPanelLocked = function() {
        executeApiCall('eda.sys_PanelControl.isRightPanelLocked()');
    };

    /**
     * 查询底部面板是否已锁定
     * 对应API: eda.sys_PanelControl.isBottomPanelLocked
     */
    window.isBottomPanelLocked = function() {
        executeApiCall('eda.sys_PanelControl.isBottomPanelLocked()');
    };

    // ============================================
    // P1 - 存储类 (6个方法)
    // ============================================

    /**
     * 设置扩展用户配置
     * 对应API: eda.sys_Storage.setExtensionUserConfig
     * @param {string} key - 配置项键名
     * @param {any} value - 配置值
     */
    window.setConfig = function(key, value) {
        let apiCall = `eda.sys_Storage.setExtensionUserConfig('${escapeQuote(key)}', ${toJsonParam(value)})`;
        executeApiCall(apiCall);
    };

    /**
     * 获取扩展用户配置
     * 对应API: eda.sys_Storage.getExtensionUserConfig
     * @param {string} key - 配置项键名
     * @returns {any} 配置值，不存在返回undefined
     */
    window.getConfig = function(key) {
        // 注意：通过onclick无法获取返回值，如需返回值建议直接调用eda API
        let apiCall = `eda.sys_Storage.getExtensionUserConfig('${escapeQuote(key)}')`;
        executeApiCall(apiCall);
    };

    /**
     * 删除扩展用户配置
     * 对应API: eda.sys_Storage.deleteExtensionUserConfig
     * @param {string} key - 配置项键名
     */
    window.deleteConfig = function(key) {
        let apiCall = `eda.sys_Storage.deleteExtensionUserConfig('${escapeQuote(key)}')`;
        executeApiCall(apiCall);
    };

    /**
     * 设置所有扩展用户配置
     * 对应API: eda.sys_Storage.setExtensionAllUserConfigs
     * @param {object} configs - 配置对象
     */
    window.setAllConfig = function(configs) {
        let apiCall = `eda.sys_Storage.setExtensionAllUserConfigs(${toJsonParam(configs)})`;
        executeApiCall(apiCall);
    };

    /**
     * 获取所有扩展用户配置
     * 对应API: eda.sys_Storage.getExtensionAllUserConfigs
     * @returns {object} 所有配置
     */
    window.getAllConfig = function() {
        executeApiCall('eda.sys_Storage.getExtensionAllUserConfigs()');
    };

    /**
     * 清除所有扩展用户配置
     * 对应API: eda.sys_Storage.clearExtensionAllUserConfigs
     */
    window.clearAllConfig = function() {
        executeApiCall('eda.sys_Storage.clearExtensionAllUserConfigs()');
    };

    // ============================================
    // 模块加载完成
    // ============================================
    
    console.log('[LCEDA_API_Translater] 已加载，共34个API封装函数');

})();
