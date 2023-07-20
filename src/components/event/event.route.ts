import validator from './event.validator';
import { eventController } from './event.controller';

export default (app) => {
    app.get('/api/event/:id',
        (req, res) => eventController.getEventByAccountId(req, res));
}