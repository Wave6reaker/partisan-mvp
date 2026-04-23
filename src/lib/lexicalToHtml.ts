type LexicalNode = {
  type: string;
  text?: string;
  format?: number;
  url?: string;
  children?: LexicalNode[];
  newLine?: boolean;
};

function renderNode(node: LexicalNode): string {
  if (node.type === 'text') {
    let text = (node.text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (node.format) {
      if (node.format & 1) text = `<strong>${text}</strong>`;
      if (node.format & 2) text = `<em>${text}</em>`;
      if (node.format & 8) text = `<u>${text}</u>`;
    }
    return text;
  }
  if (node.type === 'link' || node.type === 'autolink') {
    const href = node.url || '#';
    const inner = (node.children || []).map(renderNode).join('');
    return `<a href="${href}" class="underline hover:opacity-70 transition-opacity" target="_blank" rel="noopener noreferrer">${inner}</a>`;
  }
  if (node.type === 'paragraph') {
    const inner = (node.children || []).map(renderNode).join('');
    return inner ? `<p>${inner}</p>` : '<br>';
  }
  if (node.type === 'linebreak') return '<br>';
  if (node.children) {
    return (node.children).map(renderNode).join('');
  }
  return '';
}

export function lexicalToHtml(content: any): string {
  if (!content?.root?.children) return '';
  return content.root.children.map(renderNode).join('');
}
