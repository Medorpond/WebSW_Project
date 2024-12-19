<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>보험사 관리</title>
  <link rel="stylesheet" href="editinsurance.css">
</head>
<body>
<header id="headerSection"></header>
<main>
  <section class="insurance-management">
    <h1>보험사 관리</h1>
    <div class="container">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>보험사 코드</th>
                <th>보험사 이름</th>
                <th>작업</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody id="insurance-list">
              <tr><td colspan="4" class="loading">데이터 로딩 중...</td></tr>
            </tbody>
          </table>
          <button id="addRowBtn">보험사 추가</button>
        </div>
    </div>
  </section>
</main>
<footer></footer>
<script src="/FrontEnd/pages/layout/layoutLoader.js"></script>
<script>
// 보험사 목록 불러오기
async function fetchInsurances() {
    try {
        const response = await fetch('process.php');
        const data = await response.json();

        const tbody = document.getElementById('insurance-list');
        tbody.innerHTML = '';

        data.forEach((insurance, index) => {
            const row = createRow(index + 1, insurance.Insurance_list_id, insurance.code, insurance.insurance_list);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('데이터 로딩 오류:', error);
    }
}

// 행 생성 함수제
function createRow(number, id, code, name) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${number}</td>
        <td class="insurance-code" data-id="${id}">${code}</td>
        <td class="insurance-name" data-id="${id}">${name}</td>
        <td>
            <button class="edit-btn" onclick="enableEdit(this, ${id})">수정</button>
        </td>
        <td>
            <button class="delete-btn" onclick="deleteInsurance(this, ${id})">삭제</button>
        </td>
    `;
    return row;
}

// 수정 활성화
function enableEdit(button, id) {
    const row = button.closest('tr');
    const codeCell = row.querySelector('.insurance-code');
    const nameCell = row.querySelector('.insurance-name');

    codeCell.contentEditable = true;
    nameCell.contentEditable = true;

    // 버튼 업데이트
    button.textContent = '저장';
    button.classList.replace('edit-btn', 'save-btn');
    button.setAttribute('onclick', `saveInsurance(this, ${id})`);
}


// 저장
async function saveInsurance(button, id) {
    const row = button.closest('tr');
    const code = row.querySelector('.insurance-code').textContent.trim();
    const name = row.querySelector('.insurance-name').textContent.trim();

    if (!code || !name) {
        alert('보험사 코드와 이름을 입력하세요.');
        return;
    }

    const action = id ? 'update' : 'add';

    try {
        const response = await fetch('process.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: action,         
                Insurance_list_id: id,  // 수정 시 ID 포함
                insurance_list: name,
                code: code
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            fetchInsurances();  // 목록 새로고침
        } else {
            alert(result.message || '저장 실패');
        }
    } catch (error) {
        console.error('저장 오류:', error);
    }
}


// 행 추가 버튼
const addRowBtn = document.getElementById('addRowBtn');
addRowBtn.addEventListener('click', () => {
    const tbody = document.getElementById('insurance-list');
    const newRow = createRow(tbody.rows.length + 1, '', '', '');
    tbody.appendChild(newRow);
});

async function deleteInsurance(button, id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
        const response = await fetch('process.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'delete',
                Insurance_list_id: id   // 필드 이름 수정
            })
        });

        const result = await response.json();
        if (result.success) {
            alert(result.message);
            fetchInsurances();  // 목록 새로고침
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('삭제 오류:', error);
    }
}


// 페이지 로딩 시 데이터 로드
fetchInsurances();
</script>
</body>
</html>
