import { Router } from 'tiny-request-router';

import { handlerFullInfo, handlerInfo } from './ytdl-controller';

const router = new Router();
const version = "v1";

router.get(`/${version}/info/:id`, handlerFullInfo);
router.get(`/${version}/basicinfo/:id`, handlerInfo);

export { router };