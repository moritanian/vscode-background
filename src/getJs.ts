import version from './version';

/**
 * generate js
 *
 * @export
 * @param {Array<string>} ipList ip string list
 * @returns string
 */
export default function (ipList: Array<string>) {

    const ipListStr: string = '"' + ipList.join('","') + '"';
    return `

/*js-background-start*/
/*background.ver.${version}*/
window.onload = async () => {
  const SAFETY_IPS = [${ipListStr}];
  const _class = 'vscode-background'

  function showBackground(){
      document.body.classList.add(_class);
  }

  function hideBackground() {
      document.body.classList.remove(_class);
  }

  async function checkSafety() {
      const APIURL = 'https://api.ipify.org?format=json';
      let response = await fetch(APIURL);
      let result = await response.json();
      let ip = result.ip;
      return SAFETY_IPS.indexOf(ip) !== -1;
  }

  if (await checkSafety()) {
      showBackground();
      console.log('show');
  }

  window.addEventListener("offline", function () {
       hideBackground();
  }, false);
 window.addEventListener("online", async function () {
      if(await checkSafety()) {
          showBackground();
      }
  }, false);
}
/*js-background-end*/
`
}