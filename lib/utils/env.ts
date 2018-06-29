const IsBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const IsNode = typeof module !== 'undefined' && typeof module.exports !== 'undefined';

export { IsBrowser, IsNode };