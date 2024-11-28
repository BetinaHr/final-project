export const authMiddleware = async (req, res, next) => {
    const token = req.cookies['AUTH'];  // Check the AUTH cookie

    if (!token) {
        return next();
    };

    // Validate token
    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_Secret);

        req.user = decodedToken;
        req.isAuthenticated = true;

        res.locals.user = decodedToken;
        res.locals.isAuthenticated = true;

        next();
    } catch (error) {
        res.clearCookie('AUTH');  // Clear the AUTH cookie if token is invalid
        return res.redirect('/auth/login');
    };
};

export const isAuth = (req, res, next) => {
    if(!req.user) {
        return res.redirect('/404');
    };

    next();
};
