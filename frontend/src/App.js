import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import LogIn from "./Pages/LogIn/LogIn";
import Manage from "./Pages/Manage/Manage";
<<<<<<< HEAD
import Add from "./Pages/Add/Add";
=======
>>>>>>> be9575f10fa0ba7756c740e9c7e7a1da61e419fd

function App() {
  const router = createHashRouter(
    createRoutesFromElements(
      <Route>
<<<<<<< HEAD
        <Route path="/add" element={<LogIn />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/" element={<Add />} />
=======
        <Route path="/" element={<LogIn />} />
        <Route path="/manage" element={<Manage />} />
>>>>>>> be9575f10fa0ba7756c740e9c7e7a1da61e419fd
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
