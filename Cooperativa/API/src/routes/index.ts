import {Router} from 'express'
import clienteRouter from '@routes/cliente'
import culturaRouter from '@routes/cultura';
import sacaRouter from '@routes/saca';
const router = Router();

router.use('/clientes', clienteRouter);
router.use('/culturas', culturaRouter);
router.use('/sacas', sacaRouter);

export default router;