//
// BC Helpers wrapper
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
// Created by Pushan Mitra on 2019-06-10.
/**
 * Imports
 */
import * as assert from 'assert';
import AppConfig from '../../AppConfig';

/**
 * @description Require common utility module as any
 */
const commonUtility = require('@bcgov/nodejs-common-utils');

/**
 * @description Helper class to expose bcgov utilities
 * @export class BCHelperLib
 */
export class BCHelperLib {

    /**
     * @description Get certificate for JWT token validation
     * @returns Promise<{algorithm: any, certificate: any}>
     */
    static async getCertificate(): Promise<any> {
        const { getJwtCertificate} = commonUtility;
        assert(getJwtCertificate, 'No getJwtCertificate lib');
        const { algorithm, certificate } = await getJwtCertificate(AppConfig.certificateURL);
        return {algorithm, certificate};
    }

     /**
     * @description Get utility module object
     * @returns any
     */
    static getCommonUtility(): any {
        return commonUtility;
    }
}

// --------------------------------------------------------------------
