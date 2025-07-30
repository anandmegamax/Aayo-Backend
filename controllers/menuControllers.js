import Menu from "../models/menu.js";


export const createMenu = async (req, res) => {
    const { name, slug } = req.body;
    const menu = await Menu.create({ name, slug });
    res.status(201).json(menu);
};

export const getMenus = async (req, res) => {
    const menus = await Menu.find();
    res.json(menus);
};
