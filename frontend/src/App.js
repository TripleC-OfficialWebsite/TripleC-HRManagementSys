import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import LogIn from "./Pages/LogIn/LogIn";
import Manage from "./Pages/Manage/Manage";
import Add from "./Pages/Add/Add";
import MemberDetails from "./Pages/Manage/MemberDetail";
import ProjectContainer from "./Pages/ManageProject/ProjectContainer";

import "./styles/Add.css";
import ProjectModifier from "./Pages/ManageProject/ProjectModifier";

function App() {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<LogIn />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/add" element={<Add />} />
        <Route path="/add/:name/:disabled" element={<Add />} />
        <Route path="/manage/memberdetails/:name" element={<MemberDetails />} />
        <Route path="/project" element={<ProjectContainer />} />
        <Route path="/projectModify" element={<ProjectModifier />} />
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
