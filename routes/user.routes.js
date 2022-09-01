const {Router} = require('express');
const { check, query } = require('express-validator');

const { emailAlreadyUser, idValidator } = require('../helpers/db-validators');

const {
    fieldsValidators,
    jwtValidator,
    adminValidator, roleAllow
} = require('../middlewares/index')


const {
    userGet, 
    userPut, 
    userPost, 
    userDelete,
} = require('../controllers/user.controller');


const router = Router();

router.get('/', [
    query('from', `El valor del query 'from' debe de ser un valor numérico`)
        .if(query('from').exists()).isNumeric(),
    query('limit', `El valor del query 'limit' debe de ser un valor numérico`)
        .if(query('limit').exists()).isNumeric(),
    fieldsValidators
], userGet);

router.put('/:id', [
    jwtValidator,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(idValidator),
    fieldsValidators
], userPut);

router.post('/create', [
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('password', 'password no valido (minimo 6 caracteres)').isLength({min:6}),
    check('email', 'el email no es valido').isEmail(),
    check('email').custom(emailAlreadyUser),
    fieldsValidators
], userPost);

router.delete('/:id', [
    jwtValidator,
    adminValidator,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(idValidator),
    fieldsValidators
], userDelete);


module.exports = router;