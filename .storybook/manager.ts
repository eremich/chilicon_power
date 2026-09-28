import { addons } from 'storybook/manager-api';
import { chiliconTheme } from './theme';

addons.setConfig({ theme: chiliconTheme, sidebar: { showRoots: true } });
