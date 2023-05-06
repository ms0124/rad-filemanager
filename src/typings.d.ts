/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const svgUrl: string;
  const svgComponent: SvgrComponent;
  export default svgUrl;
  export { svgComponent as ReactComponent };
}
// declare module '*.eot';
// declare module '*.ttf';
// declare module '*.woff';
// declare module '*.woff2';

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
