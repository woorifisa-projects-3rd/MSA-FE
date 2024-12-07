describe('사업장 등록 테스트', () => {
    beforeEach(() => {
        // 쿠키에 토큰 설정
        cy.setCookie(
            'accessToken',
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwYXlsb2FkIjoiL0kvYjlsUlhuVUdoV0NkSzBMajlwUT09IiwiaWF0IjoxNzMzNTU3OTc2LCJleHAiOjE3NDIxOTc5NzZ9.S7WQaOzx7ujcjqIiTmyItOYpHEhEGTjJv5piARmqt-phs-ti_e8xWwJWxoBnlD6N5xdK-nBBWos64q5gEryOGg'
        );
        // 마이페이지로 이동
        cy.visit('/mypage');
    });

    it('사업장 최초 등록 TEST', () => {
         // 탭이 전환된 후 DOM이 렌더링될 시간을 기다림
        cy.contains('내 사업장').click(); // "내 사업장" 탭 클릭
        cy.wait(500); // 약간의 대기 (필요할 경우)

        // 사업장 최초 등록 버튼 클릭
        cy.contains('사업장 추가등록').click({ force: true });

        // 모달이 열렸는지 확인
        cy.contains('사업장 등록').should('be.visible'); 

         // 사업자 정보 입력
        cy.get("input[name='storeName']").type('테스트 사업장'); // 사업장 이름 입력
        cy.get("input[name='businessNumber']").type('1111111111'); // 사업자 번호 입력
         
        // 다음버튼 클릭 
        cy.get('button').contains('다음').should('not.be.disabled').click(); // 버튼 활성화 확인 후 클릭

        
        //--------------------------------계좌인증--------------------------------
        // 계좌 정보 입력
        cy.get("input[name='accountNumber']").type('12345678911'); // 계좌번호 입력

        // 다음버튼 클릭 
        cy.get('button').contains('다음').should('not.be.disabled').click(); // 버튼 활성화 확인 후 클릭



        //------------------------------PIN 번호 입력--------------------------------
        cy.get('[class*="pinContainer"]', { timeout: 10000 }) // 클래스 이름에 "pinContainer"가 포함된 요소 탐색
        .should('exist') // 존재 확인
        .find('input') // 내부의 input 요소 탐색
        .should('have.length', 6) // 6개의 input 확인
        .each((input, index) => {
          cy.wrap(input).type('123456'[index]); // PIN 입력
        });

        // 다음버튼 클릭 
        cy.get('button').contains('PIN 번호 인증하기').should('not.be.disabled').click(); // 버튼 활성화 확인 후 클릭
    });
  });