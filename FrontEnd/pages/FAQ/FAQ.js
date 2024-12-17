document.addEventListener('DOMContentLoaded', () => {
    new FAQManager();
});


class FAQManager {
    constructor() {
        this.faqList = document.querySelector('.faq-list');
        this.isAdmin = false;
        this.init();
    }

    async init() {
        try {
            const response = await this.fetchFAQs();
            this.isAdmin = response.isAdmin;
            this.renderFAQs(response.faqs);
            this.attachEventListeners();
        } catch (error) {
            console.error('FAQ 로드 중 오류 발생:', error);
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
        const adminControls = this.isAdmin ? `
            <svg class="delete-icon" width="24" height="24" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
        ` : '';

        this.faqList.innerHTML = faqs.map((faq, index) => `
            <div class="faq-item" data-id="${faq.id}">
                <div class="faq-question" data-faq-index="${index}">
                    ${adminControls}
                    <div class="question-text">
                        <span class="question-icon">Q.</span>
                        <span class="editable-text">${faq.question}</span>
                    </div>
                    <svg class="dropdown-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M4 8L12 16L20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="faq-answer">
                    <span class="Answer-icon">A.</span>
                    <span class="editable-text">${faq.answer}</span>
                    ${this.isAdmin ? `
                        <div class="edit-controls">
                            <button class="save-btn">저장</button>
                            <button class="cancel-btn">취소</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    attachEventListeners() {
        const questions = document.querySelectorAll('.faq-question');

        questions.forEach(question => {
            question.addEventListener('click', (e) => {
                if (e.target.closest('.delete-icon')) return;

                const faqItem = question.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');
                const dropdownIcon = question.querySelector('.dropdown-icon');

                questions.forEach(q => {
                    if (q !== question) {
                        q.classList.remove('active');
                        q.nextElementSibling.classList.remove('show');
                        q.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
                    }
                });

                question.classList.toggle('active');
                answer.classList.toggle('show');
                dropdownIcon.style.transform = answer.classList.contains('show')
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)';
            });
        });

        if (this.isAdmin) {
            this.attachAdminEventListeners();
        }
    }

    attachAdminEventListeners() {
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('정말 삭제하시겠습니까?')) {
                    const faqItem = icon.closest('.faq-item');
                    const id = faqItem.dataset.id;
                    await this.deleteFAQ(id);
                }
            });
        });

        document.querySelectorAll('.editable-text').forEach(text => {
            text.addEventListener('dblclick', (e) => {
                if (!this.isAdmin) return;
                const faqItem = text.closest('.faq-item');
                this.enableEditMode(faqItem);
            });
        });
    }

    async deleteFAQ(id) {
        try {
            const response = await fetch('NEEDUPDATE.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (response.ok) {
                await this.init();
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
        }
    }

    enableEditMode(faqItem) {
        const questionText = faqItem.querySelector('.question-text .editable-text');
        const answerText = faqItem.querySelector('.faq-answer .editable-text');
        const controls = faqItem.querySelector('.edit-controls');

        questionText.contentEditable = true;
        answerText.contentEditable = true;
        controls.style.display = 'block';

        const originalQuestion = questionText.textContent;
        const originalAnswer = answerText.textContent;

        controls.querySelector('.save-btn').onclick = () => this.saveFAQ(faqItem);
        controls.querySelector('.cancel-btn').onclick = () => {
            questionText.textContent = originalQuestion;
            answerText.textContent = originalAnswer;
            this.disableEditMode(faqItem);
        };
    }

    disableEditMode(faqItem) {
        const questionText = faqItem.querySelector('.question-text .editable-text');
        const answerText = faqItem.querySelector('.faq-answer .editable-text');
        const controls = faqItem.querySelector('.edit-controls');

        questionText.contentEditable = false;
        answerText.contentEditable = false;
        controls.style.display = 'none';
    }

    async saveFAQ(faqItem) {
        const id = faqItem.dataset.id;
        const question = faqItem.querySelector('.question-text .editable-text').textContent;
        const answer = faqItem.querySelector('.faq-answer .editable-text').textContent;

        try {
            const response = await fetch('NEEDUPDATE.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, question, answer })
            });

            if (response.ok) {
                this.disableEditMode(faqItem);
                await this.init();
            }
        } catch (error) {
            console.error('저장 중 오류 발생:', error);
        }
    }
}


