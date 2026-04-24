import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'dark' | 'light'
type Lang  = 'EN' | 'FR'

interface ThemeCtx {
  theme: Theme
  toggleTheme: () => void
  lang: Lang
  setLang: (l: Lang) => void
}

const Ctx = createContext<ThemeCtx>({} as ThemeCtx)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem('ist-theme') as Theme) ?? 'dark'
  )
  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('ist-lang') as Lang) ?? 'EN'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ist-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('ist-lang', l)
  }

  return <Ctx.Provider value={{ theme, toggleTheme, lang, setLang }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
