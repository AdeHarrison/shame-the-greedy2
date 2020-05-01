import 'cypress-file-upload';

describe("upload", () => {
    beforeEach(() => {
        cy.exec('npm run db:reset && npm run db:verified-user');
        cy.fixture("user/login.json").as("login");
        cy.fixture("leech/upload.json").as("upload");
        cy.visit("http://localhost:7000");
    });

    it("Successful stock image upload", () => {
        cy.get("@login")
            .then((login) => {
                cy.get("@upload")
                    .then((upload) => {
                        // Links available/unavaliable when not authenticated
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

                        cy.get("[id='upload']").click();

                        cy.get("[id='shopName']")
                            .clear()
                            .type(upload.validShopName)
                            .should("have.value", upload.validShopName);

                        cy.get("[id='cityTown']")
                            .clear()
                            .type(upload.validCityTown)
                            .should("have.value", upload.validCityTown);

                        cy.get("[id='districtArea']")
                            .clear()
                            .type(upload.validDistrictArea)
                            .should("have.value", upload.validDistrictArea);

                        cy.get("[id='comments']")
                            .clear()
                            .type(upload.validComments)
                            .should("have.value", upload.validComments);

                        cy.get("form").submit();

                        cy.contains("Upload Successful");

                        // Links available when authenticated
                        cy.get("[id='home']").should("exist");
                        cy.get("[id='logout']").should("exist");
                        cy.get("[id='upload']").should("exist");
                        cy.get("[id='register']").should("not.exist");
                        cy.get("[id='login']").should("not.exist");
                    });
            });
    });

    it("Successful user image upload", () => {
        cy.get("@login")
            .then((login) => {
                cy.get("@upload")
                    .then((upload) => {
                        // Links available/unavaliable when not authenticated
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

                        cy.get("[id='upload']").click();

                        cy.get("[id='shopName']")
                            .clear()
                            .type(upload.validShopName)
                            .should("have.value", upload.validShopName);

                        cy.get("[id='cityTown']")
                            .clear()
                            .type(upload.validCityTown)
                            .should("have.value", upload.validCityTown);

                        cy.get("[id='districtArea']")
                            .clear()
                            .type(upload.validDistrictArea)
                            .should("have.value", upload.validDistrictArea);

                        cy.get("[id='comments']")
                            .clear()
                            .type(upload.validComments)
                            .should("have.value", upload.validComments);

                        cy.get("[id='useStockPhoto']").uncheck();

                        cy.get('[id="shopPhoto"]').attachFile({
                            filePath: 'test_leech_photo.png',
                            mimeType: 'image/png'
                        }).then(() => {
                            cy.get("form").submit();

                            cy.contains("Upload Successful");

                            // Links available when authenticated
                            cy.get("[id='home']").should("exist");
                            cy.get("[id='logout']").should("exist");
                            cy.get("[id='upload']").should("exist");
                            cy.get("[id='register']").should("not.exist");
                            cy.get("[id='login']").should("not.exist");
                        });
                    });
            });
    });

    // todo fix another day
    it.skip("Rejection of field values too short", () => {
        cy.get("@login")
            .then((login) => {
                cy.get("@upload")
                    .then((upload) => {
                        // Links available/unavaliable when not authenticated
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

                        cy.get("[id='upload']").click();

                        cy.get("[id='shopName']")
                            .clear()
                            .type(upload.invalidShopNamePaddedTooShort)
                            .should("have.value", upload.invalidShopNamePaddedTooShort);

                        cy.get("[id='cityTown']")
                            .clear()
                            .type(upload.invalidCityTownPaddedTooShort)
                            .should("have.value", upload.invalidCityTownPaddedTooShort);

                        cy.get("[id='districtArea']")
                            .clear()
                            .type(upload.invalidDistrictAreaPaddedTooShort)
                            .should("have.value", upload.invalidDistrictAreaPaddedTooShort);

                        cy.get("[id='comments']")
                            .clear()
                            .should("be.empty");

                        cy.get("form").submit();

                        cy.contains("Shop Name must be 2-30 characters long");
                        cy.contains("City/Town must be 1-30 characters long");
                        cy.contains("District/Area must be 1-30 characters long");
                        cy.contains("Comments can be upto 100 characters long").should('not.exist');

                        // Links available/unavaliable when authenticated
                        cy.get("[id='home']").should("exist");
                        cy.get("[id='logout']").should("exist");
                        cy.get("[id='upload']").should("exist");
                        cy.get("[id='register']").should("not.exist");
                        cy.get("[id='login']").should("not.exist");
                    });
            });
    });

    // todo fix another day
    it.skip("Rejection of field values too long", () => {
        cy.get("@login")
            .then((login) => {
                cy.get("@upload")
                    .then((upload) => {
                        // Links available/unavaliable when not authenticated
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

                        cy.get("[id='upload']").click();

                        cy.get("[id='shopName']")
                            .clear()
                            .type(upload.invalidShopNamePaddedTooLong)
                            .should("have.value", upload.invalidShopNamePaddedTooLong);

                        cy.get("[id='cityTown']")
                            .clear()
                            .type(upload.invalidShopNamePaddedTooLong)
                            .should("have.value", upload.invalidShopNamePaddedTooLong);

                        cy.get("[id='districtArea']")
                            .clear()
                            .type(upload.invalidDistrictAreaPaddedTooLong)
                            .should("have.value", upload.invalidDistrictAreaPaddedTooLong);

                        cy.get("[id='comments']")
                            .clear()
                            .type(upload.invalidCommentsPaddedTooLong)
                            .should("have.value", upload.invalidCommentsPaddedTooLong);

                        cy.get("form").submit();

                        cy.contains("Shop Name must be 2-30 characters long");
                        cy.contains("City/Town must be 1-30 characters long");
                        cy.contains("District/Area must be 1-30 characters long");
                        cy.contains("Comments can be upto 100 characters long");

                        // Links available when authenticated
                        cy.get("[id='home']").should("exist");
                        cy.get("[id='logout']").should("exist");
                        cy.get("[id='upload']").should("exist");
                        cy.get("[id='register']").should("not.exist");
                        cy.get("[id='login']").should("not.exist");
                    });
            });
    });

    // todo fix another day
    it.skip("Rejection when no stock photo or photo uploaded", () => {
        cy.get("@login")
            .then((login) => {
                cy.get("@upload")
                    .then((upload) => {
                        // Links available/unavaliable when not authenticated
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

                        cy.get("[id='upload']").click();

                        cy.get("[id='shopName']")
                            .clear()
                            .type(upload.validShopName)
                            .should("have.value", upload.validShopName);

                        cy.get("[id='cityTown']")
                            .clear()
                            .type(upload.validCityTown)
                            .should("have.value", upload.validCityTown);

                        cy.get("[id='districtArea']")
                            .clear()
                            .type(upload.validDistrictArea)
                            .should("have.value", upload.validDistrictArea);

                        cy.get("[id='comments']")
                            .clear()
                            .type(upload.validComments)
                            .should("have.value", upload.validComments);

                        cy.get("[id='useStockPhoto']").uncheck();

                        cy.get("form").submit();

                        cy.contains("You must select a stock photo or upload one");

                        // Links available when authenticated
                        cy.get("[id='home']").should("exist");
                        cy.get("[id='logout']").should("exist");
                        cy.get("[id='upload']").should("exist");
                        cy.get("[id='register']").should("not.exist");
                        cy.get("[id='login']").should("not.exist");
                    });
            });
    });
});
