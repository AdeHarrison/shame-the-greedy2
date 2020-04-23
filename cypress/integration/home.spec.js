context("Login", () => {

    beforeEach(() => {
        cy.visit("http://localhost:7000");
    });

    it("Successful home page contains expected links before login", () => {
        // Links available when not authenticated
        cy.get("[id='home']").should("exist");
        cy.get("[id='login']").should("exist");
        cy.get("[id='register']").should("exist");
        cy.get("[id='logout']").should("not.exist");
        cy.get("[id='upload']").should("not.exist");
    });

    //todo loads more in here
});