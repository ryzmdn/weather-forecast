export function clss(...args) {
  return args.filter(Boolean).join(" ");
}
