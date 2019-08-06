import axios from 'axios';

const APIURL: string = 'https://api.ipify.org?format=json';
export default function getIP() {
  return axios.get(APIURL).then(res => {
    return res.data.ip
  })
}
