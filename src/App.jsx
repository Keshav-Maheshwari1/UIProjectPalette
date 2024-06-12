import { Route, Routes } from "react-router-dom"
import Editor from "./pages/Editor"
import Home from "./pages/Home"
import Project from "./pages/Project"
import {AboutPage} from './pages/About'

const App = ()=> {

  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/editor" element={<Editor/>}/>
      <Route path="/project" element={<Project/>}/>
      <Route path="/know-us" element={<AboutPage/>}/>
    </Routes>
  )
}

export default App
