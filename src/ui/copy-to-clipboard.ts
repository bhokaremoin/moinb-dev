/** Resolves false instead of throwing when the Clipboard API is missing or permission is denied. */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
