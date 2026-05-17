import { AppShell, Burger, Group } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import HelixNavbar from './navbar';

const Layout = () => {
   const [mobileOpened, { toggle }] = useDisclosure();
  

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      navbar={{
        width: 300,
        breakpoint: 'sm',
           collapsed: { mobile: !mobileOpened },
      }}
    >
      <AppShell.Header>    
        <Group h="100%" px="md">      
          <Burger opened={mobileOpened} onClick={toggle} hiddenFrom="sm" size="sm" />
            {/* Header has a burger icon below sm breakpoint */}
          </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
       <HelixNavbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
        {/*<Button onClick={toggleDesktop} visibleFrom="sm">*/}
        {/*  Toggle navbar*/}
        {/*</Button>*/}
        {/*<Button onClick={toggleMobile} hiddenFrom="sm">*/}
        {/*  Toggle navbar*/}
        {/*</Button>*/}
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
