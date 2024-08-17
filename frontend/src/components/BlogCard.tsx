import { useSetRecoilState } from "recoil";
import { changeBlog, updateBlogId } from "../store/atom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

interface BlogCardProps {
    id:string,
    authorName : string;
    title : string;
    content : string;
    publishedDate : string,
    createdAt: Date,
    
    
}

/**
 * 
 * 
    authorName,
    title,
    content,
    publishedDate
} : BlogCardProps
 */

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate,
    createdAt,

} : BlogCardProps) => {
    const setUpdateId = useSetRecoilState(updateBlogId);
    const navigate = useNavigate();
    const setChangeblog = useSetRecoilState(changeBlog);
    const [date, setDate] = useState('');
    const handleEdit = async () => {
        console.log(id);
        setUpdateId(id);
        navigate("/updateBlog")

    }

    useEffect(() => {
        const newDate = new Date(createdAt);
        const formattedDate = newDate.toLocaleDateString('en-GB');
        setDate(formattedDate);

    },[id])

    const handleDelete = async () => {
        const res = await axios.put(`http://127.0.0.1:8787/api/v1/blog/blogDelete?id=${id}`,
            {},
            
            {
                headers : {
                    'Authorization' : "Bearer " + localStorage.getItem('token')
                }
            }
        );
        if (!res.data.post) {
            return alert("Error while deleting blog");
        }
        setChangeblog(e => !e);
        navigate("/blogs");
    }

    /*
    const handleDelete = async () => {
        const resposne = await axios.
    }
    */

    return (
        <div className="bg-slate-200 grid grid-cols-3 m-12 border shadow-xl rounded">
            <div className="col-span-2 p-8">
                 <div className="text-3xl font-bold text-black pr-12">{title}</div>
                 <div className="text-slate-400 font-normal text-lg my-2">{date}</div>
                 <div className="text-slate-800 font-normal text-lg pr-10">{content}</div>
                 <div className="flex gap-8">
                     <button className="px-2 py-1 border border-black rounded shadow-lg mt-4 w-24 text-center" onClick={handleDelete}>Delete</button>
                     <button className="px-6 py-1 border border-black rounded shadow-lg mt-4  text-center" onClick={handleEdit}>Edit</button>
                 </div>
                 
            </div>
            <div className=" ">
                 <div className="text-lg font-normal text-black mt-2">author</div>
                 <div className="font-bold text-xl text-black pl-8 my-2">{authorName}</div>
                 <div className="font-normal text-slate-400 text-lg pl-8">Description</div>
            </div>
        </div>
    )
}