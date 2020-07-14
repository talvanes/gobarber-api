import { Router } from 'express';
import appointmentRouter from './appointments.router';

const routes = Router();

routes.use('/appointments', appointmentRouter);

export default routes;
