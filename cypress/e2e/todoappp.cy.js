/// <reference types="cypress" />

describe("Todo App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080");
    cy.wait(1000); // Warte auf das Laden der Seite
  });

  it("should add a new todo", () => {
    cy.get("#new-todo").type("Learn Cypress");
    cy.get("#new-todo-btn").click();
    cy.wait(1000); // Warte auf die Aktualisierung
    cy.get("#list").should("contain.text", "Learn Cypress");
  });

  it("should not allow adding duplicate todos", () => {
    // Füge das erste Todo hinzu
    cy.get("#new-todo").type("Go running");
    cy.get("#new-todo-btn").click();
    cy.wait(1000); // Warte auf die Aktualisierung

    // Versuche, dasselbe Todo erneut hinzuzufügen
    cy.get("#new-todo").type("Go running");
    cy.get("#new-todo-btn").click();
    cy.wait(1000); // Warte auf den Alert und die Reaktion

    // Prüfe, dass nur eine Instanz von "Go running" existiert
    cy.get("#list li").should("have.length", 1); // Passe hier die erwartete Länge an
  });

  it("should delete completed todos", () => {
    // Füge ein neues Todo hinzu
    cy.get("#new-todo").type("Finish project");
    cy.get("#new-todo-btn").click();
    cy.wait(1000); // Warte auf die Aktualisierung

    // Markiere das Todo als erledigt
    cy.get("#list input[type='checkbox']").first().check();
    cy.wait(500); // Warte auf die Checkbox-Aktion

    // Lösche alle erledigten Todos
    cy.contains("Delete Done Todos").click();
    cy.wait(1000); // Warte auf die Löschung

    // Prüfe, ob "Finish project" aus der Liste entfernt wurde
    cy.get("#list").should("not.contain.text", "Finish project");
  });
});
