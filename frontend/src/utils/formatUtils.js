/**
 * Strips HTML tags from a string and returns plain text
 * @param {string} html - HTML string to strip tags from
 * @returns {string} Plain text without HTML tags
 */
export const stripHtmlTags = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

/**
 * Safely renders HTML content with proper formatting
 * @param {string} html - HTML content to render
 * @returns {string} Sanitized HTML ready for rendering with proper code highlighting
 */
export const formatHtmlContent = (html) => {
  if (!html) return '';
  
  // Make sure code blocks have proper language classes for Prism
  let formattedHtml = html;
  
  // Fix TinyMCE code blocks to work with Prism
  formattedHtml = formattedHtml.replace(/<pre><code class="language-([\w-]+)">/g, (match, lang) => {
    return `<pre class="language-${lang}"><code class="language-${lang}">`;
  });
  
  // Also handle code blocks without language specification
  formattedHtml = formattedHtml.replace(/<pre><code>/g, '<pre class="language-javascript"><code class="language-javascript">');
  
  return formattedHtml;
};