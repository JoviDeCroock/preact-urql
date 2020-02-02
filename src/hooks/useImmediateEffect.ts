import { useRef, useEffect, EffectCallback } from 'preact/hooks';
import { noop } from './useQuery';

export const useImmediateEffect = (
  effect: EffectCallback,
  changes: ReadonlyArray<any>
) => {
  const teardown = useRef<() => void>(noop);
  const isMounted = useRef<boolean>(false);

  // On initial render we just execute the effect
  if (!isMounted.current) {
    teardown.current();
    teardown.current = effect() || noop;
  }

  useEffect(() => {
    // Initially we skip executing the effect since we've already done so on
    // initial render, then we execute it as usual
    return isMounted.current
      ? effect()
      : ((isMounted.current = true), teardown.current);
  }, changes);
};
