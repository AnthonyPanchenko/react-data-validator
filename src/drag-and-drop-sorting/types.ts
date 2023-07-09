export type ItemPosition = { topFixedY: number; translateY: number };

export type onRegisterEventInfo =
  | ((index: number, event: MouseEvent, elementDomRect: DOMRect) => void)
  | undefined;

export type onRegisterStateSetters =
  | ((
      setPosition: (topY: number) => void,
      setActiveState: (isActive: boolean) => void,
      setTranslatePosition: (translateY: number) => void,
      index: number
    ) => void)
  | undefined;
