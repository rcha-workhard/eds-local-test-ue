/* /blocks/link-group-simple/link-group-simple.js */

/**
 * 限制 link-title 子組件的數量為最多 3 個
 * @param {HTMLElement} block - link-group-simple block 元素
 */
function limitLinkTitleCount(block) {
  const maxLinkTitles = 3;
  let warningShown = false;

  // 檢查當前 link-title 數量
  function checkLinkTitleCount() {
    const linkTitles = block.querySelectorAll('[data-item="link-title"]');
    const addButtons = block.querySelectorAll('[data-add-item="link-title"]');
    
    console.log(`Current link-title count: ${linkTitles.length}`);
    
    if (linkTitles.length >= maxLinkTitles) {
      // 隱藏或禁用添加按鈕
      addButtons.forEach(button => {
        button.style.display = 'none';
        button.disabled = true;
        button.setAttribute('title', `最多只能添加 ${maxLinkTitles} 個 Link Title`);
      });
      
      // 隱藏超過限制的 link-title
      for (let i = maxLinkTitles; i < linkTitles.length; i++) {
        linkTitles[i].style.display = 'none';
        linkTitles[i].setAttribute('data-hidden', 'true');
      }
      
      // 顯示警告訊息（只顯示一次）
      if (!warningShown && linkTitles.length > maxLinkTitles) {
        showLimitWarning(block, maxLinkTitles);
        warningShown = true;
      }
      
      // 在最後一個顯示的 link-title 後面加上提示
      if (linkTitles[maxLinkTitles - 1]) {
        addLimitIndicator(linkTitles[maxLinkTitles - 1], maxLinkTitles);
      }
    } else {
      // 恢復添加按鈕
      addButtons.forEach(button => {
        button.style.display = '';
        button.disabled = false;
        button.removeAttribute('title');
      });
      
      // 移除限制提示
      removeLimitIndicator(block);
      warningShown = false;
    }
  }

  // 顯示警告訊息
  function showLimitWarning(container, limit) {
    // 移除舊的警告（如果存在）
    const existingWarning = container.querySelector('.link-title-limit-warning');
    if (existingWarning) {
      existingWarning.remove();
    }

    // 建立警告元素
    const warning = document.createElement('div');
    warning.className = 'link-title-limit-warning';
    warning.style.cssText = `
      background: #fff3cd;
      color: #856404;
      padding: 0.75rem;
      margin: 0.5rem 0;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
    `;
    warning.innerHTML = `
      <span style="margin-right: 0.5rem;">⚠️</span>
      Link Title 已達到最大限制 (${limit} 個)，多餘的項目已隱藏。
    `;

    // 插入到 block 的開頭
    container.insertBefore(warning, container.firstChild);
  }

  // 添加限制指示器
  function addLimitIndicator(lastItem, limit) {
    // 移除舊的指示器
    removeLimitIndicator(lastItem.parentNode);
    
    const indicator = document.createElement('div');
    indicator.className = 'link-title-limit-indicator';
    indicator.style.cssText = `
      color: #6c757d;
      font-size: 0.8rem;
      font-style: italic;
      padding: 0.25rem 0;
      border-top: 1px dashed #dee2e6;
      margin-top: 0.5rem;
    `;
    indicator.textContent = `（已達到 Link Title 最大數量限制：${limit} 個）`;
    
    // 插入到最後一個 link-title 後面
    lastItem.parentNode.insertBefore(indicator, lastItem.nextSibling);
  }

  // 移除限制指示器
  function removeLimitIndicator(container) {
    const indicators = container.querySelectorAll('.link-title-limit-indicator');
    indicators.forEach(indicator => indicator.remove());
    
    const warnings = container.querySelectorAll('.link-title-limit-warning');
    warnings.forEach(warning => warning.remove());
  }

  // 使用 MutationObserver 監聽 DOM 變化
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach((mutation) => {
      // 檢查是否有新增或移除的節點
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const removedNodes = Array.from(mutation.removedNodes);
        
        // 檢查是否有 link-title 相關的變化
        const hasLinkTitleChanges = [...addedNodes, ...removedNodes].some(node => 
          node.nodeType === Node.ELEMENT_NODE && 
          (node.dataset?.item === 'link-title' || 
           node.querySelector && node.querySelector('[data-item="link-title"]'))
        );
        
        if (hasLinkTitleChanges) {
          shouldCheck = true;
        }
      }
      
      // 檢查屬性變化（比如 data-item 屬性的變化）
      if (mutation.type === 'attributes' && 
          mutation.attributeName === 'data-item' &&
          mutation.target.dataset?.item === 'link-title') {
        shouldCheck = true;
      }
    });
    
    if (shouldCheck) {
      // 使用 setTimeout 避免頻繁檢查
      clearTimeout(observer.timeout);
      observer.timeout = setTimeout(checkLinkTitleCount, 100);
    }
  });

  // 開始觀察 DOM 變化
  observer.observe(block, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-item']
  });

  // 初始檢查
  checkLinkTitleCount();
  
  // 返回清理函數
  return () => {
    observer.disconnect();
    removeLimitIndicator(block);
  };
}

/**
 * 為 link-group-simple block 添加額外的樣式和功能
 * @param {HTMLElement} block - block 元素
 */
function enhanceBlock(block) {
  // 添加基本的 CSS 類名
  block.classList.add('link-group-simple-enhanced');
  
  // 為 link-title 項目添加視覺增強
  const linkTitles = block.querySelectorAll('[data-item="link-title"]');
  linkTitles.forEach((item, index) => {
    item.classList.add('link-title-item');
    item.setAttribute('data-index', index + 1);
  });
  
  // 添加 CSS 樣式
  if (!document.querySelector('#link-group-simple-styles')) {
    const styles = document.createElement('style');
    styles.id = 'link-group-simple-styles';
    styles.textContent = `
      .link-group-simple-enhanced [data-item="link-title"] {
        position: relative;
        margin-bottom: 1rem;
        padding: 0.75rem;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        background: #f8f9fa;
      }
      
      .link-group-simple-enhanced [data-item="link-title"]:before {
        content: "Link Title " attr(data-index);
        font-size: 0.75rem;
        color: #6c757d;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .link-group-simple-enhanced [data-item="link-title"][data-hidden="true"] {
        display: none !important;
      }
      
      .link-group-simple-enhanced [data-add-item="link-title"]:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(styles);
  }
}

/**
 * Decorates the link-group-simple block
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  console.log('Decorating link-group-simple block:', block);
  
  // 增強 block 外觀
  enhanceBlock(block);
  
  // 應用 link-title 數量限制
  const cleanup = limitLinkTitleCount(block);
  
  // 將清理函數存儲到 block 元素上，以便後續需要時清理
  block.linkGroupSimpleCleanup = cleanup;
  
  console.log('Link-group-simple block decoration completed');
}
