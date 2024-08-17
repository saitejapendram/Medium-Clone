import { atom } from "recoil";

export const updateBlogId = atom({
    key : "updateBlogId",
    default : ''
})

export const changeBlog = atom({
    key : "changeBlog",
    default :true
})

export const loginAtom = atom({
    key : "loginAtom",
    default : 'signout'
})

export const userIdAtom = atom({
    key : "userIdAtom",
    default : ""
}) 