const createRegisterParams = (req) => {
    if ("name" in req.body) {
        return {
            name: req.body.name,
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password,
            password2: req.body.password2
        };
    } else if (process.env.NODE_ENV !== "development") {
        return {
            name: "",
            email: "",
            userName: "",
            password: "",
            password2: ""
        };
    } else {
        return {
            name: "harry",
            email: "irving.beer77@ethereal.email",
            userName: "bcfcharry",
            password: "6srcxq2X4EPgPbu1U2",
            password2: "6srcxq2X4EPgPbu1U2"
        };
    }
}

module.exports = {
    createRegisterFormData: createRegisterParams
}
