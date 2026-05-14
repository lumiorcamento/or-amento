(function() {
    // LumiIA Storefront Script for Nuvemshop
    // Render an AI recommendation button safely
    
    // 1. Get Store ID from script URL
    var scripts = document.getElementsByTagName('script');
    var storeId = null;
    var apiBaseUrl = 'https://[YOUR_SUPABASE_PROJECT].supabase.co/functions/v1'; // Should be replaced by build or env
    
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf('lumiia-quote-button.js') !== -1) {
            var url = new URL(scripts[i].src);
            storeId = url.searchParams.get('storeId');
            break;
        }
    }
    
    if (!storeId) {
        // Fallback for Nuvemshop standard: LS.store.id
        if (window.LS && window.LS.store && window.LS.store.id) {
            storeId = window.LS.store.id;
        }
    }
    
    if (!storeId) return;

    // 2. Fetch Config
    // Use the actual URL in production
    var configUrl = apiBaseUrl + '/nuvemshop-storefront-config?storeId=' + storeId;
    
    fetch(configUrl)
        .then(response => response.json())
        .then(config => {
            if (!config.enabled) return;
            renderButton(config);
        })
        .catch(err => console.error('LumiIA Script Error:', err));

    function renderButton(config) {
        // Create Button Container
        var container = document.createElement('div');
        container.id = 'lumiia-button-container';
        container.style.position = 'fixed';
        container.style.bottom = '24px';
        container.style.right = '24px';
        container.style.zIndex = '9999';
        container.style.fontFamily = 'Inter, sans-serif, system-ui';
        
        // Button Element
        var button = document.createElement('a');
        button.href = config.quoteUrl;
        button.target = '_blank';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.gap = '12px';
        button.style.backgroundColor = config.buttonColor || '#14532d';
        button.style.color = '#ffffff';
        button.style.padding = '12px 20px';
        button.style.borderRadius = '16px';
        button.style.textDecoration = 'none';
        button.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        button.style.transition = 'transform 0.2s ease';
        button.style.cursor = 'pointer';

        button.onmouseover = function() { this.style.transform = 'scale(1.05)'; };
        button.onmouseout = function() { this.style.transform = 'scale(1)'; };

        // Icon
        var iconWrapper = document.createElement('div');
        iconWrapper.style.width = '24px';
        iconWrapper.style.height = '24px';
        iconWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        iconWrapper.style.borderRadius = '8px';
        iconWrapper.style.display = 'flex';
        iconWrapper.style.alignItems = 'center';
        iconWrapper.style.justifyContent = 'center';
        iconWrapper.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m13 10V3L4 14h7v7l9-11h-7z"/></svg>';

        // Text
        var textContent = document.createElement('div');
        
        var mainText = document.createElement('div');
        mainText.innerText = config.buttonText;
        mainText.style.fontWeight = '700';
        mainText.style.fontSize = '14px';
        mainText.style.lineHeight = '1.2';
        
        textContent.appendChild(mainText);
        
        if (config.buttonSubtitle) {
            var subText = document.createElement('div');
            subText.innerText = config.buttonSubtitle;
            subText.style.fontSize = '10px';
            subText.style.opacity = '0.8';
            subText.style.marginTop = '2px';
            textContent.appendChild(subText);
        }

        button.appendChild(iconWrapper);
        button.appendChild(textContent);
        container.appendChild(button);
        document.body.appendChild(container);
    }
})();
