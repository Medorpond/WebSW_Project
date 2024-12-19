document.addEventListener('DOMContentLoaded', () => {
    fetchInsurances();

    const addInsuranceBtn = document.getElementById('addInsuranceBtn');
    if (addInsuranceBtn) {
        addInsuranceBtn.addEventListener('click', () => {
            openPopup('add');
        });
    }

    document.getElementById('addForm').addEventListener('submit', handleSubmit);
    document.getElementById('closeAddPopup').addEventListener('click', closePopup);
});



// 보험사 목록 가져오기
async function fetchInsurances() {
    try {
        const response = await fetch('process.php');
        const data = await response.json();

        const tbody = document.getElementById('insurance-list');
        tbody.innerHTML = '';

        data.forEach((insurance, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${insurance.code}</td>
                <td>${insurance.insurance_list}</td>
                <td>
                    <button class="edit-btn" onclick="editInsurance(${insurance.id}, '${insurance.name}')">수정</button>
                </td>
                <td>
                    <button class="delete-btn" onclick="deleteInsurance(${insurance.id})">삭제</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('데이터 로딩 오류:', error);
    }
}

// 보험사 추가/수정 팝업 열기
function openPopup(mode, id = '', name = '') {
    // 팝업 선택
    const popup = document.getElementById(mode === 'add' ? 'addPopup' : 'editPopup');
    popup.classList.add('active');

    // 제목 설정
    const title = popup.querySelector('h2');
    title.textContent = mode === 'add' ? '보험사 추가' : '보험사 수정';

    // 숨겨진 ID 필드 참조
    const idInput = popup.querySelector('#insurance-id');
    if (idInput) {
        idInput.value = id; // ID 값 설정
    }

    // 이름 필드 참조
    const nameInput = popup.querySelector(mode === 'add' ? '#newInsuranceName' : '#insuranceName');
    if (nameInput) {
        nameInput.value = name;
    }
}



// 팝업 닫기
function closePopup() {
    document.getElementById('popup').classList.remove('active');
    document.getElementById('popup-form').reset();
}

// 폼 제출 핸들러
async function handleSubmit(event) {
    event.preventDefault();

    const id = document.querySelector('#editForm input[type="hidden"]').value;
    const name = document.querySelector('#editForm input[type="text"]').value;
    const action = id ? 'update' : 'create';

    try {
        const response = await fetch('process.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, id, name })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            closePopup();
            fetchInsurances();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('오류 발생:', error);
    }
}


// 보험사 삭제
async function deleteInsurance(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        const response = await fetch('process.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            fetchInsurances();
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('삭제 오류:', error);
    }
}
