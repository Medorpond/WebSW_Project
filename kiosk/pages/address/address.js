function openAddressPopup() {
    new daum.Postcode({
      oncomplete: function (data) {
        console.log(data);
  
        // 필드 가져오기
        const addressInput = document.getElementById("address-input"); // 전체 주소
        const sidoInput = document.getElementById("sido-input"); // 시도
        const sigunguInput = document.getElementById("sigungu-input"); // 시군구
        const bnameInput = document.getElementById("bname-input"); // 읍면동
        const buildingnameInput = document.getElementById("buildingname-input"); // 건물이름
  
        const address = data.roadAddress || data.jibunAddress;
  
        addressInput.value = address;
        sidoInput.value = data.sido;
        sigunguInput.value = data.sigungu;
        bnameInput.value = data.bname;
        buildingnameInput.value = data.buildingName;
        
      },
    }).open();
  }
  