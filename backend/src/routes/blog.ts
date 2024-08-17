import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import { JWTPayload } from 'hono/utils/jwt/types';
import { postInput, postUpdateInput } from '@saitejapendram/medium-common3';

export const blogRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	},
  Variables : {
    userId : string
    id : string
  }
}>();

blogRouter.use("*", async (c, next) => {
    const header = await c.req.header('Authorization');
    if (!header) {
      c.status(401);
      return c.json({message: "unauthorized user"});
    }
  
    const token = header.split(' ')[1];
      const payload = await verify(token, c.env.JWT_SECRET) as JWTPayload;
      if (!payload) {
          c.status(401);
          return c.json({ error: "unauthorized" });
      }
      c.set('userId', payload.id as string);
      await next()
  })

  blogRouter.post("/blog", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("post blog start");

    const userId = c.get("userId");
    const body = await c.req.json();

    const { success } = postInput.safeParse(body);

    if (!success) {
        return c.json({message:"Invalid input"}, 411);
    }

    try {
        const blog = await prisma.post.create({
            data : {
                title : body.title,
                content : body.content,
                authorId : userId
            }
        })

        c.status(200);
        console.log("post blog end");
        return c.json({id : blog.id})

    } catch(e) {
        c.status(411);
        return c.json({message:"error while creating new blog"})
    }



  })
  
  blogRouter.put("/blog", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("put blog start");

    const body = await c.req.json();

    const { success } = postUpdateInput.safeParse(body);

    if (!success) {
        return c.json({message:"Invalid input"}, 411);
    }

    const blog = await prisma.post.findUnique({
        where : {
            id : body.id 
        }
    })
    if (!blog) {
        c.status(411);
        return c.json({message: "post not existed"});
    }

    const post = await prisma.post.update({
        where : {
            id :  body.id
        },
        data : body
    })

    c.status(200);
    console.log("put blog end");
    return c.json({post : post});
    
  })
  
  blogRouter.put("/blogDelete", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("delete blog start");

    const id = c.req.query('id');
    try {
        const post = await prisma.post.delete({
            where : {
                id : id
            }
        })
        console.log(post);
        console.log("delete blog end");
        return c.json({post:post});

    } catch(e) {
        c.status(411);
        console.log(e);
        return c.json({error: e});
    }

    

  })
  blogRouter.get("/blogs", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("get blog start");

    const id = c.req.query('id');
    //id = '38fa24ac-b92d-4805-b35a-49aa0e20c0f6'
    const post = await prisma.post.findUnique({
        where : {
            id : id
        }
    })
    if (!post) {
        return c.text("post not available")
    }

    console.log("get blog end");
    return c.json({id : post.id});
    
  })
  
  blogRouter.get("/bulk", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("get bulk start");

    const posts = await prisma.post.findMany({});
    console.log(posts);

    const allPosts = await Promise.all(posts.map(async (post) => {
        let user = await prisma.user.findUnique({
            where : {
                id : post.authorId
            }
        })

        return {
            id : post.id,
            title : post.title,
            content : post.content,
            authorId : post.authorId,
            authorName : user?.email,
            published : post.published,
            createdAt : post.createdAt,
            updatedAt : post.updatedAt
        }

    }))

     
    c.status(200);
    console.log(allPosts);
    console.log("get bulk end");
    return c.json(allPosts);
    
  })

  blogRouter.get("userBlogs" , async(c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    console.log("get user blog start");

    const id = c.req.query('id');

    const res = await prisma.post.findMany({
        where : {
            authorId : id
        }
    });

    const blogs = await Promise.all(res.map(async (post) => {
        let user = await prisma.user.findUnique({
            where : {
                id : post.authorId
            }
        })

        return {
            id : post.id,
            title : post.title,
            content : post.content,
            authorId : post.authorId,
            authorName : user?.email,
            published : post.published,
            createdAt : post.createdAt,
            updatedAt : post.updatedAt
        }

    }))
    return c.json({blogs : blogs});

  })