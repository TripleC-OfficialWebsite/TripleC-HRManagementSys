import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

//import LogIn from "./Pages/LogIn/LogIn";
import Manage from "./Pages/Manage/Manage";

function App() {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route>
        {/* <Route path="/" element={<LogIn />} />  */}
        <Route path="/" element={<Manage />} /> 
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
