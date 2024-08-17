import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddBlog = () => {
    const [story, setStory] = useState('');
    const [title, setTitle] = useState('');
    const [authorId, setAuthorId] = useState('');
    const navigate = useNavigate();

    const handleClick = async () => {
        const response = await axios.post("http://127.0.0.1:8787/api/v1/blog/blog", {
            title,
            content : story
        }, {
            headers : {
                'Authorization' : "Bearer " + localStorage.getItem('token')
            }
        });
        if (!response.data.id) {
            return alert("Error occured while adding blog") 
        }
        navigate("/blogs")


    }
    return (
        <div className="flex m-16 p-12 ">
            <div className="mr-4">
                 <button className="px-4 py-1 border rounded shadow-lg" onClick={handleClick}>Add</button>  
            </div>
            <div className="">
                <div className="mb-4">
                    <input type="text" placeholder="Title....." className="text-3xl w-full" onChange={e => setTitle(e.target.value)}/>
                </div>
                <div className="">
                <textarea
                    placeholder="Tell your story......."
                    className="p-2"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    rows={5}
                    cols={100}
                />
                </div>
            </div>      
        </div>
    )
}