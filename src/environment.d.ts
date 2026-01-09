declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GATSBY_CYOA_API_BASE_URL: string
      GATSBY_CYOA_ASSETS_BASE_URL: string
    }
  }
}

export {}
