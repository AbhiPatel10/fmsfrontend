import React from "react";
import Header from "./header";
import Sidebar from "./sidebar";

function Layout({ children }) {
    return (
        <>
            <Header />
            <Sidebar />
            {children}
        </>
    );
}

export default Layout;