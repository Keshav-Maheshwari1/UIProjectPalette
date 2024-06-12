import { Route, Routes } from "react-router-dom"
import Editor from "./pages/Editor"
import Project from "./pages/Project"
import About from "./pages/About"
// import Project from "./pages/Project"

const App = ()=> {

  return (
    <Routes>
      <Route path="/" element={<Editor/>}  />
      <Route path="/project" element={<Project/>}/>
      <Route path="/know-us" element={<About/>}/>


    </Routes>
  )
}

export default App
