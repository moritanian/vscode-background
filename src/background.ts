import * as path from 'path';
import * as fs from 'fs';

import * as vscode from 'vscode';

import vsHelp from './vsHelp';
import vscodePath from './vscodePath';
import version from './version';
import getCss from './getCss';
import getJs from './getJs';
import getIP from './getIp';

/**
 * 文件类型
 *
 * @enum {number}
 */
enum FileType {
    /**
     * 未修改的css文件
     */
    empty,
    /**
     * hack 过的旧版本css文件
     */
    isOld,
    /**
     * hack 过的新版本的css文件
     */
    isNew
}

/**
 * 插件逻辑类
 *
 * @export
 * @class Background
 */
class Background {

    //#region private fields 私有字段

    /**
     * 当前用户配置
     *
     * @private
     * @type {*}
     * @memberof Background
     */
    private config: any = vscode.workspace.getConfiguration('safetyBackground');

    //#endregion

    //#region private methods 私有方法

    /**
     * 获取 css 文件内容
     *
     * @private
     * @returns {string}
     * @memberof Background
     */
    private getCssContent(): string {
        return fs.readFileSync(vscodePath.cssPath, 'utf-8');
    }

    /**
     * 设置 css 文件内容
     *
     * @private
     * @param {string} content
     * @memberof Background
     */
    private saveCssContent(content: string): void {
        fs.writeFileSync(vscodePath.cssPath, content, 'utf-8');
    }

      /**
     * get js content
     *
     * @private
     * @returns {string}
     * @memberof Background
     */
    private getJsContent(): string {
        return fs.readFileSync(vscodePath.jsPath, 'utf-8');
    }

    /**
     * save js content
     *
     * @private
     * @param {string} content
     * @memberof Background
     */
    private saveJsContent(content: string): void {
        fs.writeFileSync(vscodePath.jsPath, content, 'utf-8');
    }

    /**
     * 初始化
     *
     * @private
     * @memberof Background
     */
    private initialize(): void {

        let firstload = this.checkFirstload();  // 是否初次加载插件

        let fileType = this.getFileType(); // css 文件目前状态

        let safety: boolean = false;

        getIP().then((ip: string) => {
            // check current IP is safety?
            safety = (this.getSafetyIPList() || []).indexOf(ip) !== -1;
            if (!safety && fileType != FileType.empty) {
                this.uninstall();
                // vscode.commands.executeCommand('workbench.action.reloadWindow');
            } else if (firstload || fileType == FileType.isOld || fileType == FileType.empty) {
                this.install(true);
            }
        }).catch((e) => {
            console.error(e);
        })

    }

    private getConfigContent(): {firstload: boolean, safetyIPList: string[]} {
        const configPath = path.join(__dirname, '../assets/config.json');
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }

    private saveConfigContent(content: object) {
        const configPath = path.join(__dirname, '../assets/config.json');
        fs.writeFileSync(configPath, JSON.stringify(content, null, '    '), 'utf-8');
    }



    /**
     * 检测是否初次加载，并在初次加载的时候提示用户
     *
     * @private
     * @returns {boolean} 是否初次加载
     * @memberof Background
     */
    private checkFirstload(): boolean {
        let info: { firstload: boolean } = this.getConfigContent();

        if (info.firstload) {
            // 提示
            vsHelp.showInfo('Welcome to use background! U can config it in settings.json.')
            // 标识插件已启动过
            info.firstload = false;
            this.saveConfigContent(info);

            return true;
        }

        return false;
    }

    private getSafetyIPList(): string[] {
        return this.config.safetyIPList;
    }

    /**
     * 获取css文件状态
     *
     * @private
     * @returns {FileType}
     * @memberof Background
     */
    private getFileType(): FileType {
        let cssContent = this.getCssContent();

        // 未 hack 过
        let ifUnInstall: boolean = !~cssContent.indexOf(`background.ver`);

        if (ifUnInstall) {
            return FileType.empty;
        }

        // hack 过的旧版本
        let ifVerOld: boolean = !~cssContent.indexOf(`/*background.ver.${version}*/`);

        if (ifVerOld) {
            fs.writeFileSync(path.join(__dirname, '../xxx.css'), cssContent, 'utf-8');
            return FileType.isOld;
        }

        // hack 过的新版本
        return FileType.isNew;
    }

    /**
     * 安装插件，hack css
     *
     * @private
     * @param {boolean} [refresh] 需要更新
     * @returns {void}
     * @memberof Background
     */
    private install(refresh?: boolean): void {

        let lastConfig = this.config;  // 之前的配置
        let config = vscode.workspace.getConfiguration('safetyBackground'); // 当前用户配置

        // 1.如果配置文件改变到时候，当前插件配置没有改变，则返回
        if (!refresh && JSON.stringify(lastConfig) == JSON.stringify(config)) {
            // console.log('配置文件未改变.')
            return;
        }

        // 之后操作有两种：1.初次加载  2.配置文件改变

        // 2.两次配置均为，未启动插件
        if (!lastConfig.enabled && !config.enabled) {
            // console.log('两次配置均为，未启动插件');
            return;
        }

        // 3.保存当前配置
        this.config = config; // 更新配置

        // 4.如果关闭插件
        if (!config.enabled) {
            this.uninstall();
            vsHelp.showInfoRestart('Background has been uninstalled! Please restart.');
            return;
        }

        // 5.hack 样式
        let arr = []; // 默认图片

        if (!config.useDefault) { // 自定义图片
            arr = config.customImages;
        }

        // 自定义的样式内容
        let content = getCss(arr, config.style, config.styles, config.useFront).replace(/\s*$/, ''); // 去除末尾空白

        // 添加到原有样式(尝试删除旧样式)中
        let cssContent = this.getCssContent();
        cssContent = this.clearCssContent(cssContent);
        cssContent += content;

        this.saveCssContent(cssContent);

        let jsBackgroundContent = getJs(this.getSafetyIPList());
        let jsContent = this.getJsContent();
        jsContent = this.clearJsContent(jsContent);
        jsContent += jsBackgroundContent;
        this.saveJsContent(jsContent);

        vsHelp.showInfoRestart('Safety-Background has been changed! Please restart.');

    }

    /**
     * 卸载
     *
     * @private
     * @memberof Background
     */
    private uninstall(): boolean {
        try {
            let content = this.getCssContent();
            content = this.clearCssContent(content);
            this.saveCssContent(content);
            return true;
        }
        catch (ex) {
            console.log(ex);
            return false;
        }
    }

    /**
     * 清理css中的添加项
     *
     * @private
     * @param {string} content
     * @returns {string}
     * @memberof Background
     */
    private clearCssContent(content: string): string {
        content = content.replace(/\/\*css-background-start\*\/[\s\S]*?\/\*css-background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        return content;
    }

     /**
     * clear js content
     *
     * @private
     * @param {string} content
     * @returns {string}
     * @memberof Background
     */
    private clearJsContent(content: string): string {
        content = content.replace(/\/\*js-background-start\*\/[\s\S]*?\/\*js-background-end\*\//g, '');
        content = content.replace(/\s*$/, '');
        return content;
    }

    //#endregion

    //#region public methods

    /**
     * 初始化，并开始监听配置文件改变
     *
     * @returns {vscode.Disposable}
     * @memberof Background
     */
    public watch(): vscode.Disposable {
        this.initialize();
        return vscode.workspace.onDidChangeConfiguration(() => this.install());
    }

    //#endregion
}

export default new Background();
