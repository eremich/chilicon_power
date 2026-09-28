import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Shell } from './Shell';
import { Home } from '../screens/owner/Home';
import { Energy } from '../screens/owner/Energy';
import { Panels } from '../screens/owner/Panels';
import { PanelDetail } from '../screens/owner/PanelDetail';
import { Profile } from '../screens/owner/Profile';
import { Login, ResetPassword, SignUp, VerifyEmail, Welcome, WhoAreYou } from '../screens/onboarding/Auth';
import { Sites } from '../screens/installer/Sites';
import { Alerts } from '../screens/installer/Alerts';
import { SiteDetail } from '../screens/installer/SiteDetail';
import { DeviceDetail } from '../screens/installer/DeviceDetail';
import { AddCustomer, AddDone, AddLayout, AddScan } from '../screens/installer/AddSite';
import { InstallerProfile } from '../screens/installer/InstallerProfile';
import { AcceptInvite, AddSystem, Address, Connecting, ManualCode, ScanGateway, SystemDetails, WaitingForData } from '../screens/onboarding/Setup';

/** "/" keeps the query (?role=&scenario=) so main.tsx can read it before redirecting */
const Root = () => {
  const { search } = useLocation();
  const role = new URLSearchParams(search).get('role');
  return <Navigate to={`${role === 'installer' ? '/i' : '/o'}${search}`} replace />;
};

/** All routes. `bare` hides the desktop control panel (Storybook screen previews) */
export const AppRoutes = ({ bare = false }: { bare?: boolean }) => (
  <Routes>
    <Route element={<Shell bare={bare} />}>
      <Route index element={<Root />} />
      <Route path="o" element={<Home />} />
      <Route path="o/energy" element={<Energy />} />
      <Route path="o/panels" element={<Panels />} />
      <Route path="o/panels/:pair" element={<PanelDetail />} />
      <Route path="o/profile" element={<Profile />} />
      <Route path="i" element={<Sites />} />
      <Route path="i/alerts" element={<Alerts />} />
      <Route path="i/profile" element={<InstallerProfile />} />
      <Route path="i/sites/:id" element={<SiteDetail />} />
      <Route path="i/sites/:id/devices/:pair" element={<DeviceDetail />} />
      <Route path="i/add" element={<AddCustomer />} />
      <Route path="i/add/scan" element={<AddScan />} />
      <Route path="i/add/layout" element={<AddLayout />} />
      <Route path="i/add/done" element={<AddDone />} />
      <Route path="start" element={<Welcome />} />
      <Route path="start/login" element={<Login />} />
      <Route path="start/reset" element={<ResetPassword />} />
      <Route path="start/signup" element={<SignUp />} />
      <Route path="start/role" element={<WhoAreYou />} />
      <Route path="start/verify" element={<VerifyEmail />} />
      <Route path="setup" element={<AddSystem />} />
      <Route path="setup/invite" element={<AcceptInvite />} />
      <Route path="setup/scan" element={<ScanGateway />} />
      <Route path="setup/manual" element={<ManualCode />} />
      <Route path="setup/address" element={<Address />} />
      <Route path="setup/details" element={<SystemDetails />} />
      <Route path="setup/connecting" element={<Connecting />} />
      <Route path="setup/waiting" element={<WaitingForData />} />
      <Route path="*" element={<Navigate to="/o" replace />} />
    </Route>
  </Routes>
);

export const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
