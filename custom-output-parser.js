import { BaseOutputParser } from "@langchain/core/output_parsers";

class CustomOutputParser extends BaseOutputParser {
    constructor() {
        super();
        this.lc_namespace = "custom";
    }

    async parseResult(result) {
        if (result && result[0]) {
            const message = result[0].text;
            if (message && typeof message === 'string') {
                return {
                    return_values: { output: message },
                    log: message
                };
            }
            throw new Error('Unexpected result format');
        }
        throw new Error('Unexpected result format');
    }

    // PARSING SINGLE MESSAGE EXAMPLE
    // async parse(result) {
    //
    //     if (result) {
    //         const message = result;
    //         if (message && typeof message === 'string') {
    //             return {
    //                 return_values: { output: message },
    //                 log: message
    //             };
    //         }
    //         throw new Error('Unexpected result format');
    //     }
    //     throw new Error('Unexpected result format');
    // }

    toJSON() {
        return {
            _type: "CustomOutputParser",
            lc_namespace: this.lc_namespace,
        };
    }
}


export default CustomOutputParser;