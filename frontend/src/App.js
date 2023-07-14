import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import LogIn from "./Pages/LogIn/LogIn";
import Manage from "./Pages/Manage/Manage";
import Add from "./Pages/Add/Add";

import "./styles/Add.css";
import MemberDetails from "./Pages/Manage/MemberDetails";

function App() {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route>
        {/* <Route path="/" element={<LogIn />} /> */}
        <Route path="/" element={<Manage />} />
        <Route path="/add" element={<Add />} />
        <Route path="/manage/memberdetails/:name" element={<MemberDetails />} />
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
