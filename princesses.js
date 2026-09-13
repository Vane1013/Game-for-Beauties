async function getResponce() {
    try {
        let responce = await fetch("princesses.json");
        
        if (!responce.ok) {
            throw new Error(`HTTP error! status: ${responce.status}`);
        }
        
        let content = await responce.json();

        let node_for_insert = document.getElementById("node_for_insert");
        if (!node_for_insert) {
            console.error("Element with id 'node_for_insert' not found!");
            return;
        }
        
        node_for_insert.innerHTML = ''; // Очищаем контейнер

        // Генерируем карточки сразу внутрь сетки: col-md-4 col-lg-3 гарантирует ровно 4 в ряд
        content.forEach((item) => {
            const formattedPrice = formatPrice(item.price);
            
            const cardCol = `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 d-flex">
                    <div class="princess-card w-100">
                        <div class="card-img-container">
                            <img class="card-img-top" 
                                 src="${item.img}" 
                                 alt="${item.title}"
                                 onerror="this.src='photos/placeholder.jpg'">
                        </div>
                        <div class="d-flex flex-column flex-grow-1 mt-2">
                            <h5 class="card-title text-center">${item.title}</h5>
                            <div class="player-info mb-2 text-center">
                                <small class="text-muted d-block">
                                    <i class="fas fa-globe me-1"></i> ${item.universe || 'Original'}
                                </small>
                                <small class="text-muted d-block">
                                    <i class="fas fa-heart me-1"></i> ${item.husband || item.wife || 'To be determined'}
                                </small>
                                <small class="text-muted d-block">
                                    <i class="fas fa-paw me-1"></i> ${item.pets || 'None'}
                                </small>
                            </div>
                            <p class="card-text flex-grow-1 text-center">${item.description || ''}</p>
                            
                            <!-- Блок с ценой -->
                            <div class="price-section my-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="badge-star">${formattedPrice}</span>
                                    <span class="text-muted small">Value</span>
                                </div>
                            </div>
                            
                            <!-- Кнопка с явным type="button", чтобы не вызывала сабмит -->
                            <div class="mt-auto">
                                <button type="button" class="btn btn-buy buy-btn" 
                                        data-player-id="${item.id || ''}"
                                        data-player-name="${item.title}"
                                        data-player-price="${item.price}">
                                    <i class="fas fa-shopping-cart me-2"></i>Buy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            node_for_insert.insertAdjacentHTML('beforeend', cardCol);
        });

        // Добавляем обработчик на кнопки покупки
        addBuyButtonListeners();
        
    } catch (error) {
        console.error("Error loading princesses:", error);
        const node = document.getElementById("node_for_insert");
        if (node) {
            node.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div style="font-size: 3rem; margin-bottom: 20px;">😢</div>
                    <h4 style="color: #4a2c5e;">Failed to load princesses</h4>
                    <p style="color: #7b5a8c;">Please check that the file <strong>princesses.json</strong> exists in the same folder.</p>
                    <p style="color: #b58bc4; font-size: 0.9rem;">Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

function formatPrice(price) {
    return `<i class="fas fa-star" style="color: #f5c542;"></i> ${price}`;
}

function addBuyButtonListeners() {
    // Вешаем один раз делегирование кликов
    document.addEventListener('click', function (e) {
        const button = e.target.closest('.buy-btn');
        if (button) {
            e.preventDefault(); // На всякий случай блокируем переход
            const playerName = button.getAttribute('data-player-name');
            const playerPrice = button.getAttribute('data-player-price');
            showPurchaseMessage(playerName, playerPrice);
        }
    });
}

function showPurchaseMessage(name, price) {
    // Удаляем предыдущее окно, если вдруг открыто
    const existingModal = document.getElementById('queen-modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'queen-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(74, 44, 94, 0.7);
        backdrop-filter: blur(8px);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.25s ease;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        border-radius: 32px;
        padding: 36px 45px;
        max-width: 440px;
        width: 90%;
        text-align: center;
        box-shadow: 0 30px 60px rgba(74, 44, 94, 0.35);
        animation: bounceIn 0.4s ease;
        border: 2px solid rgba(212, 176, 217, 0.4);
    `;

    modal.innerHTML = `
        <div style="font-size: 3.5rem; margin-bottom: 12px;">👑</div>
        <h2 style="color: #4a2c5e; font-weight: 700; margin-bottom: 8px; font-size: 1.8rem;">
            Go to the Queen
        </h2>
        <p style="color: #7b5a8c; font-size: 1.1rem; margin-bottom: 12px;">
            who will accept your purchase :)
        </p>
        <div style="margin: 18px 0; padding: 12px 18px; background: rgba(212, 176, 217, 0.2); border-radius: 18px; display: inline-block;">
            <span style="color: #4a2c5e; font-weight: 600; font-size: 1.05rem;">${name}</span>
            <span style="color: #8c4c9e; font-weight: 700; margin-left: 14px;">
                <i class="fas fa-star" style="color: #f5c542;"></i> ${price}
            </span>
        </div>
        <div>
            <button id="modal-close-btn" 
                    style="
                        background: linear-gradient(135deg, #d4b0d9, #b58bc4);
                        color: white;
                        border: none;
                        padding: 12px 36px;
                        border-radius: 40px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 0 4px 16px rgba(180, 120, 200, 0.35);
                    ">
                <i class="fas fa-check me-2"></i>Got it!
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('modal-close-btn').addEventListener('click', () => overlay.remove());

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    addAnimationStyles();
}

function addAnimationStyles() {
    if (document.getElementById('princess-modal-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'princess-modal-styles';
    styles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes bounceIn {
            0% { 
                opacity: 0; 
                transform: scale(0.85) translateY(-20px); 
            }
            100% { 
                opacity: 1; 
                transform: scale(1) translateY(0); 
            }
        }
    `;
    document.head.appendChild(styles);
}

// Запуск
getResponce();