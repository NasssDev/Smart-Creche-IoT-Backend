import userRoute from '../components/user/user.route';
import accountRoute from '../components/user/user.route';

class Routes {
   // Initializing routes
   public init(app) {
      userRoute(app);
      accountRoute(app)
   }
}

export const routes = new Routes();
