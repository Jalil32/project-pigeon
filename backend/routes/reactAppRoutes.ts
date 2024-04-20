import express, { Response, Request } from 'express';

const router = express.Router();

router.route('/').get((req: Request, res: Response) => {
    //  res.status(200).sendFile("../client/index.html");
    res.sendFile(`${__dirname}/my-app/build/index.html`);
});

export = router;
