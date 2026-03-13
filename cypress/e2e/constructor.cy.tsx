describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов и возвращаем моковые данные
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Открываем главную страницу
    cy.visit('http://localhost:4000');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      // Находим булку и кликаем кнопку "Добавить"
      cy.contains('Краторная булка N-200i')
        .parents('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Проверяем, что булка добавлена в конструктор (верхняя часть)
      cy.get('[data-testid="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
      // Проверяем нижнюю часть
      cy.get('[data-testid="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i');
    });

    it('должен добавлять начинку в конструктор', () => {
      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Проверяем, что начинка добавлена
      cy.get('[data-testid="constructor-filling"]').should('contain', 'Биокотлета из марсианской Магнолии');
    });

    it('должен добавлять соус в конструктор', () => {
      // Добавляем соус
      cy.contains('Соус Spicy-X')
        .parents('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Проверяем, что соус добавлен
      cy.get('[data-testid="constructor-filling"]').should('contain', 'Соус Spicy-X');
    });

    it('должен добавлять несколько ингредиентов в конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parents('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Добавляем соус
      cy.contains('Соус Spicy-X')
        .parents('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Проверяем, что все ингредиенты добавлены
      cy.get('[data-testid="constructor-bun-top"]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-testid="constructor-filling"]').should('contain', 'Биокотлета из марсианской Магнолии');
      cy.get('[data-testid="constructor-filling"]').should('contain', 'Соус Spicy-X');
      cy.get('[data-testid="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i');
    });
  });

  describe('Работа модальных окон', () => {
    it('должен открывать модальное окно ингредиента при клике на него', () => {
      // Кликаем на ингредиент
      cy.contains('Краторная булка N-200i').click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').should('contain', 'Детали ингредиента');
      cy.get('[data-testid="modal"]').should('contain', 'Краторная булка N-200i');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal"]').should('be.visible');

      // Кликаем на крестик
      cy.get('[data-testid="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid="modal"]').should('be.visible');

      // Кликаем на оверлей
      cy.get('[data-testid="modal-overlay"]').click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Мокаем запрос на получение данных пользователя
      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');

      // Мокаем запрос на создание заказа
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      // Устанавливаем моковые токены авторизации
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'mock-refresh-token');
        document.cookie = 'accessToken=mock-access-token';
      });
    });

    afterEach(() => {
      // Очищаем токены после теста
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookies();
    });

    it('должен создавать заказ и показывать номер заказа в модальном окне', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parents('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('[data-testid="ingredient-item"]')
        .find('button')
        .click();

      // Кликаем на кнопку "Оформить заказ"
      cy.get('[data-testid="order-button"]').click();

      // Ждем ответа от сервера
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось с номером заказа
      cy.get('[data-testid="modal"]').should('be.visible');
      cy.get('[data-testid="modal"]').should('contain', '12345');

      // Закрываем модальное окно
      cy.get('[data-testid="modal-close-button"]').click();

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="modal"]').should('not.exist');

      // Проверяем, что конструктор пуст
      cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
      cy.get('[data-testid="constructor-filling"]').should('not.exist');
      cy.get('[data-testid="constructor-bun-bottom"]').should('not.exist');
    });
  });
});
