// 환자 목록 가져오기
async function fetchPatients() {
    try {
        const response = await fetch("call-process.php");
        const data = await response.json();

        const tbody = document.getElementById("patient-list");
        tbody.innerHTML = ""; // 테이블 초기화

        if (data.status === "success" && data.data.length > 0) {
            data.data.forEach((patient, index) => {
                const documents = parseDocuments(patient.documents);

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${patient.name}</td>
                    <td>${patient.received_at}</td>
                    <td>${patient.ssh}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.address}</td>
                    <td>${patient.visit_purpose || "미지정"}</td>
                    <td>${patient.insurance_company || "N/A"}</td>
                    <td>${patient.application_code || "N/A"}</td>
                    <td>${patient.manager_name || "N/A"}</td>
                    <td>${patient.manager_phone || "N/A"}</td>
                    <td>${documents}</td>
                    <td>
                        <button class="call-btn ${patient.call === '1' ? 'disabled' : ''}" 
                                data-id="${patient.application_id}" 
                                data-status="${patient.call}">
                            ${patient.call === "0" ? "호출" : "호출됨"}
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            attachCallButtonEvents(); // 호출 버튼 이벤트 추가
        } else {
            tbody.innerHTML = `<tr><td colspan="13">대기 중인 환자가 없습니다.</td></tr>`;
        }
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

// 문서 배열 파싱
function parseDocuments(documentsJson) {
    if (!documentsJson) return "없음";

    try {
        const documentsArray = JSON.parse(documentsJson);
        const documentMap = {
            "1": "실비보험서류",
            "2": "진료확인서",
            "3": "기타",
        };

        const documentList = documentsArray
            .filter((doc) => doc !== "0")
            .map((doc) => documentMap[doc])
            .join(", ");

        return documentList || "없음";
    } catch (error) {
        console.error("문서 파싱 오류:", error);
        return "오류";
    }
}

// 호출 버튼 이벤트 연결
function attachCallButtonEvents() {
    const callButtons = document.querySelectorAll(".call-btn");
    callButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const applicationId = button.dataset.id;
            const currentStatus = button.dataset.status;
            const patientName = button.closest("tr").children[1].textContent.trim();

            if (currentStatus == "0") {
                const confirmCall = confirm(`${patientName}님을 호출하시겠습니까?`);
                if (confirmCall) {
                    await updateCallStatus(applicationId, 1); // 호출 상태로 변경
                    alert(`${patientName}님이 호출되었습니다.`);
                }
            } else if (currentStatus == "1") {
                // 사용자 선택 팝업
                const choice = prompt(
                    `${patientName}님에 대한 작업을 선택하세요:\n1: 리스트에서 삭제\n2: 재호출\n\n`,
                    "1"
                );

                if (choice === "1") {
                    await updateCallStatus(applicationId, 2); // 재호출
                    alert(`${patientName}님이 리스트에서 삭제되었습니다.`);
                } else if (choice === "2") {
                    await updateCallStatus(applicationId, 1); // 삭제
                    alert(`${patientName}님이 재호출되었습니다.`);
                }
            }
            fetchPatients(); // 테이블 새로고침
        });
    });
}

// 호출 상태 업데이트 함수
async function updateCallStatus(applicationId, newStatus) {
    try {
        const response = await fetch("call-process.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ application_id: applicationId, status: newStatus }),
        });

        const result = await response.json();
        if (result.status !== "success") {
            alert("호출 상태 업데이트 실패: " + result.message);
        }
    } catch (error) {
        console.error("호출 상태 업데이트 오류:", error);
    }
}

// 5초마다 대기 환자 목록 새로고침
setInterval(fetchPatients, 5000);
fetchPatients(); // 초기 로드
