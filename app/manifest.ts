import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CarBuyingHub',
    short_name: 'CarBuyingHub',
    description: 'A calmer path to the right car.',
    start_url: '/',
    // 'standalone' is the magic word that hides the browser URL bar!
    display: 'standalone', 
    background_color: '#F4F1EA', // Your premium cream background
    theme_color: '#1A1A1A', // Your charcoal color for the phone's top status bar
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}