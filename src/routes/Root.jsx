import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <main className="bg-violet-500 h-[100vh] w-[100vw] flex justify-center items-center">
      <Outlet />
    </main>
  );
};
export default Root;
