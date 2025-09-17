import { Router } from 'express';
import { health, helloWorld } from '../controllers/health.controller';
import { asyncHandler } from '../utils/asynchandler';
import adminRouter from './admin.route';
import blogRouter from './blog.route';
import productRouter from './product.route';
import personRouter from './person.route';

const v1Router = Router();

v1Router.get('/', asyncHandler(helloWorld));
v1Router.get('/health', asyncHandler(health));
v1Router.use('/admin', adminRouter);
v1Router.use('/product', productRouter);
v1Router.use('/blog', blogRouter);
v1Router.use('/team', personRouter);

export default v1Router;