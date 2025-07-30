import Role from "../models/role.js";

export const createRole = async (req, res) => {
  const { name, permissions } = req.body;

  // Ensure it's always an array
  const role = await Role.create({
    name,
    permissions: Array.isArray(permissions) ? permissions : [permissions],
  });

  res.status(201).json(role);
};

export const getRoles = async (req, res) => {
  const roles = await Role.find().populate("permissions");
  res.json(roles);
};

export const updateRolePermissions = async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body;

  try {
    const role = await Role.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    ).populate("permissions");

    res.json({ message: "Role permissions updated", role });
  } catch (err) {
    res.status(500).json({ message: "Error updating role", error: err.message });
  }
};

