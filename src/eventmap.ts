export type EventMap = Record<
  string,
  (message: any, sender?: browser.runtime.MessageSender) => any
>;
