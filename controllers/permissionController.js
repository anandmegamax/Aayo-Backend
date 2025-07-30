import Permission from "../models/permission.js";

export const createPermission = async (req, res) => {
    const { menuId, action, name } = req.body;
    const permission = await Permission.create({ menu: menuId, action, name });
    res.status(201).json(permission);
};

export const getPermissions = async (req, res) => {
    const permissions = await Permission.find().populate("menu");
    res.json(permissions);
};
