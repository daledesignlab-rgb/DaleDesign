// Main Page JavaScript
class ProjectGallery {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        try {
            await this.loadProjects();
            this.setupEventListeners();
            this.renderProjects();
        } catch (error) {
            console.error('초기화 오류:', error);
            this.showError('프로젝트를 불러오는 중 오류가 발생했습니다.');
        }
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.projects = data.projects;
            this.filteredProjects = [...this.projects];
        } catch (error) {
            console.error('프로젝트 로딩 오류:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // 필터 버튼 이벤트
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // 프로젝트 카드 클릭 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.closest('.project-card')) {
                const projectCard = e.target.closest('.project-card');
                const projectId = projectCard.dataset.projectId;
                this.navigateToDetail(projectId);
            }
        });

        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement.classList.contains('filter-btn')) {
                this.handleFilterClick(document.activeElement);
            }
        });
    }

    handleFilterClick(button) {
        // 이전 활성 버튼 비활성화
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 클릭된 버튼 활성화
        button.classList.add('active');

        // 필터 적용
        const filter = button.dataset.filter;
        this.currentFilter = filter;
        this.filterProjects(filter);
        this.renderProjects();
    }

    filterProjects(filter) {
        if (filter === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                project.category === filter
            );
        }
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (this.filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-projects">
                    <p>해당 카테고리의 프로젝트가 없습니다.</p>
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = this.filteredProjects.map(project => 
            this.createProjectCard(project)
        ).join('');

        // 애니메이션 효과
        this.animateProjectCards();
    }

    createProjectCard(project) {
        return `
            <div class="project-card" data-project-id="${project.id}" tabindex="0">
                <img src="${project.thumbnail}" alt="${project.title}" loading="lazy">
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-meta">
                        <span>${project.industry}</span>
                        <span>${project.style}</span>
                    </div>
                    <p class="project-description">${project.description}</p>
                </div>
            </div>
        `;
    }

    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    navigateToDetail(projectId) {
        // 상세 페이지로 이동
        window.location.href = `detail.html?id=${projectId}`;
    }

    showError(message) {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = `
            <div class="error">
                <p>${message}</p>
                <button onclick="location.reload()" class="filter-btn">다시 시도</button>
            </div>
        `;
    }

    // 검색 기능 (향후 확장용)
    searchProjects(query) {
        if (!query.trim()) {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                project.title.toLowerCase().includes(query.toLowerCase()) ||
                project.description.toLowerCase().includes(query.toLowerCase()) ||
                project.industry.toLowerCase().includes(query.toLowerCase()) ||
                project.style.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.renderProjects();
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ProjectGallery();
});

// 서비스 워커 등록 (PWA 지원)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW 등록 성공:', registration);
            })
            .catch(registrationError => {
                console.log('SW 등록 실패:', registrationError);
            });
    });
}

// 이미지 지연 로딩 최적화
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

// 지연 로딩 이미지 관찰 시작
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
});

// 성능 모니터링
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('페이지 로드 시간:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }
});
