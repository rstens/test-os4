//
// Index initializers and boot-strapper of NodeJs application which only serve static app
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-06-24.
/**
 * Imports
 */
const express = require('express');
const path = require('path');
const request = require('request');

/**
 * @description Response options for static route
 */
const responseOptions = {
    immutable: true,
    maxAge: 50000000,
    setHeaders: (res, path, stat) => {
        res.set('Strict-Transport-Security', ' max-age=31536000 ; includeSubDomains');
        res.set('X-Frame-Options', 'deny');
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('X-Permitted-Cross-Domain-Policies', 'none');
        res.set('X-XSS-Protection', '1; mode=block');
        res.set('Cache-Control', 'max-age=31536000, private, no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
    }
};

/**
 * @description Bootstrap script to start app web server
 */
(() => {
    // TODO: Find proper solution 
    // Ignoring ssl certificate of host
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
    // Express APP
    const app = express();
    // Getting Port
    const port = process.env.APP_PORT || 3030;
    // Resource path
    const resourcePath = path.resolve(__dirname, '../dist/www')
    // Setting express static
    app.use(express.static(resourcePath, responseOptions));
    // Setting configure path
    app.use('/config', (req, resp) => {
        const config = {
            apiHost: process.env.API_HOST || 'localhost',
            changeId: process.env.CHANGE_VERSION || 'NA',
            env: process.env.ENVIRONMENT || 'local',
            version: `${process.env.VERSION || 'NA'}(build #${process.env.CHANGE_VERSION || 'NA'})`,
            sso: {
                url: `${process.env.SSO_URL || ''}`,
                clientId: `${process.env.SSO_CLIENT_ID || ''}`,
                realm: `${process.env.SSO_REALM || ''}`
            }
        };
        resp.status(200).json(config);
    });
    // Health check
    app.use('/healthcheck', (_, resp) => {
        // Request server api
        const host = process.env.API_HOST || process.env.LOCAL_API_HOST || 'localhost'
        request(`https://${host}/api/misc/version`, (err, res) => {
            if (err) {
                console.log(`Error: ${err}, host: ${host}`);
                resp.status(404).json({ error: `${err}`, host: host });
            } else {
                if (res.statusCode === 200) {
                    resp.status(200).json({ success: true });
                } else {
                    resp.status(404).json({ error: 'API not responding' });
                }
            }
        });
    });

    // All routes
    const route = express.Router();
    route.all('*', express.static(resourcePath, responseOptions));
    app.use('*', route);

    // Logging
    console.log(`Stating express web server on port with resource path => ${port}: ${resourcePath}`);
    // Listing to port
    app.listen(port, () => {
        console.log(`Application started on port => ${port}`);
    });
})();