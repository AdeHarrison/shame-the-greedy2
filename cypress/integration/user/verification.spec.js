describe("Verification", () => {

    beforeEach(() => {
        cy.exec('npm run db:reset');
        cy.fixture("user/registration.json").as("register");
        cy.visit("http://localhost:7000");
    });

    it("Successful new user account verification", () => {
        cy.get("@register")
            .then((register) => {

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");

                cy.get("[id='register']").click();

                cy.get("[id='username']")
                    .clear()
                    .type(register.validUserName)
                    .should("have.value", register.validUserName);

                cy.get("[id='email']")
                    .clear()
                    .type(register.validEmail)
                    .should("have.value", register.validEmail);

                cy.get("[id='password']")
                    .clear()
                    .type(register.validPassword)
                    .should("have.value", register.validPassword);

                cy.get("[id='password2']")
                    .clear()
                    .type(register.validPassword)
                    .should("have.value", register.validPassword);

                cy.get("form").submit();

                cy.contains("Verification Email has been sent to the registered address");

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");

                cy.readFile('utils/link.txt')
                    .then((link) => {
                        cy.visit(link).then(() => {
                            cy.contains("User Verified");
                        });
                    });
            });
    });

    it("Rejection of verification for user account not existing", () => {
        cy.visit("http://localhost:7000/users/verify?id=12345").then(() => {
            cy.contains("User account not found");
        });
    });

    it("Rejection of verification for user already verified", () => {
        cy.exec('npm run db:verified-user').then(() => {
            cy.visit("http://localhost:7000/users/verify?id=5688b9c93752e1bba583975a72ce1f53af0af9e5cc257f90f62f88341607ba365ef82ae64dae894a8a4dd025c69b926487cef49861083f9b086c61e58aa697bb").then(() => {
                cy.contains("User is already verified");
            });
        });
    });

    it("Rejection of expired verification email", () => {
        cy.exec('npm run db:unverified-expired-user').then(() => {
            cy.visit("http://localhost:7000/users/verify?id=5688b9c93752e1bba583975a72ce1f53af0af9e5cc257f90f62f88341607ba365ef82ae64dae894a8a4dd025c69b926487cef49861083f9b086c61e58aa697bb").then(() => {
                cy.contains("Verification window has expired, new Verification Email sent");
            });
        });
    });
});
