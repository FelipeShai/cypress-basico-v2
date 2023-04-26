/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach( function() {
        cy.visit('/src/index.html')
    })
    
    it('Verifica o título da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })
    
    it('Preenche os campos obrigatórios e envia o formulário', function() {
        cy.get('#firstName').type('Felipe')
        cy.get('#lastName').type('Santos de Jesus')
        cy.get('#email').type('felipeshai@hotmail.com')
        cy.get('#open-text-area').type('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible','Mensagem enviada com sucesso.')
    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        const longText = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.'
        cy.get('#firstName').type('Felipe')
        cy.get('#lastName').type('Santos de Jesus')
        cy.get('#email').type('felipeshai@h')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible','Valide os campos obrigatórios!')
    })

    it('Valida se campo para telefone permanecerá vazio ao digitar caracteres alfabéticos', () => {
        cy.get('#firstName').type('Felipe')
        cy.get('#lastName').type('Santos de Jesus')
        cy.get('#email').type('felipeshai@hotmail.com')
        cy.get('#phone').type('ABCdfg').should('be.empty')
        //OU
        cy.get('#phone').type('ABCdfg').should('not.have.value')

    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Felipe')
        cy.get('#lastName').type('Santos de Jesus')
        cy.get('#email').type('felipeshai@hotmail.com')
        cy.get('#phone-checkbox').check()
        //ou cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.', { delay: 0 })
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible','Valide os campos obrigatórios!')
    })

    it('Preenche e limpa campos obrigatórios', () => {
        cy.get('#firstName').type('Felipe').should('have.value', 'Felipe').clear().should('have.value', '')
        cy.get('#lastName').type('Santos de Jesus').should('have.value', 'Santos de Jesus').clear().should('not.have.value')
        cy.get('#email').type('felipeshai@hotmail.com').should('have.value', 'felipeshai@hotmail.com').clear().should('not.have.value')
    })

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.get('.button').click()
        cy.get('.error').should('be.visible','Valide os campos obrigatórios!')
    })

    it('Envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible','Mensagem enviada com sucesso.')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible','Mensagem enviada com sucesso.')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible','Mensagem enviada com sucesso.')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('#product').select(1).should('have.value', 'blog')
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible','Mensagem enviada com sucesso.')
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('#product').select(1).should('have.value', 'blog')
        cy.get('input[type="radio"]').check('feedback')
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible','Mensagem enviada com sucesso.')
    })

    it('marca cada tipo de atendimento', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('#product').select(1).should('have.value', 'blog')
        cy.get('input[type="radio"][value="ajuda"]').check().should('be.checked')
        cy.get('input[type="radio"][value="elogio"]').check().should('be.checked')
        cy.get('input[type="radio"]').check('feedback').should('have.value', 'feedback')
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible','Mensagem enviada com sucesso.')
    })

    it('marca cada tipo de atendimento utilizando each ee cy.wrap', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('#product').select(1).should('have.value', 'blog')
        cy.get('input[type="radio"]').should('have.length', 3).each(function($radio) {
            cy.wrap($radio).check().should('be.checked')
        })
        cy.get('input[type="radio"][value="elogio"]').check().should('be.checked')
        cy.get('input[type="radio"]').check('feedback').should('have.value', 'feedback')
        cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible','Mensagem enviada com sucesso.')
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('C:/Users/felip/OneDrive/Documentos/Projetos/cypress-basico-v2/cypress/fixtures/example.json')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')})
        })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('C:/Users/felip/OneDrive/Documentos/Projetos/cypress-basico-v2/cypress/fixtures/example.json', {action: 'drag-drop'})
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')})
        })
            
        it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
        .selectFile('@sampleFile')
        .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json')})
    })        

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () =>{
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicanco no link', () =>{
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
        cy.contains('Talking About Testing').should('be.visible')
    })
})