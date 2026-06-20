import { routes } from './routes/routes.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
