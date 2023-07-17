'use strict';

import { countryController } from './country.controller.js';
import { Common } from '../common';

export default (app) => {
   app.post('/api/country', (req, res) => countryController.createCountry(req, res));
   app.get('/api/country', (req, res) => countryController.listCountry(req, res));
   app.get('/api/country/:country_id', (req, res) => countryController.getCountry(req, res));
   app.delete('/api/country/:country_id', (req, res) => countryController.deleteCountry(req, res));
   app.put('/api/country/:country_id', (req, res) => countryController.updateCountry(req, res));
   app.get('/api/country/:country_id/state', (req, res) => countryController.listCountryState(req, res));
   app.get('/api/country/:country_id/city', (req, res) => countryController.listCountryCity(req, res));
};
