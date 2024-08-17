import { useRecoilValue } from "recoil"
import { userIdAtom } from "../store/atom"
import { useEffect, useState } from "react";
import axios from "axios";
import { BlogCard } from "./BlogCard";

interface BlogType {
    authorId : string,
    title: string,
    content : string,
    published? : boolean,
    id : string,
    authorName :string,
    createdAt : Date
}

export const UserBlog = () => {
    const userId = useRecoilValue(userIdAtom);
    const [blogs, setBlogs] = useState<BlogType[]>([])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://127.0.0.1:8787/api/v1/blog/userBlogs?id=${userId}`,
                {
                    headers : {
                        'Authorization' : "Bearer " + localStorage.getItem("token")
                    }
                }
            );
            if (!res.data.blogs) {
                return alert("Error occured while fetching user blogs!")
            }
            setBlogs(res.data.blogs);


        }
        fetchUser();

    },[])
    return (
        <div>
            {blogs && blogs.map((blog) => (
                <BlogCard id={blog.id} authorName={blog.authorName} title={blog.title} content={blog.content} publishedDate={"07-07-2024"} createdAt={blog.createdAt}/>
            ))}

        </div>
    )
}