import request from "./request";
export const getMedata = () => {
  return request({
    url: "/v1/me/home",
    method: "GET",
  });
};
export const updateMeNickname = (nickname: string) => {
  return request({
    url: "/v1/me/profile/nickname",
    method: "patch",
    data: {
      nickname: nickname,
    },
  });
};
export const updateMeAvatar = (avatar: string) => {
  return request({
    url: "/v1/me/profile/avatar",
    method: "patch",
    data: {
      avatar: avatar,
    },
  });}
export const getMeSetting = () => {
  return request({
    url: "/v1/me/settings",
    method: "GET",
  });
};
export const updatePublicable = (public_pool_enabled:boolean) => {
  return request({
    url:"/v1/me/settings/privacy",
    method:"PATCH",
    data:{
        public_pool_enabled:public_pool_enabled}
  });
};
export const updateMeNotificationSettings=(reaction_enabled:boolean,creation_reminder_enabled:boolean)=>{
    return request({
        url:"/v1/me/settings/notifications",
        method:"patch",
        data:{
            reaction_enabled:reaction_enabled,
            creation_reminder_enabled:creation_reminder_enabled
        }
    })
}
export const getNotificationslist = () => {
  return request({
    url: "/v1/me/notifications",
    method: "GET",
  });
};
export const getCustomKeywordList=()=>{
    return request({
        url:"/v1/custom-keywords",
        method:"GET"
    })
}
export  const addCustomKeyword=(keyword:string, target:number|null)=>{
    return request({
        url:"/v1/custom-keywords",
        method:"POST",
        data:{
            text:keyword,
            target:target
        }
    })
}
// export const getMeUnreadNotificationCount=()=>{
//     return request(
//         {
//             url:'/v1/me/notifications/unread-count',
//             method:'GET'
//         }
//     )
// } 没必要了，首页的通知数量已经显示了
