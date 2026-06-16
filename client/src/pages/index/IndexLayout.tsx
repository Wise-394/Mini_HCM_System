import { Outlet } from "react-router";
import { Header } from "../../components/Header.tsx";

export const IndexLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
