import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from "hono/jwt";
import { JWTPayload } from 'hono/utils/jwt/types';
import { signupInput, signinInput } from "@saitejapendram/medium-common3";

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	},
  Variables : {
    userId : string
  }
}>();

userRouter.post("/signup", async (c) => {
    const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate())
    console.log("signup start");
    
    const body = await c.req.json();
    console.log(body.email);
    console.log(body.password);
    console.log(body.name);
    const { success } = signupInput.safeParse(body)

    if (!success) {
      
      return c.json({message: "Invalid input"}, 411);
    }
    
  
    const response = await prisma.user.create({
      data : {
          email : body.email,
          password : body.password
      }
    })
    

    /*const secret = c.env?.JWT_SECRET;
    if (typeof secret !== 'string' || secret.length === 0) {
      throw new Error('JWT secret is not valid');
    }

    const token = sign({ id: response.id }, secret);
    return c.json({message:"successfull"});*/

    //return c.json(response);
    const token = await sign({id: response.id}, c.env?.JWT_SECRET);
    console.log(response);
    return c.json({
             token: token,
             id : response.id
            });



})

userRouter.post("/signin", async (c) => {
    const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("signin start");
    
    const body = await c.req.json();
    //add name as optional common file
    const { success } = signinInput.safeParse(body)

    if (!success) {
      
      return c.json({message: "Invalid input"}, 411);
    }

    
      const user = await prisma.user.findUnique({
        where : {
          email : body.email,
          password : body.password
        }
      })
      if (!user) {
        return c.json({massage: "Invalid user"});

      }

      const token = await sign({id : user.id}, c.env?.JWT_SECRET);
      console.log("signin end");
      return c.json({
               token: token,
               id : user.id
               });

      
    


})

userRouter.get("/user", async(c) => {
    const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("get user start");

    const id = c.req.query('id');
    const user = await prisma.user.findUnique({
      where : {
        id : id
      }
    })
    return c.json(user);

})

userRouter.get("/allUsers", async (c) => {
    const prisma = new PrismaClient({
       datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("get all users start");

    const users = await prisma.user.findMany({});
    return c.json({users:users})



})

userRouter.get("/deleteUsers", async (c) => {
  const prisma = new PrismaClient({
     datasourceUrl: c.env?.DATABASE_URL
  }).$extends(withAccelerate());
  console.log("get all users start");

  const users = await prisma.user.deleteMany({});
  return c.json({users:users})



})

