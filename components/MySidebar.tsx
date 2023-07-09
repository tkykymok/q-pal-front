'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const MySidebar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  return (
    <Sidebar
      collapsed={collapsed}
      collapsedWidth="60px"
      width="200px"
    >
      {collapsed ? (
        <div className="flex justify-center">
          <IoIosArrowForward
            className="h-6 w-6 text-neutral-500 cursor-pointer hover:scale-110"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
      ) : (
        <div className="flex justify-end">
          <IoIosArrowBack
            className="h-6 w-6 text-neutral-500 cursor-pointer hover:scale-110"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
      )}

      <Menu>
        <SubMenu label="Menu1">
          <MenuItem> SubMenu1 </MenuItem>
          <MenuItem> SubMenu2 </MenuItem>
        </SubMenu>
        <MenuItem> Menu2 </MenuItem>
        <MenuItem> Menu3 </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default MySidebar;
