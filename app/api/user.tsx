import request from "./request";
import axios from "axios";
interface VerifyCodeData {
    email: string;
    code: string;
}
interface SignupData {
    signup_token:string,
    password:string,
}
interface resetData{
    reset_token:string,
    new_password:string
}
export const sendCode = (email:string)=>{
    return request(
        {
            url: "/v1/auth/signup/email/send_code",
            method: "POST",
            data: { email }
        }
    )
}
export const verifyCode = (data:VerifyCodeData)=>{
    return request(
        {
            url: "/v1/auth/signup/email/verify_code",
            method: "POST",
            data
        }
    )
}
export const signupComplete = (data:SignupData)=>{
    return request(
        {
            url:"/v1/auth/signup/complete",
            method:"POST",
            data
        }
    )
}
export const loginPwd = (email:string, password:string)=>{
    return request(
        {
            url:"/v1/auth/login/password",
            method:"POST",
            data:{email, password}
        }
    )
}
export const sendlogincode=(email:string)=>{
    return request(
        {
            url:"/v1/auth/login/email/send_code",
            method:"POST",
            data:{email}
        })
}
export const loginPhone = (email:string, code:string)=>{
    return request(
        {
            url:"/v1/auth/login/email/verify_code",
            method:"POST",
            data:{email, code}
        }
    )
}
export const resetSendcode=(email:string)=>{
    return request({
        url:"/v1/auth/password_reset/email/send_code",
        method:"POST",
        data:{email}
    })
}
export const verifyResetEmailCode=(email:string, code:string)=>{
    return request({
        url:"/v1/auth/password_reset/email/verify_code",
        method:"POST",
        data:{email, code}
    })
}
 export const resetComplete=(data:resetData)=>{
    return request({
        url:"/v1/auth/password_reset/complete",
        method:"POST",
        data
    })
}