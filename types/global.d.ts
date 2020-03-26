declare namespace NodeJS {
  interface Global {
    /**
     * This global variable is needed for Sentry in order to properly display
     * source-maps when compiling TypeScript project with `tsc`.
     *
     * The root-dir must be set at the application entry-point, as the very
     * first line of code.
     *
     * https://docs.sentry.io/platforms/node/typescript/#changing-events-frames
     */
    __sentryRootDir: string;
  }
}
