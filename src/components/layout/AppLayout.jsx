import React, { useState, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppSidebar from './AppSidebar';
import Topbar from './Topbar';

export const SidebarContext = createContext({ collapsed: false, setCollapsed: () => { } });
export const useSidebar = () => useContext(SidebarContext);

export default function AppLayout() {
    const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
    const location = useLocation();

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
            <div className="flex min-h-screen bg-background">
                <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
                    <Topbar />
                    <main className="flex-1 p-4 md:p-6 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
}