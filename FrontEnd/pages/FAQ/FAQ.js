document.addEventListener('DOMContentLoaded', () => {
    new FAQManager();
});


class FAQManager {
    constructor() {
        this.faqList = document.querySelector('.faq-list');
        this.isAdmin = false;
        this.init();
        this.addButton = null;
        this.isEditing = false;
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
        const response = await fetch('/BackEnd/php/FAQ.php', {
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
        // 기존 add 버튼이 있다면 제거
        const existingAddButton = document.querySelector('.add-faq-button');
        if (existingAddButton) {
            existingAddButton.remove();
        }

        const adminControls = this.isAdmin ? `
        <svg class="delete-icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
    ` : '';

        this.faqList.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item" data-id="${faq.faq_id}">
            <div class="faq-question" data-faq-index="${index}">
                ${adminControls}
                <div class="question-text">
                    <span class="question-icon">Q.</span>
                    <span class="editable-text">${faq.title}</span>
                </div>
                <svg class="dropdown-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 8L12 16L20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="faq-answer">
                <span class="Answer-icon">A.</span>
                <span class="editable-text">${faq.content}</span>
                ${this.isAdmin ? `
                    <div class="edit-controls">
                        <button class="save-btn">저장</button>
                        <button class="cancel-btn">취소</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');

        // 관리자인 경우에만 새로운 add 버튼 추가
        if (this.isAdmin) {
            this.faqList.insertAdjacentHTML('afterend', `
            <div class="add-faq-button">
                <span>+</span>
            </div>
        `);
            this.addButton = document.querySelector('.add-faq-button');
            this.addButton.addEventListener('click', () => this.showNewFAQForm());
        }
    }



    attachEventListeners() {
        const questions = document.querySelectorAll('.faq-question');

        // FAQ 질문 클릭 이벤트
        questions.forEach(question => {
            question.addEventListener('click', (e) => {
                e.stopPropagation(); // 이벤트 버블링 중단
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

        // 문서 전체 클릭 이벤트
        document.addEventListener('click', (e) => {
            // FAQ 컨테이너 내부 클릭이면서 수정 중이면 무시
            if (e.target.closest('.faq-container') && this.isEditing) {
                return;
            }

            // FAQ 영역 외부 클릭시에만 모든 FAQ 닫기
            if (!e.target.closest('.faq-container')) {
                questions.forEach(question => {
                    question.classList.remove('active');
                    question.nextElementSibling.classList.remove('show');
                    question.querySelector('.dropdown-icon').style.transform = 'rotate(0deg)';
                });
            }
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

            document.querySelectorAll('.editable-text').forEach(text => {
                text.addEventListener('dblclick', (e) => {
                    if (!this.isAdmin) return;
                    e.stopPropagation(); // 이벤트 전파 중단

                    const faqItem = text.closest('.faq-item');
                    const answer = faqItem.querySelector('.faq-answer');
                    const question = faqItem.querySelector('.faq-question');

                    // FAQ 항목 강제 열기
                    answer.classList.add('show');
                    question.classList.add('active');
                    question.querySelector('.dropdown-icon').style.transform = 'rotate(180deg)';

                    this.enableEditMode(faqItem);
                });
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
            const response = await fetch('/BackEnd/php/FAQ.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ faq_id: id })
            });

            if (response.ok) {
                await this.init();
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
        }
    }


    enableEditMode(faqItem) {
        this.isEditing = true;
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
        this.isEditing = false;
        const questionText = faqItem.querySelector('.question-text .editable-text');
        const answerText = faqItem.querySelector('.faq-answer .editable-text');
        const controls = faqItem.querySelector('.edit-controls');

        questionText.contentEditable = false;
        answerText.contentEditable = false;
        controls.style.display = 'none';
    }

    async saveFAQ(faqItem) {
        const faq_id = faqItem.dataset.id;
        const title = faqItem.querySelector('.question-text .editable-text').textContent;
        const content = faqItem.querySelector('.faq-answer .editable-text').textContent;

        try {
            const response = await fetch('/BackEnd/php/FAQ.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ faq_id, title, content })
            });

            if (response.ok) {
                this.disableEditMode(faqItem);
                await this.init();
            }
        } catch (error) {
            console.error('저장 중 오류 발생:', error);
        }
        this.isEditing = false;
    }



    showNewFAQForm() {
        // 이미 열려있는 새 FAQ 폼이 있다면 제거
        const existingNewFAQ = document.querySelector('.new-faq-item');
        if (existingNewFAQ) {
            existingNewFAQ.remove();
        }

        const newFAQHtml = `
            <div class="faq-item new-faq-item show">
                <div class="faq-question">
                    <div class="question-text">
                        <span class="question-icon">Q.</span>
                        <span class="editable-text" contenteditable="true"></span>
                    </div>
                </div>
                <div class="faq-answer show">
                    <span class="Answer-icon">A.</span>
                    <span class="editable-text" contenteditable="true"></span>
                    <div class="edit-controls" style="display: block;">
                        <button class="save-btn">저장</button>
                        <button class="cancel-btn">취소</button>
                    </div>
                </div>
            </div>
        `;

        this.addButton.insertAdjacentHTML('beforebegin', newFAQHtml);

        const newFAQItem = document.querySelector('.new-faq-item');
        const saveBtn = newFAQItem.querySelector('.save-btn');
        const cancelBtn = newFAQItem.querySelector('.cancel-btn');

        saveBtn.addEventListener('click', () => this.saveNewFAQ(newFAQItem));
        cancelBtn.addEventListener('click', () => newFAQItem.remove());
    }

    async saveNewFAQ(faqItem) {
        const title = faqItem.querySelector('.question-text .editable-text').textContent;
        const content = faqItem.querySelector('.faq-answer .editable-text').textContent;

        if (!title.trim() || !content.trim()) {
            alert('질문과 답변을 모두 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('/BackEnd/php/FAQ.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                const newFaqItem = document.querySelector('.new-faq-item');
                if (newFaqItem) {
                    newFaqItem.remove(); // 추가 필드 제거
                }
                await this.init();
            }
        } catch (error) {
            console.error('FAQ 추가 중 오류 발생:', error);
        }
    }
}


