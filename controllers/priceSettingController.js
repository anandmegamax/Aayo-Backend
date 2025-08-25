import PriceHead from "../models/PriceSetting.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const createHead = catchAsyncErrors(async (req, res) => {
    const head = await PriceHead.create(req.body);
    res.status(201).json({ success: true, head });
});

export const getHeads = catchAsyncErrors(async (req, res) => {
    const heads = await PriceHead.find().populate("dependentHeads", "headName");
    res.status(200).json({ success: true, heads });
});

// export const updateHead = catchAsyncErrors(async (req, res) => {
//     const head = await PriceHead.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//     });
//     res.status(200).json({ success: true, head });
// });

export const updateHead = catchAsyncErrors(async (req, res) => {
    let updateData = { ...req.body };
    const unsetFields = {};

    if (updateData.type === "fixed") {
        // remove percentage-based fields
        unsetFields.percentage = 1;
        unsetFields.dependentHeads = 1;

        // don't accidentally $set empty percentage values
        delete updateData.percentage;
        delete updateData.dependentHeads;
    }

    if (updateData.type === "percentage") {
        // remove fixed amount field
        unsetFields.amount = 1;

        // don't accidentally $set amount
        delete updateData.amount;
    }

    const head = await PriceHead.findByIdAndUpdate(
        req.params.id,
        {
            $set: updateData,
            ...(Object.keys(unsetFields).length ? { $unset: unsetFields } : {}),
        },
        { new: true }
    );

    res.status(200).json({ success: true, head });
});



export const deleteHead = catchAsyncErrors(async (req, res) => {
    await PriceHead.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
});

// 🔹 Utility to calculate total
export const calculateTotal = (heads) => {
    let values = {};
    let total = 0;

    // Step 1: Fixed
    heads.forEach((h) => {
        if (h.type === "fixed") {
            values[h._id] = h.amount;
            total += h.amount;
        }
    });

    // Step 2: Percentage
    heads.forEach((h) => {
        if (h.type === "percentage") {
            let base = 0;
            h.dependentHeads.forEach((dep) => {
                base += values[dep._id] || 0;
            });
            const val = (h.percentage / 100) * base;
            values[h._id] = val;
            total += val;
        }
    });

    return { total, breakdown: values };
};
