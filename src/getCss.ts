import defBase64 from './defBase64';
import version from './version';

/**
 * 通过配置获取样式文本
 *
 * @param {object} options 用户配置
 * @param {boolean} useFront 是否前景图
 * @returns {string}
 */
function getStyleByOptions(options: object, useFront: boolean) {
    let styleArr: string[] = [];
    for (let k in options) {
        // 在使用背景图时，排除掉 pointer-events
        if (!useFront && ~['pointer-events', 'z-index'].indexOf(k)) {
            continue;
        }

        if (options.hasOwnProperty(k)) {
            styleArr.push(`${k}:${options[k]}`);
        }
    }
    return styleArr.join(';') + ';';
}

/**
 * 生成css样式
 *
 * @export
 * @param {Array<string>} arr 图片数组
 * @param {any} [style={}] 自定义样式
 * @param {Array<any>} [styles=[]] 每个背景图的自定义样式
 * @param {boolean} [useFront=true] 是否用前景图
 * @returns
 */
export default function (arr: Array<string>, style = {}, styles = [], useFront = true) {
    const MIN_IMAGES = 6;
    let imgs = [];
    if (arr && arr.length) {
        for(let imgUrl of arr) {
            imgs.push(encodeURI(imgUrl) || 'none');
        }
    } else {
        imgs = defBase64;
    }

    let originalImageNum = imgs.length;
    if (MIN_IMAGES > originalImageNum) {
        for (let index = 0; index < MIN_IMAGES - originalImageNum; index++) {
            imgs.push(imgs[index]);
        }
    }

    let defStyle = getStyleByOptions(style, useFront); // 默认样式
    let [styel0, style1, style2] = [                   // 3个子项样式
        defStyle + getStyleByOptions(styles[0], useFront),
        defStyle + getStyleByOptions(styles[1], useFront),
        defStyle + getStyleByOptions(styles[2], useFront)
    ];

    // 在前景图时使用 ::after
    let frontContent = useFront ? '::after' : '::before';

    let content = `

/*css-background-start*/
/*background.ver.${version}*/

body.vscode-background [id="workbench.parts.editor"] .split-view-view:nth-child(3) .editor-container .overflow-guard>.monaco-scrollable-element${frontContent}{background-image:  url('${imgs[0]}');${styel0}}

body.vscode-background [id="workbench.parts.editor"] .split-view-view:nth-child(2) .editor-container .overflow-guard>.monaco-scrollable-element${frontContent}{background-image:  url('${imgs[1]}');${style1}}

body.vscode-background [id="workbench.parts.editor"] .split-view-view:nth-child(1) .editor-container .overflow-guard>.monaco-scrollable-element${frontContent}{background-image:  url('${imgs[2]}');${style2}}

body.vscode-background [id="workbench.parts.editor"] .split-view-view .editor-container .overflow-guard>.monaco-scrollable-element>.monaco-editor-background{background: none;}

body.vscode-background .monaco-workbench .part.panel:after {
    content: '';
    background: url('${imgs[3]}') no-repeat;
    background-size: contain;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    right: 0px;
    background-position: right;
    opacity: 0.2;
    pointer-events: none;
}

/* side bar */
body.vscode-background .explorer-folders-view:after{
    content: '';
    background: url("${imgs[4]}") no-repeat;
    background-size: contain;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    right: 0px;
    background-position: bottom;
    opacity: 0.12;
    pointer-events: none;
}

/* start screen */
body.vscode-background .welcomePageContainer:after {
    content: '';
    background: url('${imgs[6]}') no-repeat;
    background-size: contain;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    right: 0px;
    background-position: bottom;
    opacity: 0.12;
    pointer-events: none;
}

/*css-background-end*/
`;

    return content;
}
