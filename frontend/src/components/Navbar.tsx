import { useRecoilState } from "recoil"
import { loginAtom } from "../store/atom"
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const [credential, setCredential] = useRecoilState(loginAtom);
    const navigate = useNavigate()

    const handleDashboard = async () => {
        if (credential === "signout") {
            navigate("/signin")
        }
        else {
            navigate("/blogs");
        }

    }

    const handleBlogs = async () => {
        if (credential === "signout") {
            navigate("/signin")
        }
        else {
            navigate("/userBlog");
        }

    }

    const handlePublish = async () => {
        if (credential === "signout") {
            navigate("/signin")
        }
        else {
            navigate("/addBlog");
        }

    }

    const handleLogin = async () => {
        if (credential === "signout") {
            navigate("/signin")
        }
        else {
            localStorage.removeItem('token');
            setCredential('signout');
            navigate("/signin")

        }

    }
    return (
        <div className="bg-slate-200 static flex justify-between items-center px-12 h-20 border-b border-black shadow-lg">
            <div className="font-bold text-3xl text-black">
                MEDIUM
            </div>
            <div className="flex font-semibold text-black text-xl gap-4">
                 <button className="" onClick={handleDashboard}>
                      Dashboard
                 </button>
                 <button className="" onClick={handleBlogs}>
                      User Blogs
                 </button>
            </div>
            <div className="flex font-semibold text-black text-xl gap-4">
                <button className="px-3 border border-black rounded py-1 shadow-lg" onClick={handlePublish}>
                     Publish
                </button>
                <button className="font-bold px-3 border border-black rounded py-1 shadow-lg" onClick={handleLogin}>
                     {credential === "signin" ? "Sign out" : "Sign in"}
                </button>
            </div> 
            
        </div>
    )
}