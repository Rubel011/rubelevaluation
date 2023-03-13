
// Define middleware function to check user roles and permissions
function checkRole(role) {
    return function (req, res, next) {
        console.log(req.user.role);
        if (req.user && role.includes(req.user.role)) {
            return next();
        } else {
            return res.status(403).send('Forbidden');
        }
    };
}
module.exports = { checkRole }
