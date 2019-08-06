# vscode-safety-background
[![Version](https://vsmarketplacebadge.apphb.com/version/moritanian.safety-background.svg)](https://vsmarketplacebadge.apphb.com/version/moritanian.safety-background.svg)


## Add a safety and lovely background-image to your vscode.

GitHub: [https://github.com/moritanian/vscode-background](https://github.com/moritanian/vscode-background)

Vscode Market: [https://marketplace.visualstudio.com/items?itemName=moritanian.safety-background](https://marketplace.visualstudio.com/items?itemName=moritanian.safety-background)


Setting a background image to the editor you normally use and turning it into a pain editor is a concern for many engineers, and each time a new editor appears, a method for setting a cute editor has been proposed. It's happy to be able to code with your favorite characters. However, when used in public places such as workplace or school, you would be gave cold look from othres. Therefore, I propose a safe editor that identifies the location used by global IP and displays a background image only when you are at home. This plugin supports that function.

![](https://raw.githubusercontent.com/moritanian/vscode-background/gh-pages/static/explanation.png)

## Warns：
>
> **This extension works by editting the vscode's css file.**
> So, a information appears while the first time to install or vscode update.U can click the [never show again] to avoid it.

![](https://raw.githubusercontent.com/moritanian/vscode-background/gh-pages/static/warning.png)

This is the reason:

![](https://user-images.githubusercontent.com/9987486/40583775-91d4c8d6-61c7-11e8-9048-8c5538a32399.png)

## Config

| Name                      |      Type       | Description                                                                                 |
| :------------------------ | :-------------: | :------------------------------------------------------------------------------------------ |
| `safetyBackground.enabled`      |    `Boolean`    | If background enabled.                                                    |
| `safetyBackground.safetyIPList` | `Array<String>` | IP address list to display background image.                              |
| `safetyBackground.useDefault`   |    `Boolean`    | If use default images.                                                |
| `safetyBackground.customImages` | `Array<String>` | Your Your custom Images(Max length is 3)                          |
| `safetyBackground.style`        |    `Object`     | Custom style                                                                |
| `safetyBackground.styles`       | `Array<Object>` | Style of each image.                                                |
| `safetyBackground.useFront`     |    `Boolean`    | `true`:On the top of code. `false`: Behind the code |

## Notice

You should use protocol **https** instead of **http** to the image,which is not support by vscode now.

## Uninstall

    Set the config  {"safetyBackground.enabled": false}  in settings.json,then uninstall the plugin.

### Q&A:

---

    Q:It seems that nothing happens after installing the extension?

    A:Make sure to have the administrator authority！！

---

    Q:How to get the administrator authority?

    A:In windows,click right button on the vscode's icon,then check the [run with the administrator authority].

---

In ubuntu:[https://github.com/shalldie/vscode-background/issues/6](https://github.com/shalldie/vscode-background/issues/6).

Press F1,and you can get it by enter **ext install background** in your vscode. (～￣ ▽ ￣)～
<br />
<br />

---

## Materials
Character images were generated in https://make.girls.moe/#/.

**Enjoy!**
