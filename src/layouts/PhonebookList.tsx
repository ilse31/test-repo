import React from "react";
import { Outlet } from "react-router-dom";
import Button from "src/components/Button/Button";
import changeTheme from "src/helpers/darkMode";
import { setLocalStorage } from "src/helpers/localstorage";

type Props = {};

const PhonebookList = (props: Props) => {
  const [darkMode, setDarkMode] = React.useState("dark");

  const handleDarkMode = () => {
    darkMode === "light" ? setDarkMode("dark") : setDarkMode("light");
  };

  React.useEffect(() => {
    setLocalStorage("darkMode", darkMode);
    changeTheme();
  }, [darkMode]);

  return (
    <div className='bg-white dark:bg-slate-700 min-h-screen w-full p-4'>
      <div className='max-w-5xl  mx-auto'>
        <div className='w-full h-full'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PhonebookList;
