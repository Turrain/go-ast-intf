import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import { Skeleton } from '@mui/joy';

import { closeSidebar } from './utils';
import ColorSchemeToggle from './ColorSchemeToggle';

export default function Sidebar() {
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Skeleton animation="wave" variant="circular" width={48} height={48} />
        <div>
          <Skeleton animation="wave" variant="text" sx={{ width: 120 }} />
          <ColorSchemeToggle />
        </div>
      </Box>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton animation="wave" variant="rectangular" height={20} />
        <Skeleton animation="wave" variant="rectangular" height={20} />
        <Skeleton animation="wave" variant="rectangular" height={20} />
        <Skeleton animation="wave" variant="rectangular" height={20} />
        <Skeleton animation="wave" variant="rectangular" height={20} />
        <Skeleton animation="wave" variant="rectangular" height={20} />
        <Skeleton animation="wave" variant="rectangular" height={20} />
      </Box>
    </Sheet>
  );
}