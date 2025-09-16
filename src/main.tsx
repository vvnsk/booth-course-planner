import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import './index.css'
import '@mantine/core/styles.css'
import App from './App.tsx'

const theme = createTheme({
  primaryColor: 'maroon',
  colors: {
    maroon: [
      '#fdf2f2',
      '#fce4e4',
      '#f5c6c6',
      '#eda5a5',
      '#e68a8a',
      '#e17979',
      '#de7070',
      '#c55d5d',
      '#b15252',
      '#9c4545'
    ],
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)
