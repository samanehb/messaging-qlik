import ObjectModel from './objectModel';

export default class ErrorModel extends ObjectModel {

    /**
     * Create an error model
     * params:
     * code: error code for looking up the problem in docs or to contact support
     * message: summary of problem, and what to do to fix
     * description: more details
     */
    constructor(code, message, description) {
        super();
        this.code = code;
        this.message = message;
        this.description = description;
    }

    /**
     * See super.getApiModel for documentation
     */
    getApiModel(version) {
        // using JSON naming convention for field names (camel case)
        if(version && version.toLowerCase() === 'v1') {
            return {
                code: this.code, 
                message: this.message,
                description: this.description
            }
        } else { // else handle future versions here
            // for error code, better always return message, this will never go away, and in case version is missing we need some error
            return {
                message: this.message
            }; // return default, this is an invalid state, just avoiding undefined
        }
    }

}