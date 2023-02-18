/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*.csv' {
  const value: any[];
  export default value;
}