
// Create token and save it in a cookie
const sendToken = (user, res) => {
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
        success: true,
        // message: "User logged in successfully",
        // user: {
        //     id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     role: user.role.name, // Assuming role is populated
        // },
        token,
    });
};

export default sendToken;
