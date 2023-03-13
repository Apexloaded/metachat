import { useEffect, useState } from "react";

type OptionConfig = {
  config: {};
};

const DEFAULT_OPTIONs = {
  config: { attributes: true, childList: true, subtree: true },
};

export const useMutationObserver = (
  element: HTMLElement | null,
  callBack: (mutations: MutationRecord[], observer: MutationObserver) => void,
  options: OptionConfig = DEFAULT_OPTIONs
) => {
  const [observer, setObserver] = useState<MutationObserver>();

  useEffect(() => {
    const observer = new MutationObserver(callBack);
    setObserver(observer);
  }, [callBack, options, setObserver]);

  useEffect(() => {
    if (!observer || !element) return;
    const { config } = options;
    observer.observe(element, config);
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer, element, options]);
};
