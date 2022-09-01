const {Router} = require('express');
const { check, query } = require('express-validator');
const { fieldsValidators } = require('../middlewares/fields-validator');
const { jwtValidator } = require('../middlewares/jwt-validator');
const router = Router();

const {
    login,
    googleSingIN,
    tokenRenovate
} = require('../controllers/auth.controller');

router.post('/',[
    check('email', 'El corrreo es obligatorio').isEmail(),
    check('password', 'El contraseña es obligatoria').not().isEmpty(),
    fieldsValidators
], login);

router.post('/google',[
    check('id_token', 'id_token is required').not().isEmpty(),
    fieldsValidators
], googleSingIN);

router.get('/renovate',[
    jwtValidator,
], tokenRenovate);


module.exports = router;