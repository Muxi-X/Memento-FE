import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
interface AuthState {
  isLoggedIn: boolean;
  checkAuth: () => Promise<void>; 
  logout: () => Promise<void>; 
}

export const useAuthStore=create<AuthState>((set)=>({
    isLoggedIn:false,
    checkAuth:async ()=>{
        try{
            const token=await SecureStore.getItemAsync('access_token')
            if(token)
            {
                set({isLoggedIn:true})
            }
        }
        catch(error)
        {
            console.error('检查登陆状态失败',error)
            set({isLoggedIn:false})
        }
    },
    logout:async()=>{
        try{
            await SecureStore.deleteItemAsync('mytoken')
            set({isLoggedIn:false})
        }
        catch(error)
        {
            console.error('退出登录失败',error)
        }
    }
}))
