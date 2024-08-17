import { z } from "zod";

export const signupInput = z.object({
    email : z.string().email(),
    name : z.string().optional(),
    password : z.string().min(5)
});

export const signinInput = z.object({
    email : z.string().email(),
    password : z.string().min(5)
});

export const postInput = z.object({
    title: z.string(),
    content : z.string()
});

export const postUpdateInput = z.object({
    title: z.string().optional(),
    content : z.string().optional()
});

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type PostInput = z.infer<typeof postInput>;
export type PostUpdateInput = z.infer<typeof postUpdateInput>