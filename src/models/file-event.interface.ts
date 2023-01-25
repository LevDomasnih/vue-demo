export interface FileEventInterface<T extends HTMLElement> extends Event {
  target: T;
}
