const testUrl = 'http://localhost:4000';

// Селекторы
const SELECTORS = {
  ingredientItem: '[data-testid="ingredient-item"]',
  constructorBunTop: '[data-testid="constructor-bun-top"]',
  constructorBunBottom: '[data-testid="constructor-bun-bottom"]',
  constructorFilling: '[data-testid="constructor-filling"]',
  orderButton: '[data-testid="order-button"]',
  modal: '[data-testid="modal"]',
  modalCloseButton: '[data-testid="modal-close-button"]',
  modalOverlay: '[data-testid="modal-overlay"]'
};

// Текстовые константы
const TEXT = {
  bunName: 'Краторная булка N-200i',
  fillingName: 'Биокотлета из марсианской Магнолии',
  sauceName: 'Соус Spicy-X'
};

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запрос на получение ингредиентов и возвращаем моковые данные
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Открываем главную страницу
    cy.visit(testUrl);

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      // Находим булку и кликаем кнопку "Добавить"
      cy.contains(TEXT.bunName)
        .parents(SELECTORS.ingredientItem)
        .find('button')
        .click();

      // Проверяем, что булка добавлена в конструктор (верхняя часть)
      cy.get(SELECTORS.constructorBunTop).should('contain', TEXT.bunName);
      // Проверяем нижнюю часть
      cy.get(SELECTORS.constructorBunBottom).should('contain', TEXT.bunName);
    });

    it('должен добавлять начинку в конструктор', () => {
      // Добавляем начинку
      cy.contains(TEXT.fillingName)
        .parents(SELECTORS.ingredientItem)
        .find('button')
        .click();

      // Проверяем, что начинка добавлена
      cy.get(SELECTORS.constructorFilling).should('contain', TEXT.fillingName);
    });

    it('должен добавлять соус в конструктор', () => {
      // Добавляем соус
      cy.contains(TEXT.sauceName)
        .parents(SELECTORS.ingredientItem)
        .find('button')
        .click();

      // Проверяем, что соус добавлен
      cy.get(SELECTORS.constructorFilling).should('contain', TEXT.sauceName);
    });

    it('должен добавлять несколько ингредиентов в конструктор', () => {
      // Добавляем булку
      cy.contains(TEXT.bunName)
        .parents(SELECTORS.ingredientItem)
        .find('button')
        .click();

      // Добавляем начинку
      cy.contains(TEXT.fillingName)
        .parents(SELECTORS.ingredientItem)
        .find('button')
        .click();

      // Добавляем соус
      cy.contains(TEXT.sauceName)
        .parents(SELECTORS.ingredientItem)
        .find('button')
        .click();

      // Проверяем, что все ингредиенты добавлены
      cy.get(SELECTORS.constructorBunTop).should('contain', TEXT.bunName);
      cy.get(SELECTORS.constructorFilling).should('contain', TEXT.fillingName);
      cy.get(SELECTORS.constructorFilling).should('contain', TEXT.sauceName);
      cy.get(SELECTORS.constructorBunBottom).should('contain', TEXT.bunName);
    });
  });

  describe('Работа модальных окон', () => {
    it('должен открывать модальное окно ингредиента при клике на него', () => {
      // Кликаем на ингредиент
      cy.contains(TEXT.bunName).click();

      // Проверяем, что модальное окно открылось
      cy.get(SELECTORS.modal).should('be.visible');
      cy.get(SELECTORS.modal).should('contain', 'Детали ингредиента');
      cy.get(SELECTORS.modal).should('contain', TEXT.bunName);
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      // Открываем модальное окно
      cy.contains(TEXT.bunName).click();
      cy.get(SELECTORS.modal).should('be.visible');

      // Кликаем на крестик
      cy.get(SELECTORS.modalCloseButton).click();

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.modal).should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      // Открываем модальное окно
      cy.contains(TEXT.bunName).click();
      cy.get(SELECTORS.modal).should('be.visible');

      // Кликаем на оверлей
      cy.get(SELECTORS.modalOverlay).click({ force: true });

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.modal).should('not.exist');
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
      cy.contains(TEXT.bunName)
        .parents(SELECTORS.ingredientItem)
        .find('button')
        .click();

      // Добавляем начинку
      cy.contains(TEXT.fillingName)
        .parents(SELECTORS.ingredientItem)
        .find('button')
        .click();

      // Кликаем на кнопку "Оформить заказ"
      cy.get(SELECTORS.orderButton).click();

      // Ждем ответа от сервера
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось с номером заказа
      cy.get(SELECTORS.modal).should('be.visible');
      cy.get(SELECTORS.modal).should('contain', '12345');

      // Закрываем модальное окно
      cy.get(SELECTORS.modalCloseButton).click();

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.modal).should('not.exist');

      // Проверяем, что конструктор пуст
      cy.get(SELECTORS.constructorBunTop).should('not.exist');
      cy.get(SELECTORS.constructorFilling).should('not.exist');
      cy.get(SELECTORS.constructorBunBottom).should('not.exist');
    });
  });
});
