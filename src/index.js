import React from 'react';
import App from './App';

import { hydrateRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = hydrateRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);