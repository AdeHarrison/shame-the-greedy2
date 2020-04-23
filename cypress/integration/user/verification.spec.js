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

                cy.get("form").submit();

                cy.contains("Success: Verification Email has been sent to the registered address");

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");

                cy.readFile('utils/link.txt')
                    .then((link) => {
                        cy.visit(link).then(() => {
                            cy.contains("Success: User Verified");
                        });
                    });
            });
    });

    it("Rejection of verification for user account not existing", () => {
        cy.visit("http://localhost:7000/user/verify?id=1234c4071cd12f871aaef05dee045c52b950898b03c939b7238e8952b72ec76b0aef2f0709a7b40e54af199d2dcfcc9f32c716b2016daf17829f0293f1c81d7a").then(() => {
            cy.contains("ERROR : User account not found");
        });
    });

    it("Rejection of verification for user already verified", () => {
        cy.exec('npm run db:insert-verified-user').then(() => {
            cy.visit("http://localhost:7000/user/verify?id=fbf31c1df31586c336498cbfa430da9a8ec7fd793f0a2b688cebf21602dc66cfa16e934ff53543960e3b81498aed99b9f5bc2e558fddd81f0e832c8b4ce87289").then(() => {
                cy.contains("INFO : User is already verified");
            });
        });
    });

    it("Rejection of expired verification email", () => {
        cy.exec('npm run db:insert-unverified-expired-user').then(() => {
            cy.visit("http://localhost:7000/user/verify?id=fbf31c1df31586c336498cbfa430da9a8ec7fd793f0a2b688cebf21602dc66cfa16e934ff53543960e3b81498aed99b9f5bc2e558fddd81f0e832c8b4ce87289").then(() => {
                cy.contains("INFO: Verification window has expired, new Verification Email sent");
            });
        });
    });
});
