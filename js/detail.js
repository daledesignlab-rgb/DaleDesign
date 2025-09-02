// Detail Page JavaScript
class ProjectDetail {
    constructor() {
        this.project = null;
        this.currentImageIndex = 0;
        this.init();
    }

    async init() {
        try {
            await this.loadProjectData();
            this.setupEventListeners();
            this.renderProjectDetail();
        } catch (error) {
            console.error('상세 페이지 초기화 오류:', error);
            this.showError('프로젝트 정보를 불러오는 중 오류가 발생했습니다.');
        }
    }

    async loadProjectData() {
        try {
            // URL에서 프로젝트 ID 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('id');

            if (!projectId) {
                throw new Error('프로젝트 ID가 지정되지 않았습니다.');
            }

            // 프로젝트 데이터 로드
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.project = data.projects.find(p => p.id === projectId);

            if (!this.project) {
                throw new Error('해당 프로젝트를 찾을 수 없습니다.');
            }

            // 페이지 제목 업데이트
            document.title = `${this.project.title} - Dale Design`;

        } catch (error) {
            console.error('프로젝트 데이터 로딩 오류:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // 이미지 갤러리 네비게이션
        document.addEventListener('click', (e) => {
            if (e.target.matches('.gallery-nav button')) {
                this.handleGalleryNavigation(e.target);
            }
            
            if (e.target.closest('.thumbnail')) {
                this.handleThumbnailClick(e.target.closest('.thumbnail'));
            }
        });

        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
                case 'Home':
                    this.goToFirstImage();
                    break;
                case 'End':
                    this.goToLastImage();
                    break;
            }
        });

        // 터치 제스처 (모바일)
        this.setupTouchGestures();
    }

    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        const galleryMain = document.querySelector('.gallery-main');
        if (!galleryMain) return;

        galleryMain.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        galleryMain.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            this.handleSwipe(startX, endX, startY, endY);
        });
    }

    handleSwipe(startX, endX, startY, endY) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // 수평 스와이프가 수직 스와이프보다 클 때만 처리
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                // 왼쪽으로 스와이프 - 다음 이미지
                this.nextImage();
            } else if (diffX < -50) {
                // 오른쪽으로 스와이프 - 이전 이미지
                this.previousImage();
            }
        }
    }

    handleGalleryNavigation(button) {
        if (button.textContent.includes('이전')) {
            this.previousImage();
        } else if (button.textContent.includes('다음')) {
            this.nextImage();
        }
    }

    handleThumbnailClick(thumbnail) {
        const index = parseInt(thumbnail.dataset.index);
        this.goToImage(index);
    }

    previousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
        } else {
            this.currentImageIndex = this.project.images.length - 1;
        }
        this.updateGallery();
    }

    nextImage() {
        if (this.currentImageIndex < this.project.images.length - 1) {
            this.currentImageIndex++;
        } else {
            this.currentImageIndex = 0;
        }
        this.updateGallery();
    }

    goToFirstImage() {
        this.currentImageIndex = 0;
        this.updateGallery();
    }

    goToLastImage() {
        this.currentImageIndex = this.project.images.length - 1;
        this.updateGallery();
    }

    goToImage(index) {
        this.currentImageIndex = index;
        this.updateGallery();
    }

    updateGallery() {
        // 메인 이미지 업데이트
        const mainImage = document.querySelector('.gallery-main img');
        if (mainImage) {
            mainImage.src = this.project.images[this.currentImageIndex];
            mainImage.alt = `${this.project.title} - 이미지 ${this.currentImageIndex + 1}`;
        }

        // 썸네일 활성 상태 업데이트
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentImageIndex);
        });

        // 네비게이션 버튼 상태 업데이트
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevButton = document.querySelector('.gallery-nav button:first-child');
        const nextButton = document.querySelector('.gallery-nav button:last-child');

        if (prevButton) {
            prevButton.disabled = this.currentImageIndex === 0;
        }
        if (nextButton) {
            nextButton.disabled = this.currentImageIndex === this.project.images.length - 1;
        }
    }

    renderProjectDetail() {
        const detailContainer = document.getElementById('projectDetail');
        
        detailContainer.innerHTML = `
            <div class="project-header">
                <h1>${this.project.title}</h1>
                <p class="description">${this.project.description}</p>
            </div>

            <div class="project-info-grid">
                <div class="info-item">
                    <h3>참여 기간</h3>
                    <p>${this.project.period}</p>
                </div>
                <div class="info-item">
                    <h3>고객사</h3>
                    <p>${this.project.client}</p>
                </div>
                <div class="info-item">
                    <h3>업종</h3>
                    <p>${this.project.industry}</p>
                </div>
                <div class="info-item">
                    <h3>스타일</h3>
                    <p>${this.project.style}</p>
                </div>
            </div>

            <div class="image-gallery">
                <h3>프로젝트 이미지</h3>
                <div class="gallery-main">
                    <img src="${this.project.images[0]}" alt="${this.project.title} - 메인 이미지">
                </div>
                
                <div class="gallery-nav">
                    <button type="button">이전</button>
                    <span>${this.currentImageIndex + 1} / ${this.project.images.length}</span>
                    <button type="button">다음</button>
                </div>
                
                <div class="gallery-thumbnails">
                    ${this.project.images.map((image, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${image}" alt="${this.project.title} - 썸네일 ${index + 1}">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="color-display">
                <h3>메인 컬러</h3>
                <div class="color-info">
                    <div class="color-circle" style="background-color: ${this.project.mainColor}"></div>
                    <span class="color-code">${this.project.mainColor}</span>
                </div>
            </div>
        `;

        // 갤러리 초기화
        this.updateNavigationButtons();
    }

    showError(message) {
        const detailContainer = document.getElementById('projectDetail');
        detailContainer.innerHTML = `
            <div class="error">
                <p>${message}</p>
                <button onclick="window.location.href='index.html'" class="filter-btn">메인으로 돌아가기</button>
            </div>
        `;
    }

    // 이미지 지연 로딩
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });

        // 지연 로딩 이미지 관찰
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 이미지 확대/축소 (향후 확장용)
    setupImageZoom() {
        const mainImage = document.querySelector('.gallery-main img');
        if (!mainImage) return;

        let isZoomed = false;
        let originalTransform = '';

        mainImage.addEventListener('click', () => {
            if (!isZoomed) {
                originalTransform = mainImage.style.transform;
                mainImage.style.transform = 'scale(1.5)';
                mainImage.style.cursor = 'zoom-out';
                isZoomed = true;
            } else {
                mainImage.style.transform = originalTransform;
                mainImage.style.cursor = 'zoom-in';
                isZoomed = false;
            }
        });

        mainImage.style.cursor = 'zoom-in';
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ProjectDetail();
});

// 브라우저 뒤로가기/앞으로가기 처리
window.addEventListener('popstate', () => {
    // 페이지 새로고침으로 처리
    window.location.reload();
});

// 페이지 가시성 변경 감지 (탭 전환 시)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 페이지가 숨겨질 때 (탭 전환 등)
        console.log('페이지가 숨겨짐');
    } else {
        // 페이지가 다시 보일 때
        console.log('페이지가 다시 보임');
    }
});

// 성능 모니터링
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('상세 페이지 로드 시간:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
});

// 오프라인 지원
window.addEventListener('online', () => {
    console.log('온라인 상태로 전환');
    // 필요시 데이터 새로고침
});

window.addEventListener('offline', () => {
    console.log('오프라인 상태로 전환');
    // 오프라인 메시지 표시
});
