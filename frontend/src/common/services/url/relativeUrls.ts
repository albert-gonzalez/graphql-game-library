export const replaceRelativeAnchorUrls = (domain: string, text?: string) => {
  if (!text) {
    return '';
  }

  return text.replace(/href="\//g, `href="https://${domain}/`);
};
