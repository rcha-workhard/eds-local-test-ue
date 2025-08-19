/* /blocks/link-group-simple/link-group-simple.js */

/**
 * 處理 link-group-simple block 的結構和樣式
 * @param {HTMLElement} block - link-group-simple block 元素
 */
func/**
 * 裝飾 link-group-simple block
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  console.log('Decorating link-group-simple block:', block);
  
  // 檢查 link-title 數量並顯示警告
  const linkTitleCount = block.querySelectorAll(':scope > div').length;
  const actualLinkTitles = Array.from(block.querySelectorAll(':scope > div')).filter(div => {
    const firstCell = div.querySelector(':scope > div:first-child');
    return firstCell && firstCell.textContent.trim() === 'link-title';
  });
  
  if (actualLinkTitles.length > 3) {
    console.warn(`⚠️ 警告：此 link-group-simple 包含 ${actualLinkTitles.length} 個 link-title，但建議最多只使用 3 個，多餘的將被隱藏。`);
  }
  
  // 添加 CSS 樣式
  addStyles();
  
  // 處理 block 結構
  processLinkGroupStructure(block);
  
  // 添加主要 CSS 類名
  block.classList.add('link-group-simple');
  
  console.log('Link-group-simple block decoration completed');
}

/**
 * 處理 link-group-simple block 的結構和樣式
 * @param {HTMLElement} block - link-group-simple block 元素
 */
function processLinkGroupStructure(block) {
  console.log('Processing link-group-simple structure');
  
  // 處理 link-title 子區塊
  const linkTitles = block.querySelectorAll(':scope > div');
  let titleCounter = 0;
  const maxLinkTitles = 3; // 最大允許的 link-title 數量
  
  linkTitles.forEach(titleBlock => {
    // 檢查是否為 link-title
    const firstCell = titleBlock.querySelector(':scope > div:first-child');
    if (firstCell && firstCell.textContent.trim() === 'link-title') {
      titleCounter++;
      
      // 如果超過最大數量，隱藏多餘的 link-title
      if (titleCounter > maxLinkTitles) {
        console.warn(`Link-title ${titleCounter} exceeds maximum limit of ${maxLinkTitles}, hiding element`);
        titleBlock.style.display = 'none';
        titleBlock.setAttribute('data-hidden', 'true');
        return;
      }
      
      titleBlock.classList.add('link-title-section');
      titleBlock.setAttribute('data-section', 'link-title');
      titleBlock.setAttribute('data-index', titleCounter);
      
      console.log(`Found link-title section ${titleCounter}`);
      
      // 處理該 link-title 下的內容
      const contentCells = titleBlock.querySelectorAll(':scope > div');
      contentCells.forEach((cell, index) => {
        if (index === 0) {
          // 第一個 cell 是類型標識，隱藏它
          cell.style.display = 'none';
        } else if (index === 1) {
          // 第二個 cell 是子類別標題
          cell.classList.add('subcategory-title');
        } else {
          // 其他 cells 是 link 項目
          if (cell.querySelector(':scope > div:first-child')?.textContent.trim() === 'link') {
            cell.classList.add('link-item');
            
            // 處理 link 的內部結構
            const linkCells = cell.querySelectorAll(':scope > div');
            linkCells.forEach((linkCell, linkIndex) => {
              if (linkIndex === 0) {
                linkCell.style.display = 'none'; // 隱藏類型標識
              } else if (linkIndex === 1) {
                linkCell.classList.add('link-text');
              } else if (linkIndex === 2) {
                linkCell.classList.add('link-url');
              } else if (linkIndex === 3) {
                linkCell.classList.add('seo-title');
              }
            });
          }
        }
      });
    }
  });
  
  console.log(`Processed ${titleCounter} link-title sections`);
}

/**
 * 添加 CSS 樣式
 */
function addStyles() {
  if (!document.querySelector('#link-group-simple-styles')) {
    const styles = document.createElement('style');
    styles.id = 'link-group-simple-styles';
    styles.textContent = `
      .link-group-simple {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }
      
      .link-group-simple .link-title-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        background: #f8f9fa;
      }
      
      .link-group-simple .link-title-section:before {
        content: "Link Title " attr(data-index);
        display: block;
        font-size: 0.75rem;
        color: #6c757d;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
      }
      
      .link-group-simple .subcategory-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #495057;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #dee2e6;
      }
      
      .link-group-simple .link-item {
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .link-group-simple .link-text {
        flex: 1;
        font-weight: 500;
        color: #0066cc;
      }
      
      .link-group-simple .link-url {
        flex: 2;
        font-family: monospace;
        font-size: 0.9rem;
        color: #6c757d;
      }
      
      .link-group-simple .seo-title {
        flex: 1;
        font-size: 0.85rem;
        color: #6c757d;
        font-style: italic;
      }
      
      /* 響應式設計 */
      @media (max-width: 768px) {
        .link-group-simple .link-item {
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
        }
        
        .link-group-simple .link-text,
        .link-group-simple .link-url,
        .link-group-simple .seo-title {
          flex: none;
        }
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
  
  // 添加 CSS 樣式
  addStyles();
  
  // 處理 block 結構
  processLinkGroupStructure(block);
  
  // 添加主要 CSS 類名
  block.classList.add('link-group-simple');
  
  console.log('Link-group-simple block decoration completed');
}
