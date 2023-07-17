import userRoute from '../components/user/user.route';
import accountRoute from '../components/user/user.route';
import roleRoute from '../components/role/role.route';
import userRoleRoute from '../components/userRole/userRole.route';
import eventRoute from '../components/event/event.route';
import sensorRoute from '../components/sensor/sensor.route';
import siestModeRoute from '../components/siestMode/siestMode.route';

class Routes {
   // Initializing routes
   public init(app) {
      userRoute(app);
      accountRoute(app);
      roleRoute(app);
      userRoleRoute(app);
      eventRoute(app);
      sensorRoute(app);
      siestModeRoute(app);
   }
}

export const routes = new Routes();
