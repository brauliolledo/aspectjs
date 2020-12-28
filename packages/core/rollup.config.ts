import { RollupOptions } from 'rollup';
import { RollupConfig } from '../../build/rollup-config';

const rollupOptions: RollupOptions[] = new RollupConfig([
    ['./package.json', 'dist/public_api.js'],
    ['./annotations/package.json', 'dist/annotations/public_api.js'],
]).create();

export default rollupOptions;
