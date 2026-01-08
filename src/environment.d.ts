declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GATSBY_CYOA_API_BASE_URL: string
    }
  }
}

export {}
