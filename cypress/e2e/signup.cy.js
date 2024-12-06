describe('회원가입 페이지 테스트', () => {
    beforeEach(() => {
      cy.visit('/signup'); // 회원가입 페이지 URL
    });
  
    it('모든 입력 필드가 표시되는지 확인', () => {
      // 각 필드와 버튼이 화면에 렌더링되었는지 확인
      cy.get("input[name='name']").should('be.visible');
      cy.get("input[name='birthDate']").should('be.visible');
      cy.get("input[name='postcode']").should('be.visible');
      cy.get("input[name='basicAddress']").should('be.visible');
      cy.get("input[name='detailAddress']").should('be.visible');
      cy.get("input[name='phoneNumber']").should('be.visible');
      cy.get("input[name='email']").should('be.visible');
      cy.get("input[name='emailConfirm']").should('be.visible');
      cy.get("input[name='password']").should('be.visible');
      cy.get("input[name='confirmPassword']").should('be.visible');
      cy.get("button[type='submit']").should('be.visible');
    });
  
    it('유효하지 않은 입력값에 대한 오류 메시지가 표시되는지 확인', () => {
      // 각 필드를 비워둔 상태로 제출
      cy.get("button[type='submit']").click();
  
      // 오류 메시지 확인
      cy.contains('필수 항목입니다.').should('be.visible');
      cy.contains('필수 항목입니다.').should('be.visible');
      cy.contains('필수 항목입니다.').should('be.visible');
      cy.contains('필수 항목입니다.').should('be.visible');
      cy.contains('필수 항목입니다.').should('be.visible');
      cy.contains('유효한 전화번호를 입력해주세요. 예) 01011112222').should('be.visible');
      cy.contains('유효한 이메일을 입력해주세요. 예) abc@gmail.com').should('be.visible');
      cy.contains('필수 항목입니다.').should('be.visible');
      cy.contains('비밀번호는 최소 8자리로 특수문자(!@#$%^&*(),.?":{}|<></>), 숫자, 영문자를 포함해야 합니다.').should('be.visible');
      cy.contains('필수 항목입니다.').should('be.visible');
    });
  
    it('이메일 인증번호 발송 및 확인 로직이 작동하는지 확인', () => {
      // 이메일 입력 후 인증번호 발송
      cy.get("input[name='email']").type('apple6346654@gamil.com');
      cy.get("button").contains('인증번호 발송').click();
  
      // 성공 메시지 확인
      cy.contains('이메일이 발송되었습니다. 확인해주세요.').should('be.visible');
  
      // 받은 인증번호를 입력
      cy.get("input[name='emailConfirm']").type('123456'); // 테스트용 인증번호
      cy.get("button").contains('확인').click();
  
      // 인증 성공 메시지 확인
      cy.contains('이메일 인증이 완료되었습니다.').should('be.visible');
    });
  
   it('유효한 데이터를 입력하면 회원가입이 성공적으로 이루어지는지 확인', () => {
  cy.intercept('POST', '/auth/signup').as('signupRequest');

  cy.get("input[name='name']").type('홍길동');
  cy.get("input[name='birthDate']").type('1990-01-01');
  cy.get("input[name='postcode']").type('12345', { force: true });
  cy.get("input[name='basicAddress']").type('서울특별시 중구', { force: true });
  cy.get("input[name='detailAddress']").type('상세주소');
  cy.get("input[name='phoneNumber']").type('01012345678');

  // 이메일 인증 단계를 건너뜀
  cy.window().then((win) => {
    win.document.querySelector("input[name='emailConfirm']").__reactInternalInstance$.return.stateNode.setState({
      isEmailConfirmed: true,
    });
  });

  cy.get("input[name='password']").type('password123');
  cy.get("input[name='confirmPassword']").type('password123');

  // 제출 버튼 클릭
  cy.get("button[type='submit']").click();

  // 서버 응답 확인
  cy.wait('@signupRequest').then((interception) => {
    expect(interception.response.statusCode).to.eq(200); // 요청 성공 여부 확인
  });

  // 리다이렉트 확인
  cy.url({ timeout: 10000 }).should('include', '/login');
});
  });
  