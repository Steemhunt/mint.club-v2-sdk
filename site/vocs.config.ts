import { defineConfig } from 'vocs';
import { sidebar } from './docs/sidebar';

export default defineConfig({
  title: 'Mint.club',
  logoUrl: 'https://mint.club/assets/icons/mint-logo.png',
  sidebar,
  theme: {
    accentColor: '#15e6b7',
    colorScheme: 'dark',
  },
  font: {
    google: 'Raleway',
  },
});
