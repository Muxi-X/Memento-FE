import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
const service = axios.create(
    {
        baseURL: 'http://47.104.25.166:8080',
        timeout: 5000
    }
)
// service.interceptors.request.use(
//     config => {
//         const token = SecureStore.getItemAsync('mytoken');
//         if (token) {
//             config.headers['X-Request-ID'] = token
//         }
//         return config;
//     },
//     error => {
//         return Promise.reject(error)
//     }
// )
export default service