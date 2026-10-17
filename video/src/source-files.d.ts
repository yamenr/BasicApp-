// The webpack rule in remotion.config.ts loads these files as plain strings
declare module '*.java' {
  const source: string;
  export default source;
}
declare module '*.xml' {
  const source: string;
  export default source;
}
declare module '*.gradle' {
  const source: string;
  export default source;
}
declare module '*.woff2' {
  const url: string;
  export default url;
}
