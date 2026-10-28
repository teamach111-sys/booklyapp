/**
 * The login screen is what made "Déconnexion" look broken: it sends any
 * authenticated visitor straight to a dashboard, so navigating there without
 * clearing the session bounced right back. These tests pin both halves.
 */

let mockAuth = {
  booting: false,
  isAuthenticated: false,
  user: null,
  signIn: jest.fn(),
};

jest.mock('../src/context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Icon = () => React.createElement(View);

  return { __esModule: true, Eye: Icon, EyeOff: Icon };
});

global.IS_REACT_ACT_ENVIRONMENT = true;
jest.setTimeout(20000);

import { act, create } from 'react-test-renderer';
import LoginScreen from '../src/screens/auth/LoginScreen';

function makeNavigation() {
  return { navigate: jest.fn(), replace: jest.fn(), reset: jest.fn() };
}

async function render(navigation) {
  let tree;
  await act(async () => {
    tree = create(<LoginScreen navigation={navigation} />);
  });
  return tree;
}

beforeEach(() => {
  mockAuth = {
    booting: false,
    isAuthenticated: false,
    user: null,
    signIn: jest.fn(),
  };
});

it('stays on the form when signed out', async () => {
  const navigation = makeNavigation();

  const tree = await render(navigation);

  expect(navigation.replace).not.toHaveBeenCalled();
  expect(JSON.stringify(tree.toJSON())).toContain('Connexion');
});

it('forwards a signed-in client to their dashboard', async () => {
  mockAuth.isAuthenticated = true;
  mockAuth.user = { role: 'client', platform_partner: 'staffly' };
  const navigation = makeNavigation();

  await render(navigation);

  // The partner travels with it so the client area renders the right brand.
  expect(navigation.replace).toHaveBeenCalledWith('ClientDashboard', {
    partner: 'staffly',
  });
});

it('forwards a signed-in extra to the extras dashboard', async () => {
  mockAuth.isAuthenticated = true;
  mockAuth.user = { role: 'extra', platform_partner: null };
  const navigation = makeNavigation();

  await render(navigation);

  expect(navigation.replace).toHaveBeenCalledWith('ExtraDashboard', {
    partner: null,
  });
});

it('waits for the session restore before deciding', async () => {
  mockAuth.booting = true;
  mockAuth.isAuthenticated = true;
  mockAuth.user = { role: 'client' };
  const navigation = makeNavigation();

  await render(navigation);

  expect(navigation.replace).not.toHaveBeenCalled();
});
