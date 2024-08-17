import { useEffect, useState } from "react"
import { BlogCard } from "../components/BlogCard"
import axios from "axios";
import { changeBlog } from "../store/atom";
import { useRecoilValue } from "recoil";

interface BlogType {
    authorId : string,
    title: string,
    content : string,
    published? : boolean,
    id : string,
    authorName :string,
    createdAt: Date,
    
}
export const Blogs = () => {
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const changeBlogV = useRecoilValue(changeBlog);

    useEffect(() => {
         const fetchBlogs = async () => {
            const response = await axios.get("http://127.0.0.1:8787/api/v1/blog/bulk", {
                headers : {
                    'Authorization' : "Bearer " + localStorage.getItem('token')
                }
            });
            console.log(response.data);
            setBlogs(response.data);
         } 
         fetchBlogs();    
    },[changeBlogV]);
    return (
        <div>
            {blogs.length > 0 && blogs.map((blog : BlogType) => {
                return <BlogCard 
                id={blog.id}
                
                title={blog.title}
                content={blog.content}
                publishedDate={"07-07-2024"}
                authorName={blog.authorName}
                createdAt={blog.createdAt}
                
             />
            }
            )

            }
            
        </div>
    )
}