import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { loginAtom, userIdAtom } from "../store/atom";

export const Auth = ({type} : {type : "signup" | "signin"}) => {
    const [postInputs, setPostInputs] = useState({
        email : " ",
        name : " ",
        password : " "
    })
    const setCredential = useSetRecoilState(loginAtom);
    const setUserId = useSetRecoilState(userIdAtom);

    const navigate = useNavigate();

    async function handleRequest () {

      try {  
        const response = await axios.post(`http://127.0.0.1:8787/api/v1/user/${type === "signup" ? "signup" : "signin"}`, {
            email: postInputs.email,
            password: postInputs.password
        });
        const token = await response.data.token;
        if (!token) {
            alert("Error while signin");
            return ;
        }
        localStorage.setItem('token', token);
        setUserId(response.data.id);
        setPostInputs({...postInputs ,
            email : " ",
            name : " ",
            password : " " 
        })
        setCredential('signin');
        navigate("/blogs")
    } catch(e) {
        alert("error while signin");
    }
        


    }
    
    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                         Create an Account
                    </div>
                    <div className="mt-2 font-semibold text-slate-400">
                        {type === "signup" ? "Already have an account?" : "Don't have an account ?"}
                        <Link className="pl-2 underline" to={type === "signup" ? "/signin" : "/signup"}>
                              {type === "signup" ? "sign in" : "sign up"}
                        </Link>
                    </div> 
                </div>
                <div> 
                    <LabelledInput label={"Email"} placeholder={"Teja@gmail.com"} onChange={(e) => setPostInputs({...postInputs, email : e.target.value})}/>
                    {type === "signup" ? <LabelledInput label={"Username"} placeholder={"Teja"} onChange={(e) => setPostInputs({...postInputs, name : e.target.value})}/> : null}
                    <LabelledInput label={"Password"} type={"password"} placeholder={"12345"} onChange={(e) => setPostInputs({...postInputs, password : e.target.value})}/>
                    <button type="button" onClick={handleRequest} className="w-full pt-2 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "sign up" : "sign in"}</button>
    
                </div>
                  
            </div>
            
        </div>
    </div>
}

interface LabelInterface {
    label : string
    placeholder : string
    onChange : (e: ChangeEvent<HTMLInputElement>) => void
    type? : string

}


function LabelledInput({label, placeholder, onChange, type} : LabelInterface) {
    return <div>
           <label className="block mb-2 text-sm font-medium text-gray-900 font-semibold dark:text-white pt-2">{label}</label>
           <input type={type || "text"} onChange={onChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
    </div>

}