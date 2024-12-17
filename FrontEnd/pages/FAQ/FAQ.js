document.addEventListener('DOMContentLoaded', () => {
    new FAQManager();
});


class FAQManager {
    constructor() {
        this.faqList = document.querySelector('.faq-list');
        this.init();
    }

    async init() {
        try {
            const faqs = await this.fetchFAQs();
            this.renderFAQs(faqs);
            this.attachEventListeners();
        } catch (error) {
            console.error('FAQ 로드 중 오류 발생:', error);
            this.attachEventListeners(); // for test only
        }
    }

    async fetchFAQs() {
        const response = await fetch('NEEDUPDATE.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('FAQ 데이터를 불러오는데 실패했습니다');
        }

        return await response.json();
    }

    renderFAQs(faqs) {
        this.faqList.innerHTML = faqs.map((faq, index) => `
            <div class="faq-item">
                <div class="faq-question" data-faq-index="${index}">
                    <div class="question-text">
                        <span class="question-icon">Q.</span>
                        <span>${faq.question}</span>
                    </div>
                    <svg class="dropdown-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8L12 16L20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="faq-answer">
                    <span class="Answer-icon">A.</span>
                    <br>
                    <hr>
                    <span>
                    ${faq.answer}
                    </span>
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        const questions = document.querySelectorAll('.faq-question');

        questions.forEach(question => {
            question.addEventListener('click', (e) => {
                const faqItem = question.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');
                const dropdownIcon = question.querySelector('.dropdown-icon');

                // 현재 클릭된 항목 외의 다른 모든 FAQ 닫기
                questions.forEach(q => {
                    if (q !== question) {
                        q.classList.remove('active');
                        q.nextElementSibling.classList.remove('show');
                        q.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
                    }
                });

                // 현재 클릭된 FAQ 토글
                question.classList.toggle('active');
                answer.classList.toggle('show');
                dropdownIcon.style.transform = answer.classList.contains('show')
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)';
            });
        });
    }
}


