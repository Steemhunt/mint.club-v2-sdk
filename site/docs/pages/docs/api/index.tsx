// src/App.jsx
import { ApiReferenceReact } from '@scalar/api-reference-react'
import '@scalar/api-reference-react/style.css'
import { useState } from 'react'

function ApiDocs() {
  const [loaded, setLoaded] = useState(false)
  return (
    <div
      className="fixed inset-0 z-[999] bg-[#0F0F0F] flex flex-col h-screen overflow-hidden"
      style={
        {
          '--refs-header-height': '64px',
          '--scalar-header-height': '64px',
        } as any
      }
    >
      <div className="flex items-center px-5 gap-4 h-[64px] fixed top-0 left-0 right-0 z-[999] bg-[#0F0F0F]">
        <a href="/docs/getting-started">
          <img src="https://mint.club/assets/icons/mint-logo.png" alt="Mint Logo" className="w-8 h-8" />
        </a>
        <span className="text-white text-lg">Mint.club API Docs</span>
      </div>

      {!loaded && (
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <div className="min-h-0 overflow-auto relative z-0">
        <ApiReferenceReact
          configuration={
            {
              onLoaded: () => {
                setLoaded(true)
              },
              _integration: 'react',
              darkMode: true,
              hideDarkModeToggle: true,
              hideClientButton: true,
              forceDarkModeState: 'dark',
              spec: { url: 'https://mint.club/openapi/openapi-2025-04-15.yaml' },
            } as any
          }
        />
      </div>
    </div>
  )
}

export default ApiDocs
