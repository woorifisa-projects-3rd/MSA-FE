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

    // 정상확인

    // 한번 더 호출 근데, 일부러 에러날만한 데이터

    // 에러데이터 정상적으로 오는지 확인

  
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
      cy.contains('이메일이 발송되었습니다. 확인해주세요.', { timeout: 15000 }).should('be.visible');
  
      // 받은 인증번호를 입력
      // 이메일 인증 단계를 건너뛰기 위해 모의 성공 상태를 처리
      cy.window().then((win) => {
        win.localStorage.setItem('emailConfirmed', 'true'); // 로컬 스토리지에 인증 상태 저장
      });
    });
  
    it('이메일 인증 단계를 건너뛰고 회원가입을 성공적으로 진행', () => {
      // 로컬 스토리지를 사용하여 이메일 인증 단계를 건너뜀
      cy.window().then((win) => {
        win.localStorage.setItem('emailConfirmed', 'true'); // 이메일 인증 완료 상태 설정
      });
    
      // 회원가입 입력값 작성
      cy.get("input[name='name']").type('홍길동');
      cy.get("input[name='birthDate']").type('1990-01-01');
      cy.get("input[name='postcode']").type('12345', { force: true });
      cy.get("input[name='basicAddress']").type('서울특별시 중구', { force: true });
      cy.get("input[name='detailAddress']").type('상세주소');
      cy.get("input[name='phoneNumber']").type('01012345678');
      cy.get("input[name='email']").type('testuser@example.com');
      cy.get("input[name='password']").type('password123');
      cy.get("input[name='confirmPassword']").type('password123');
    
      // 제출 버튼 클릭
      cy.get("button[type='submit']").click();

      // alert 창 확인
      cy.on('window:alert', (text) => {
        expect(text).to.equal('회원가입이 완료되었습니다!');
      });

    });
  });
  