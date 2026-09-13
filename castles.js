async function getResponce() {
    try {
        let responce = await fetch("castles.json")

        if (!responce.ok) {
            throw new Error(`HTTP error! status: ${responce.status}`)
        }

        let content = await responce.json()

        let node_for_insert = document.getElementById("node_for_insert")
        if (!node_for_insert) {
            console.error("Element with id 'node_for_insert' not found!")
            return
        }

        node_for_insert.innerHTML = ''

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'row justify-content-center';

        content.forEach((item) => {
            cardsContainer.innerHTML += `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-3">
                    <div class="princess-card h-100 d-flex flex-column">
                        <div class="card-img-container position-relative">
                            <img class="card-img-top responsive-img" 
                                 src="${item.img}" 
                                 alt="${item.title}"
                                 onerror="this.src='photos3/placeholder.jpg'">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${item.title}</h5>
                            <div class="player-info mb-2">
                                <small class="text-muted d-block">
                                    <i class="fas fa-globe me-1"></i> ${item.universe || 'Fantasy'}
                                </small>
                                <small class="text-muted d-block">
                                    <i class="fas fa-landmark me-1"></i> ${item.type || 'Castle'}
                                </small>
                            </div>
                            <p class="card-text flex-grow-1 small">${item.description}</p>
                            
                            <input type="hidden" name="vendor_code" value="${item.vendor_code}">
                            <div class="mt-auto">
                                <button class="btn btn-buy w-100 gift-btn" 
                                        data-castle-id="${item.id}"
                                        data-castle-name="${item.title}">
                                    <i class="fas fa-gift me-2"></i>Get as Gift
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        node_for_insert.appendChild(cardsContainer);

        addGiftButtonListeners();

    } catch (error) {
        console.error("Error loading castles:", error)
        const node = document.getElementById("node_for_insert")
        if (node) {
            node.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🏰</div>
                    <h4 style="color: #4a2c5e;">Failed to load castles</h4>
                    <p style="color: #7b5a8c;">Please check that the file <strong>castles.json</strong> exists in the same folder.</p>
                    <p style="color: #b58bc4; font-size: 0.9rem;">Error: ${error.message}</p>
                </div>
            `
        }
    }
}

function addGiftButtonListeners() {
    document.addEventListener('click', function (e) {
        const button = e.target.closest('.gift-btn');
        if (button) {
            const castleName = button.getAttribute('data-castle-name');
            showGiftMessage(castleName);
        }
    });
}

function showGiftMessage(name) {
    const overlay = document.createElement('div');
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
        animation: fadeIn 0.3s ease;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        border-radius: 32px;
        padding: 40px 50px;
        max-width: 480px;
        width: 90%;
        text-align: center;
        box-shadow: 0 30px 60px rgba(74, 44, 94, 0.3);
        animation: bounceIn 0.5s ease;
        border: 2px solid rgba(212, 176, 217, 0.3);
    `;

    modal.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 16px;">🏰</div>
        <h2 style="color: #4a2c5e; font-weight: 600; margin-bottom: 12px;">
            A Royal Gift!
        </h2>
        <p style="color: #7b5a8c; font-size: 1.1rem; margin-bottom: 8px;">
            This castle is given as a gift to your Prince or Princess
        </p>
        <div style="margin: 20px 0; padding: 12px; background: rgba(212, 176, 217, 0.15); border-radius: 16px;">
            <span style="color: #4a2c5e; font-weight: 500;">${name}</span>
        </div>
        <button onclick="this.closest('div[style*=\\'position: fixed\\']').remove()" 
                style="
                    background: linear-gradient(135deg, #d4b0d9, #b58bc4);
                    color: white;
                    border: none;
                    padding: 14px 40px;
                    border-radius: 40px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 16px rgba(180, 120, 200, 0.3);
                "
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'">
            <i class="fas fa-check me-2"></i>Got it!
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    addAnimationStyles();
}

function addAnimationStyles() {
    if (document.getElementById('castle-modal-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'castle-modal-styles';
    styles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes bounceIn {
            0% { 
                opacity: 0;
                transform: scale(0.8) translateY(-30px);
            }
            60% {
                opacity: 1;
                transform: scale(1.02) translateY(0);
            }
            100% {
                transform: scale(1) translateY(0);
            }
        }
    `;
    document.head.appendChild(styles);
}

getResponce();