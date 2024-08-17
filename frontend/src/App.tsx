import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { AddBlog } from "./components/AddBlog";
import { UpdateBlog } from "./components/UpdateBlog";
import { RecoilRoot } from "recoil";
import { Navbar } from "./components/Navbar";
import { UserBlog } from "./components/UserBlog";

function App() {
  

  return (
    <>
    <RecoilRoot>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/signup"  element={<Signup/>}/>
          <Route path="/signin"  element={<Signin/>}/>
          <Route path="/userBlog"  element={<UserBlog />}/>
          <Route path="/blogs" element={<Blogs />}/>
          <Route path="/updateBlog" element={<UpdateBlog />}/>
          <Route path="/addBlog" element={<AddBlog />}/>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>  
    </>
  )
}

export default App
