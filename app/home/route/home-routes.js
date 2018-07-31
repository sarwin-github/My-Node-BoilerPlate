import express from 'express';
import * as homeController from '../controller/home-controller';

const router = express();

router.route('/').get(homeController.getHome);
router.route('/about').get(homeController.getAbout);

module.exports = router;
