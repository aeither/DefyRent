import '@mysten/dapp-kit/dist/index.css'
import '@radix-ui/themes/styles.css'
import { StrictMode } from 'react'
import { reactRender } from '~~/helpers/misc.ts'
import SuiProvider from '~~/providers/SuiProvider.tsx'
import ThemeProvider from '~~/providers/ThemeProvider'
import '~~/styles/index.css'
import App from './App'

reactRender(
  <StrictMode>
    <ThemeProvider>
      <SuiProvider>
        <App />
      </SuiProvider>
    </ThemeProvider>
  </StrictMode>
)
