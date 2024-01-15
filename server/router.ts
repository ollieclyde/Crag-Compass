import express from 'express';
import controller from './controller/controller';

const router = express.Router();
//IS THIS OKAY PRACTIC TO SIMPLY HAVE THE PARAMS STACKED LIKE THIS OR SHOULD THEY BE BROKEN UP? 
router.get('/crags/:lng/:lat/:driveLength', controller.getCrags)

router.post('/crags', controller.postCrags)

export default router;