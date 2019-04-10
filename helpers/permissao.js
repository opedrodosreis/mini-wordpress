module.exports = {

    permissao: (req, res, next) => {

        if(req.isAuthenticated() && req.user.admin){

            return next();
        }
        
        req.flash('error_msg', 'Você não tem permissão para acessar essa área!')
        res.redirect('/')
    }
}