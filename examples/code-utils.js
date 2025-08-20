/**
 * Frost Glass CSS - Code Block Utilities
 * Provides copy-to-clipboard functionality and code block management
 */

class CodeBlockManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupCopyButtons();
    this.setupCodeBlocks();
    this.setupSyntaxHighlighting();
  }

  /**
   * Setup copy buttons for all code blocks
   */
  setupCopyButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('copy-button') || e.target.closest('.copy-button')) {
        const button = e.target.classList.contains('copy-button') ? e.target : e.target.closest('.copy-button');
        const codeBlock = button.closest('.code-example');
        if (codeBlock) {
          this.copyCodeToClipboard(codeBlock, button);
        }
      }
    });
  }

  /**
   * Copy code content to clipboard
   */
  async copyCodeToClipboard(codeBlock, button) {
    try {
      const codeContent = codeBlock.querySelector('code');
      if (!codeContent) return;

      const textToCopy = codeContent.textContent || codeContent.innerText;
      
      // Use modern clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      // Show success feedback
      this.showCopySuccess(button);
      
    } catch (err) {
      console.error('Failed to copy code:', err);
      this.showCopyError(button);
    }
  }

  /**
   * Show copy success feedback
   */
  showCopySuccess(button) {
    const originalText = button.innerHTML;
    const originalClasses = button.className;
    
    button.innerHTML = '✅ Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('copied');
    }, 2000);
  }

  /**
   * Show copy error feedback
   */
  showCopyError(button) {
    const originalText = button.innerHTML;
    
    button.innerHTML = '❌ Failed';
    button.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.7) 100%)';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
    }, 2000);
  }

  /**
   * Setup code blocks with proper structure
   */
  setupCodeBlocks() {
    // Ensure all code blocks have proper structure
    document.querySelectorAll('.code-example').forEach(block => {
      if (!block.querySelector('.code-preview')) {
        this.createCodeBlockStructure(block);
      }
    });
  }

  /**
   * Create proper code block structure if missing
   */
  createCodeBlockStructure(codeBlock) {
    const codeContent = codeBlock.querySelector('code, pre');
    if (!codeContent) return;

    // Create preview area
    const preview = document.createElement('div');
    preview.className = 'code-preview';
    preview.innerHTML = codeContent.outerHTML;
    
    // Create code block container
    const codeContainer = document.createElement('div');
    codeContainer.className = 'code-block';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'code-header';
    
    const title = document.createElement('span');
    title.className = 'code-title';
    title.textContent = 'Code Example';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-button';
    copyBtn.innerHTML = '📋 Copy';
    
    header.appendChild(title);
    header.appendChild(copyBtn);
    
    // Create content area
    const content = document.createElement('div');
    content.className = 'code-content';
    content.appendChild(codeContent);
    
    // Assemble the structure
    codeContainer.appendChild(header);
    codeContainer.appendChild(content);
    
    // Clear and rebuild
    codeBlock.innerHTML = '';
    codeBlock.appendChild(preview);
    codeBlock.appendChild(codeContainer);
  }

  /**
   * Basic syntax highlighting for HTML/CSS
   */
  setupSyntaxHighlighting() {
    document.querySelectorAll('.code-content code').forEach(codeBlock => {
      this.highlightSyntax(codeBlock);
    });
  }

  /**
   * Apply basic syntax highlighting
   */
  highlightSyntax(codeBlock) {
    const code = codeBlock.textContent;
    const highlighted = this.highlightHTML(code);
    codeBlock.innerHTML = highlighted;
  }

  /**
   * Basic HTML syntax highlighting
   */
  highlightHTML(html) {
    return html
      // HTML tags
      .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)([^&]*?)(&gt;)/g, 
        '<span class="tag">$1$2$3$4</span>')
      // Attributes
      .replace(/([a-zA-Z-]+)=/g, '<span class="attr-name">$1</span>=')
      // Attribute values
      .replace(/(["'])([^"']*)\1/g, '<span class="attr-value">$1$2$1</span>')
      // Comments
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="comment">$1</span>')
      // CSS properties
      .replace(/([a-zA-Z-]+):/g, '<span class="property">$1</span>:')
      // CSS values
      .replace(/([a-zA-Z-]+);/g, '<span class="value">$1</span>;');
  }

  /**
   * Create a new code example
   */
  createCodeExample(title, previewHTML, codeHTML) {
    const codeExample = document.createElement('div');
    codeExample.className = 'code-example';
    
    codeExample.innerHTML = `
      <div class="code-preview">
        ${previewHTML}
      </div>
      <div class="code-block">
        <div class="code-header">
          <span class="code-title">${title}</span>
          <button class="copy-button">📋 Copy</button>
        </div>
        <div class="code-content">
          <pre><code>${this.escapeHTML(codeHTML)}</code></pre>
        </div>
      </div>
    `;
    
    return codeExample;
  }

  /**
   * Escape HTML for code display
   */
  escapeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Add code example to a container
   */
  addCodeExample(container, title, previewHTML, codeHTML) {
    const codeExample = this.createCodeExample(title, previewHTML, codeHTML);
    container.appendChild(codeExample);
    
    // Re-initialize for the new element
    this.setupCodeBlocks();
    this.setupSyntaxHighlighting();
  }
}

/**
 * Utility functions for code blocks
 */
const CodeUtils = {
  /**
   * Initialize code block functionality
   */
  init() {
    window.codeBlockManager = new CodeBlockManager();
  },

  /**
   * Create a code example programmatically
   */
  createExample(title, previewHTML, codeHTML, container) {
    if (window.codeBlockManager) {
      window.codeBlockManager.addCodeExample(container, title, previewHTML, codeHTML);
    }
  },

  /**
   * Copy text to clipboard
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        textArea.remove();
        return success;
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  },

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    // Set background based on type
    switch (type) {
      case 'success':
        notification.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        break;
      case 'error':
        notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        break;
      case 'warning':
        notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        break;
      default:
        notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(notificationStyles);

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CodeUtils.init());
} else {
  CodeUtils.init();
}

// Export for use in other scripts
window.CodeUtils = CodeUtils;
