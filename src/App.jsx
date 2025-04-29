import { RouterProvider } from "react-router";
import router from "./routes/AppRoutes";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
