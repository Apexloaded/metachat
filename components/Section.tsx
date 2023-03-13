import React, { Fragment } from "react";
import { useRecoilState } from "recoil";
import { sidebarState } from "../atom/sidebarAtom";

const Section = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setcollapsed] = useRecoilState(sidebarState);

  return (
    <Fragment>
      <div
        className={`${
          collapsed ? "ml-20 xs:ml-0" : "xs:ml-0 sm:ml-20 xl:ml-64"
        } relative transition-all duration-100 min-h-screen`}
      >
        {children}
      </div>
    </Fragment>
  );
};

export default Section;
