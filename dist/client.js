"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nice_grpc_web_1 = require("nice-grpc-web");
const app_1 = require("./compiled_proto/app");
const abort_controller_x_1 = require("abort-controller-x");
const server_1 = __importDefault(require("./server"));
const prom_client_1 = require("prom-client");
// import { ChannelCredentials } from 'nice-grpc';
const startUp = async () => {
    try {
        const channel = (0, nice_grpc_web_1.createChannel)(`http://localhost:${server_1.default}`);
        const client = (0, nice_grpc_web_1.createClient)(app_1.GreetServiceDefinition, channel);
        const response = await client.greetings({ Hello: "hi from ken" });
        console.log("Resp's Response: ", response);
        (0, prom_client_1.collectDefaultMetrics)();
        console.log(app_1.GreetResponse);
        return response;
    }
    catch (err) {
        console.log('heie');
    }
};
startUp();
// const invokeResponse = async() => {
//   try {
//     const resp = await client.greetings({Hello:"hi from ken"});
//     console.log("Resp's Response: ", resp)
//   } catch (e) {
//      console.log("EEEE",e)
//   }
// }
// invokeResponse()
// Call the method 
// Middlewware
async function* middleware(call, options) {
    if (!call.responseStream) {
        const response = yield* call.next(call.request, options);
        return response;
    }
    else {
        for await (const response of call.next(call.request, options)) {
            yield response;
        }
        return;
    }
}
// // To create a client with middleware 
// const clientKen = createClientFactory()
//   .use(prometheusClientMiddleware())
//   .use(middleware)
//   .use(loggingMiddleware)
//   .create(GreetServiceDefinition,channel)
//   const me = async() => {
//   try {
//     const ken = await clientKen.greetings({Hello:"hi from ken"});
//     console.log("Ken's Response: ", ken)
//   } catch (e) {
//      console.log(e)
//   }
//   // `text` is not available here
// }
// me()
// `text` is not available here, either, and code here is reached before the promise settles
// and before the code after `await` in the main function above runs
// Logging Middleware 
async function* loggingMiddleware(call, options) {
    const { path } = call.method;
    console.log('Client call', path, 'start');
    try {
        const result = yield* call.next(call.request, options);
        console.log('Client call', path, 'end: OK');
        return result;
    }
    catch (error) {
        if (error instanceof nice_grpc_web_1.ClientError) {
            console.log('Client call', path, `end: ${nice_grpc_web_1.Status[error.code]}: ${error.details}`);
        }
        else if ((0, abort_controller_x_1.isAbortError)(error)) {
            console.log('Client call', path, 'cancel');
        }
        else {
            console.log('Client call', path, `error:`);
        }
        throw error;
    }
}
