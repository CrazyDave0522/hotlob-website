/**
 * Strip HTML tags from a string and return plain text
 * @param html - HTML string to strip tags from
 * @returns Plain text with HTML tags removed
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Extract a smart excerpt from text, preferring complete sentences
 * @param text - Plain text to extract excerpt from
 * @param minLength - Minimum length (default: 150)
 * @param maxLength - Maximum length (default: 400)
 * @returns Smart excerpt with complete sentences when possible
 */
export function getSmartExcerpt(text: string, minLength = 150, maxLength = 400): string {
  if (!text) return '';
  if (text.length <= minLength) return text;
  
  // Get text segment up to maxLength
  const segment = text.substring(0, maxLength);
  
  // Find sentence endings (period, exclamation, question mark followed by space or newline)
  const sentenceEnds = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];
  
  let bestEnd = -1;
  for (const end of sentenceEnds) {
    const pos = segment.lastIndexOf(end);
    // Only accept if it's after minLength and better than previous finds
    if (pos >= minLength && pos > bestEnd) {
      bestEnd = pos + 1; // Include the punctuation
    }
  }
  
  // If we found a good sentence ending, use it
  if (bestEnd > 0) {
    return text.substring(0, bestEnd).trim();
  }
  
  // No good sentence ending found, truncate at maxLength with ellipsis
  return text.substring(0, maxLength).trim() + '...';
}
