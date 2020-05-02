describe("login", () => {
    beforeEach(() => {
        cy.fixture("user/login.json").as("login");
        cy.visit("http://localhost:7000");
    });

    it("Successful user login", () => {
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

                cy.get("[id='username']")
                    .clear()
                    .type(login.validUserName)
                    .should("have.value", login.validUserName);

                cy.get("[id='password']")
                    .clear()
                    .type(login.validPassword)
                    .should("have.value", login.validPassword);

                cy.get("form").submit();

                cy.contains("Hi 'bcfcharry1'");

                // Links available when authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='logout']").should("exist");
                cy.get("[id='upload']").should("exist");
                cy.get("[id='register']").should("not.exist");
                cy.get("[id='login']").should("not.exist");
            });
    });

    it("Rejection of invalid login details", () => {
        cy.get("@login")
            .then((login) => {

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");

                cy.get("[id='login']").click();

                cy.get("[id='username']")
                    .clear()
                    .type(login.invalidUserName)
                    .should("have.value", login.invalidUserName);

                cy.get("[id='password']")
                    .clear()
                    .type(login.validPassword)
                    .should("have.value", login.validPassword);

                cy.get("form").submit();

                cy.contains("No user found");

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");
            });
    });

    it("Rejection of unverified user account", () => {
        cy.get("@login")
            .then((login) => {
                cy.exec('npm run db:reset && npm run db:unverified-user');

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");

                cy.get("[id='login']").click();

                cy.get("[id='username']")
                    .clear()
                    .type(login.invalidUnverifiedUserName)
                    .should("have.value", login.invalidUnverifiedUserName);

                cy.get("[id='password']")
                    .clear()
                    .type(login.validPassword)
                    .should("have.value", login.validPassword);

                cy.get("form").submit();

                cy.contains("User account not verified");

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");
            });
    });

    it("Successful user logout", () => {
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

                cy.get("[id='username']")
                    .clear()
                    .type(login.validUserName)
                    .should("have.value", login.validUserName);

                cy.get("[id='password']")
                    .clear()
                    .type(login.validPassword)
                    .should("have.value", login.validPassword);

                cy.get("form").submit();

                cy.contains("Hi 'bcfcharry1'");

                // Links available when authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='logout']").should("exist");
                cy.get("[id='upload']").should("exist");
                cy.get("[id='register']").should("not.exist");
                cy.get("[id='login']").should("not.exist");

                cy.get("[id='logout']").click();

                cy.contains("You are logged out");

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");
            });
    });
});
