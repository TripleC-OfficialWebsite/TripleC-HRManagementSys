import {
  createHashRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import LogIn from "./Pages/LogIn/LogIn";

function App() {
  const router = createHashRouter(
    createRoutesFromElements(<Route path="/" element={<LogIn />} />)
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
