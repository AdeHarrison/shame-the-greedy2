describe("vote", () => {
    beforeEach(() => {
        cy.fixture("user/login.json").as("login");
        cy.visit("http://localhost:7000");
    });
//todo need to preload uploads and associated collection data - interesting!
    it.skip("Successful increase in votes of shame", () => {
        cy.get("@login")
            .then((login) => {
                cy.exec('npm run db:reset && npm run db:verified-user');

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");

                cy.get("[id='login']").click();

                cy.get("[id='email']")
                    .clear()
                    .type(login.validEmail)
                    .should("have.value", login.validEmail);

                cy.get("[id='password']")
                    .clear()
                    .type(login.validPassword)
                    .should("have.value", login.validPassword);

                cy.get("form").submit();

                cy.contains("Logged in as 'HARRY'");

                // Links available when authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='logout']").should("exist");
                cy.get("[id='upload']").should("exist");
                cy.get("[id='register']").should("not.exist");
                cy.get("[id='login']").should("not.exist");


            });
    });

    it.skip("Successful decrease in votes of shame", () => {
        cy.get("@login")
            .then((login) => {
                cy.exec('npm run db:reset && npm run db:verified-user');

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");

                cy.get("[id='login']").click();

                cy.get("[id='email']")
                    .clear()
                    .type(login.validEmail)
                    .should("have.value", login.validEmail);

                cy.get("[id='password']")
                    .clear()
                    .type(login.validPassword)
                    .should("have.value", login.validPassword);

                cy.get("form").submit();

                cy.contains("Logged in as 'HARRY'");

                // Links available when authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='logout']").should("exist");
                cy.get("[id='upload']").should("exist");
                cy.get("[id='register']").should("not.exist");
                cy.get("[id='login']").should("not.exist");


            });
    });
});
