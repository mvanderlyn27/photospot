import { useMediaQuery } from 'react-responsive';
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig)
const theme = fullConfig.theme;
const breakpoints = theme.screens;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
    const bool = useMediaQuery({
        query: `(min-width: ${breakpoints[breakpointKey]})`,
    });
    const capitalizedKey = breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
    type Key = `is${Capitalize<K>}`;
    return {
        [`is${capitalizedKey}`]: bool,
    } as Record<Key, boolean>;
}