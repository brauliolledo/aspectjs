/**
 * @public
 */
import { WeaverProfile } from '../weaver/profile';

// eslint-disable-next-line @typescript-eslint/ban-types
export type AspectType = object & {
    onEnable?: (weaver: WeaverProfile) => void;
    onDisable?: (weaver: WeaverProfile) => void;
};
