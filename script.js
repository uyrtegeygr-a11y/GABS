// Variáveis globais
let currentVideoIndex = 0;
const videos = [
    { src: './assets/videos/video1.mp4', title: 'Primeiro Momento' },
    { src: './assets/videos/video2.mp4', title: 'Nosso Amor' },
    { src: './assets/videos/video3.mp4', title: 'Continuação do 2' },
];

// Elementos DOM
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');
const playButton = document.getElementById('playButton');
const videoSection = document.getElementById('videoSection');
const videoPlayer = document.getElementById('videoPlayer');
const mainVideo = document.getElementById('mainVideo');
const videoPlaylist = document.getElementById('videoPlaylist');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const photoModal = document.getElementById('photoModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalImage = document.getElementById('modalImage');

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    // Simular carregamento
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '0';
            setTimeout(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 1s ease-in-out';
            }, 100);
        }, 500);
    }, 3500);

    // Configurar event listeners
    setupEventListeners();

    // Inicializar animações
    initializeAnimations();
});

// Configurar event listeners
function setupEventListeners() {
    // Botão de play principal
    playButton.addEventListener('click', startVideoExperience);

    // Modal de fotos
    closeModal.addEventListener('click', closePhotoModal);
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            closePhotoModal();
        }
    });

    // Cards de fotos
    const photoCards = document.querySelectorAll('.photo-card');
    photoCards.forEach(card => {
        card.addEventListener('click', () => openPhotoModal(card));
    });

    // Scroll suave para seções
    document.addEventListener('scroll', handleScroll);

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePhotoModal();
        }
    });

    // Event listeners para playlist
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            changeVideo(index);
        });
    });

    // Event listener para quando o vídeo termina
    mainVideo.addEventListener('ended', () => {
        // Automaticamente ir para o próximo vídeo
        if (currentVideoIndex < videos.length - 1) {
            changeVideo(currentVideoIndex + 1);
        } else {
            // Se foi o último vídeo, scroll para galeria
            setTimeout(() => {
                document.querySelector('.gallery-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 2000);
        }
    });
}

// Iniciar experiência do vídeo
function startVideoExperience() {
    // Animação do botão
    playButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        playButton.style.transform = 'scale(1)';
    }, 150);

    // Scroll suave para a seção de vídeo
    videoSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    // Aguardar scroll e iniciar vídeo
    setTimeout(() => {
        startVideo();
    }, 1000);
}

// Iniciar vídeo real
function startVideo() {
    // Esconder placeholder
    videoPlaceholder.style.opacity = '0';

    setTimeout(() => {
        videoPlaceholder.style.display = 'none';

        // Mostrar vídeo e playlist
        mainVideo.style.display = 'block';
        videoPlaylist.style.display = 'block';

        // Carregar primeiro vídeo
        mainVideo.src = videos[0].src;
        mainVideo.load();

        // Adicionar estilos para a playlist
        addPlaylistStyles();

        // Reproduzir automaticamente
        mainVideo.play().catch(e => {
            console.log('Autoplay bloqueado, clique para reproduzir');
        });

    }, 500);
}

// Adicionar estilos para playlist
function addPlaylistStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .video-playlist {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            padding: 20px;
            max-width: 250px;
            backdrop-filter: blur(10px);
        }
        
        .video-playlist h3 {
            color: #E50914;
            font-size: 1.2rem;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .playlist-items {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .playlist-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .playlist-item:hover {
            background: rgba(229, 9, 20, 0.3);
            transform: translateX(5px);
        }
        
        .playlist-item.active {
            background: #E50914;
        }
        
        .video-number {
            font-weight: bold;
            color: #ffffff;
            min-width: 25px;
        }
        
        .video-title {
            color: #ffffff;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .video-playlist {
                position: static;
                max-width: 100%;
                margin-top: 10px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Trocar vídeo
function changeVideo(index) {
    if (index >= 0 && index < videos.length) {
        currentVideoIndex = index;

        // Atualizar fonte do vídeo
        mainVideo.src = videos[index].src;
        mainVideo.load();
        mainVideo.play().catch(e => {
            console.log('Erro ao reproduzir vídeo');
        });

        // Atualizar playlist visual
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Abrir modal de foto
function openPhotoModal(card) {
    const title = card.dataset.title;
    const description = card.dataset.description;
    const imgSrc = card.querySelector('img').src;

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalImage.src = imgSrc;
    modalImage.alt = title;

    photoModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Animação de entrada
    setTimeout(() => {
        photoModal.style.opacity = '1';
    }, 10);
}

// Fechar modal de foto
function closePhotoModal() {
    photoModal.style.opacity = '0';
    setTimeout(() => {
        photoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Animações no scroll
function handleScroll() {
    const elements = document.querySelectorAll('.netflix-row, .photo-card');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// Inicializar animações
function initializeAnimations() {
    // Animação dos corações flutuantes
    const hearts = document.querySelectorAll('.floating-hearts .heart');

    setInterval(() => {
        hearts.forEach((heart, index) => {
            setTimeout(() => {
                heart.style.animation = 'none';
                setTimeout(() => {
                    heart.style.animation = 'floatHeart 6s ease-in-out infinite';
                }, 10);
            }, index * 1000);
        });
    }, 30000);

    // Efeito de hover nas rows do Netflix
    const rows = document.querySelectorAll('.row-content');
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'translateX(-10px)';
        });

        row.addEventListener('mouseleave', () => {
            row.style.transform = 'translateX(0)';
        });
    });

    // Parallax suave no hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-background');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Adicionar efeitos sonoros (simulados com vibrações no mobile)
function playClickSound() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Adicionar som aos cliques
document.addEventListener('click', (e) => {
    if (e.target.matches('.play-button, .photo-card, .playlist-item')) {
        playClickSound();
    }
});

// Easter egg - duplo clique no título
let clickCount = 0;
const heroTitle = document.querySelector('.hero-title');

heroTitle.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 2) {
        // Criar chuva de corações
        createHeartRain();
        clickCount = 0;
    }

    setTimeout(() => {
        clickCount = 0;
    }, 500);
});

// Chuva de corações (easter egg)
function createHeartRain() {
    const heartRain = document.createElement('div');
    heartRain.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        heart.textContent = ['💕', '❤️', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
        heart.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 20}px;
            left: ${Math.random() * 100}%;
            animation: heartFall ${Math.random() * 3 + 2}s linear forwards;
            opacity: 0.8;
        `;
        heartRain.appendChild(heart);
    }

    // Adicionar animação CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartFall {
            0% {
                transform: translateY(-100px) rotate(0deg);
                opacity: 0.8;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(heartRain);

    // Remover após animação
    setTimeout(() => {
        document.body.removeChild(heartRain);
        document.head.removeChild(style);
    }, 5000);
}

console.log('🎉 Site de aniversário carregado com suas fotos e vídeos! Te amo! 💕');