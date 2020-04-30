describe("login", () => {
    beforeEach(() => {
        cy.fixture("user/login.json").as("login");
        cy.visit("http://localhost:7000");
    });

    it.only("Successful user login", () => {
        cy.get("@login")
            .then((login) => {
                cy.exec('npm run db:reset && npm run db:insert-verified-user');

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

                cy.contains("Hi 'bcfcharry'");

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

                cy.get("[id='email']")
                    .clear()
                    .type(login.validEmailNotRegistered)
                    .should("have.value", login.validEmailNotRegistered);

                cy.get("[id='password']")
                    .clear()
                    .type(login.validPassword)
                    .should("have.value", login.validPassword);

                cy.get("form").submit();

                cy.contains("ERROR: Login credentials are incorrect");

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
                cy.exec('npm run db:reset && npm run db:insert-unverified-user');

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

                cy.contains("INFO: Account has not been verified, new Verification Email sent");

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
                cy.exec('npm run db:reset && npm run db:insert-verified-user');

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

                cy.get("[id='logout']").click();

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");
            });
    });
});
