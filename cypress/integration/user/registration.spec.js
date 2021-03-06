describe("Registration", () => {

    beforeEach(() => {
        cy.exec('npm run db:reset');
        cy.fixture("user/registration.json").as("register");
        cy.visit("http://localhost:3000");
    });

    it.only("Successful new user account registration", () => {
        cy.get("@register")
            .then((register) => {

                // Links available when not authenticated
                // cy.get("[id='home']").should("exist");
                // cy.get("[id='register']").should("exist");
                // cy.get("[id='login']").should("exist");
                // cy.get("[id='logout']").should("not.exist");
                // cy.get("[id='upload']").should("not.exist");

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
                // cy.get("[id='home']").should("exist");
                // cy.get("[id='register']").should("exist");
                // cy.get("[id='login']").should("exist");
                // cy.get("[id='logout']").should("not.exist");
                // cy.get("[id='upload']").should("not.exist");
            });
    });

    it("Successful verification email resent for un-verified user account", () => {
        cy.get("@register")
            .then((register) => {
                cy.exec('npm run db:insert-unverified-user').then(() => {

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

                    cy.contains("INFO: Account already exists, new Verification Email sent");
                });
            });
    });

    it("Rejection of new registration for user already registered and verified", () => {
        cy.get("@register")
            .then((register) => {
                cy.exec('npm run db:insert-verified-user').then(() => {

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

                    cy.contains("ERROR: Account already exists");

                    // Links available when not authenticated
                    cy.get("[id='home']").should("exist");
                    cy.get("[id='register']").should("exist");
                    cy.get("[id='login']").should("exist");
                    cy.get("[id='logout']").should("not.exist");
                    cy.get("[id='upload']").should("not.exist");
                });
            });
    });

    it("Rejection of field values too short", () => {
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
                    .type(register.invalidUserNamePaddedTooShort)
                    .should("have.value", register.invalidUserNamePaddedTooShort);

                cy.get("[id='email']")
                    .clear()
                    .type(register.invalidEmailPaddedTooShort)
                    .should("have.value", register.invalidEmailTooShort);

                cy.get("[id='password']")
                    .clear()
                    .type(register.invalidPasswordPaddedTooShort)
                    .should("have.value", register.invalidPasswordPaddedTooShort);

                cy.get("form").submit();

                cy.contains("User Name must be 4-20 alphanumeric characters long");
                cy.contains("Email address must be valid and between 5-50 alphanumeric characters long");
                cy.contains("Password must be between 8 and 20 alphanumeric characters");

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");
            });
    });

    it("Rejection of field values too long", () => {
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
                    .type(register.invalidUserNamePaddedTooLong)
                    .should("have.value", register.invalidUserNamePaddedTooLong);

                cy.get("[id='email']")
                    .clear()
                    .type(register.invalidEmailPaddedTooLong)
                    .should("have.value", register.invalidEmailTooLong);

                cy.get("[id='password']")
                    .clear()
                    .type(register.invalidPasswordPaddedTooLong)
                    .should("have.value", register.invalidPasswordPaddedTooLong);

                cy.get("form").submit();

                cy.contains("User Name must be 4-20 alphanumeric characters long");
                cy.contains("Email address must be valid and between 5-50 alphanumeric characters long");
                cy.contains("Password must be between 8 and 20 alphanumeric characters");

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");
            });
    });

    it("Rejection of field values with invalid content", () => {
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
                    .type(register.invalidUserNameInvalidChars)
                    .should("have.value", register.invalidUserNameInvalidChars);

                cy.get("[id='email']")
                    .clear()
                    .type(register.invalidEmail)
                    .should("have.value", register.invalidEmail);

                cy.get("[id='password']")
                    .clear()
                    .type(register.invalidPasswordInvalidChars)
                    .should("have.value", register.invalidPasswordInvalidChars);

                cy.get("form").submit();

                cy.contains("User Name must be 4-20 alphanumeric characters long");
                cy.contains("Email address must be valid and between 5-50 alphanumeric characters long");
                cy.contains("Password must be between 8 and 20 alphanumeric characters");

                // Links available when not authenticated
                cy.get("[id='home']").should("exist");
                cy.get("[id='register']").should("exist");
                cy.get("[id='login']").should("exist");
                cy.get("[id='logout']").should("not.exist");
                cy.get("[id='upload']").should("not.exist");
            });
    });
});
