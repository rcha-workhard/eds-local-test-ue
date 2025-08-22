/* /blocks/link-group-simple/link-group-simple.js */

/**
 * 解析EDS表格結構為分組數據
 * @param {HTMLElement} block - link-group-simple block 元素
 * @returns {Object} 解析後的數據
 */
function parseBlockData(block) {
  const data = {
    title: '',
    mainLinks: [],
    copyLinks: []
  };
  
  const rows = Array.from(block.children);
  
  rows.forEach(row => {
    const cells = Array.from(row.children);
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim();
      const value = cells[1].textContent.trim();
      
      // 處理主標題
      if (key === 'left-main-title') {
        data.title = value;
      }
      // 處理主要連結群組
      else if (key.startsWith('mainGroup-mainLinks-')) {
        const parts = key.split('-');
        if (parts.length >= 4) {
          const linkIndex = parseInt(parts[2]);
          const field = parts[3];
          
          // 確保連結存在
          if (!data.mainLinks[linkIndex]) {
            data.mainLinks[linkIndex] = {
              text: '',
              url: '',
              title: ''
            };
          }
          
          if (field === 'linkText') {
            data.mainLinks[linkIndex].text = value;
          } else if (field === 'linkUrl') {
            data.mainLinks[linkIndex].url = value;
          } else if (field === 'linkTitle') {
            data.mainLinks[linkIndex].title = value;
          }
        }
      }
      // 處理次要連結群組
      else if (key.startsWith('copyGroup-copyLinks-')) {
        const parts = key.split('-');
        if (parts.length >= 4) {
          const linkIndex = parseInt(parts[2]);
          const field = parts[3];
          
          // 確保連結存在
          if (!data.copyLinks[linkIndex]) {
            data.copyLinks[linkIndex] = {
              text: '',
              url: '',
              title: ''
            };
          }
          
          if (field === 'linkText') {
            data.copyLinks[linkIndex].text = value;
          } else if (field === 'linkUrl') {
            data.copyLinks[linkIndex].url = value;
          } else if (field === 'linkTitle') {
            data.copyLinks[linkIndex].title = value;
          }
        }
      }
    }
  });
  
  // 清理空白的連結
  data.mainLinks = data.mainLinks.filter(link => link && (link.text || link.url));
  data.copyLinks = data.copyLinks.filter(link => link && (link.text || link.url));
  
  console.log('Parsed block data:', data);
  return data;
}

/**
 * 創建分頁導航
 * @param {Object} data - 解析後的數據
 * @returns {HTMLElement} 分頁導航元素
 */
function createTabNavigation(data) {
  const nav = document.createElement('div');
  nav.className = 'tab-navigation';
  
  // Main tab
  const mainButton = document.createElement('button');
  mainButton.className = 'tab-button active';
  mainButton.textContent = 'Main';
  mainButton.dataset.tabIndex = '0';
  
  // Copy tab
  const copyButton = document.createElement('button');
  copyButton.className = 'tab-button';
  copyButton.textContent = 'Copy';
  copyButton.dataset.tabIndex = '1';
  
  [mainButton, copyButton].forEach(button => {
    button.addEventListener('click', (e) => {
      // 移除其他按鈕的active類
      nav.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      // 添加active類到點擊的按鈕
      e.target.classList.add('active');
      
      // 顯示對應的分頁內容
      const container = nav.parentElement;
      const tabContents = container.querySelectorAll('.tab-content');
      const targetIndex = parseInt(e.target.dataset.tabIndex);
      tabContents.forEach((content, idx) => {
        content.style.display = idx === targetIndex ? 'block' : 'none';
      });
    });
    
    nav.appendChild(button);
  });
  
  return nav;
}

/**
 * 創建連結列表
 * @param {Array} links - 連結數據
 * @param {string} groupName - 群組名稱
 * @returns {HTMLElement} 連結列表元素
 */
function createLinksContainer(links, groupName) {
  const container = document.createElement('div');
  container.className = 'links-container';
  
  if (links && links.length > 0) {
    links.forEach(link => {
      if (link.text || link.url) {
        const linkElement = document.createElement('div');
        linkElement.className = 'link-item';
        
        const linkText = document.createElement('div');
        linkText.className = 'link-text';
        linkText.textContent = link.text || '未設定文字';
        
        const linkUrl = document.createElement('div');
        linkUrl.className = 'link-url';
        linkUrl.textContent = link.url || '未設定網址';
        
        linkElement.appendChild(linkText);
        linkElement.appendChild(linkUrl);
        
        if (link.title) {
          const linkTitle = document.createElement('div');
          linkTitle.className = 'link-title';
          linkTitle.textContent = link.title;
          linkElement.appendChild(linkTitle);
        }
        
        container.appendChild(linkElement);
      }
    });
  } else {
    container.innerHTML = `<p class="no-links">此${groupName}群組暫無連結</p>`;
  }
  
  return container;
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
      
      .link-group-simple .main-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: #212529;
        margin-bottom: 2rem;
        text-align: center;
      }
      
      /* 分頁導航樣式 */
      .link-group-simple .tab-navigation {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #dee2e6;
        justify-content: center;
      }
      
      .link-group-simple .tab-button {
        padding: 0.75rem 2rem;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        color: #495057;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        font-size: 1rem;
        min-width: 120px;
      }
      
      .link-group-simple .tab-button:hover {
        background: #e9ecef;
        border-color: #adb5bd;
        transform: translateY(-1px);
      }
      
      .link-group-simple .tab-button.active {
        background: #0066cc;
        border-color: #0056b3;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2);
      }
      
      /* 分頁內容樣式 */
      .link-group-simple .tab-content {
        min-height: 200px;
      }
      
      .link-group-simple .links-container {
        display: grid;
        gap: 1rem;
      }
      
      .link-group-simple .link-item {
        padding: 1rem;
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        display: grid;
        grid-template-columns: 2fr 3fr 1.5fr;
        gap: 1rem;
        align-items: center;
        transition: all 0.2s ease;
      }
      
      .link-group-simple .link-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-color: #0066cc;
      }
      
      .link-group-simple .link-text {
        font-weight: 600;
        color: #0066cc;
        font-size: 1rem;
      }
      
      .link-group-simple .link-url {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        color: #6c757d;
        word-break: break-all;
      }
      
      .link-group-simple .link-title {
        font-size: 0.85rem;
        color: #6c757d;
        font-style: italic;
      }
      
      .link-group-simple .no-links {
        text-align: center;
        color: #6c757d;
        font-style: italic;
        padding: 2rem;
        background: #f8f9fa;
        border-radius: 8px;
        margin: 1rem 0;
      }
      
      /* 響應式設計 */
      @media (max-width: 768px) {
        .link-group-simple .tab-navigation {
          flex-direction: column;
          align-items: center;
        }
        
        .link-group-simple .tab-button {
          padding: 0.6rem 1.5rem;
          font-size: 0.95rem;
          min-width: 200px;
        }
        
        .link-group-simple .link-item {
          grid-template-columns: 1fr;
          gap: 0.5rem;
          padding: 0.75rem;
        }
      }
      
      /* 隱藏原始表格樣式 */
      .link-group-simple.processed > div {
        display: none !important;
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
  
  // 解析 block 數據
  const data = parseBlockData(block);
  
  // 如果沒有任何連結數據，顯示預設內容
  if (data.mainLinks.length === 0 && data.copyLinks.length === 0) {
    block.innerHTML = '<p class="no-links">請在Universal Editor中添加Main或Copy群組的連結</p>';
    return;
  }
  
  // 清空原始內容並標記為已處理
  const originalContent = block.innerHTML;
  block.innerHTML = '';
  block.classList.add('link-group-simple', 'processed');
  
  // 添加主標題
  if (data.title) {
    const titleElement = document.createElement('h2');
    titleElement.className = 'main-title';
    titleElement.textContent = data.title;
    block.appendChild(titleElement);
  }
  
  // 創建分頁導航（如果兩個群組都有連結或者至少一個有連結時顯示）
  const hasMainLinks = data.mainLinks.length > 0;
  const hasCopyLinks = data.copyLinks.length > 0;
  
  if (hasMainLinks || hasCopyLinks) {
    const navigation = createTabNavigation(data);
    block.appendChild(navigation);
    
    // 創建Main分頁內容
    const mainContent = document.createElement('div');
    mainContent.className = 'tab-content';
    mainContent.style.display = 'block';
    mainContent.appendChild(createLinksContainer(data.mainLinks, 'Main'));
    block.appendChild(mainContent);
    
    // 創建Copy分頁內容
    const copyContent = document.createElement('div');
    copyContent.className = 'tab-content';
    copyContent.style.display = 'none';
    copyContent.appendChild(createLinksContainer(data.copyLinks, 'Copy'));
    block.appendChild(copyContent);
  }
  
  console.log('Link-group-simple block decoration completed with Main:', data.mainLinks.length, 'Copy:', data.copyLinks.length);
}
