function createIndexParams(req, leeches) {
    return {leeches: leeches};
}

const createRegisterFormData = (req) => {
    if ("name" in req.body) {
        return {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            password2: req.body.password2
        };
    } else if (process.env.NODE_ENV !== "development") {
        return {
            email: "",
            username: "",
            password: "",
            password2: ""
        };
    } else {
        return {
            email: "irving.beer77@ethereal.email",
            username: "bcfcharry",
            password: "6srcxq2X4c",
            password2: "6srcxq2X4c"
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
            password: "6srcxq2X4c",
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
            shopName: "30UPPERCASECHARSXXXXXXXXXXXXXX",
            cityTown: "30UPPERCASECHARSXXXXXXXXXXXXXX",
            districtArea: "30UPPERCASECHARSXXXXXXXXXXXXXX",
            comments: "100UPPERCASECHARSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            useStockPhoto: true
        };
    }
}

module.exports = {
    createIndexParams,
    createRegisterFormData,
    createLoginFormData,
    createUploadFormData
}
