<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>진료실 호출</title>
  <link rel="stylesheet" href="call.css">
</head>
<body>

<main>
<h1>진료실 호출</h1>
<div class="container">
    <!-- 테이블 -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>접수시간</th>
            <th>주민번호</th>
            <th>휴대폰</th>
            <th>주소</th>
            <th>방문목적</th>
            <th>자보회사</th>
            <th>접수코드</th>
            <th>담당자이름</th>
            <th>담당자번호</th>
            <th>서류</th>
            <th>호출</th>
          </tr>
        </thead>
        <tbody id="patient-list">
          <tr><td colspan="13" class="loading">데이터 로딩 중...</td></tr>
        </tbody>
      </table>
    </div>
</div>
</main>
  <script src="call.js"></script>
</body>
</html>
