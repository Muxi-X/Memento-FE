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