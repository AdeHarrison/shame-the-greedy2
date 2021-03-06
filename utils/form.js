const createRegisterFormData = (req) => {
    if ("name" in req.body) {
        return {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            password2: req.body.password2
        };
    } else if (process.env.NODE_ENV !== "development") {
        return {
            name: "",
            email: "",
            username: "",
            password: "",
            password2: ""
        };
    } else {
        return {
            name: "harry",
            email: "irving.beer77@ethereal.email",
            username: "bcfcharry",
            password: "6srcxq2X4EPgPbu1U2",
            password2: "6srcxq2X4EPgPbu1U2"
        };
    }
}

const createLoginFormData = (req) => {
    if ("username" in req.body) {
        return {
            username: req.body.username,
            password: req.body.password,
        };
    } else if (process.env.NODE_ENV !== "development") {
        return {
            username: "",
            password: "",
        };
    } else {
        return {
            username: "bcfcharry",
            password: "6srcxq2X4EPgPbu1U2",
        };
    }
}

const createUploadFormData = (req) => {
    if ("shopName" in req.body) {
        return {
            shopName: req.body.shopName,
            cityTown: req.body.cityTown,
            districtArea: req.body.districtArea,
            comments: req.body.comments,
            useStockPhoto: req.body.useStockPhoto
        };
    } else if (process.env.NODE_ENV !== "development") {
        return {
            shopName: "",
            cityTown: "",
            districtArea: "",
            comments: "",
            useStockPhoto: true
        };
    } else {
        return {
            shopName: "50UPPERCASECHARSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            cityTown: "50UPPERCASECHARSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            districtArea: "50UPPERCASECHARSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            comments: "200UPPERCASECHARSXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            useStockPhoto: true
        };
    }
}

module.exports = {
    createRegisterFormData,
    createLoginFormData,
    createUploadFormData
}
