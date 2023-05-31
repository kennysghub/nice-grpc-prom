"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prom_client_1 = require("prom-client");
const nice_grpc_prometheus_1 = require("nice-grpc-prometheus");
// import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
const nice_grpc_1 = require("nice-grpc");
const grpc_1 = require("grpc");
// // use `await mergedRegistry.metrics()` to export all metrics
const mergedRegistry = prom_client_1.Registry.merge([prom_client_1.register, nice_grpc_prometheus_1.registry]);
// const k = await mergedRegistry.metrics();
// console.log(k)
const app_1 = require("./compiled_proto/app");
const nice_grpc_common_1 = require("nice-grpc-common");
const prom_client_2 = require("prom-client");
const common_1 = require("./common");
const nice_grpc_prometheus_2 = require("nice-grpc-prometheus");
// import {registry} from './registry';
const registry = new prom_client_1.Registry();
const GreetServiceImpl = {
    async greetings(request, context) {
        try {
            const response = {
                Goodbye: "BYE"
            };
            const meow = await mergedRegistry.metrics();
            console.log("MEOW___", meow);
            return response;
        }
        catch (error) {
            console.log("ERROR: ", error);
            throw new nice_grpc_common_1.ServerError(nice_grpc_common_1.Status.ABORTED, 'An error occurred');
        }
    }
};
const server = (0, nice_grpc_1.createServer)();
const getPort = async () => {
    server.use((0, nice_grpc_prometheus_2.prometheusServerMiddleware)());
    await server.listen('localhost:0');
    const me = await mergedRegistry.metrics();
    console.log("MEEEE______", me);
};
const port = getPort();
exports.default = port;
async function startServer() {
    const address = 'localhost:8080';
    const credentials = grpc_1.ServerCredentials.createInsecure();
    const port = server.listen(address);
    console.log(`Server listening on ${address}`);
    console.log(`Listening on port ${port}`);
}
// Apply the Prometheus middleware and start the server
const k = async () => {
    try {
        server.use((0, nice_grpc_prometheus_2.prometheusServerMiddleware)());
        server.add(app_1.GreetServiceDefinition, GreetServiceImpl);
        startServer();
        const me = await mergedRegistry.metrics();
        console.log("MEEEE______", me);
    }
    catch (err) {
        console.log('err', err);
    }
};
// k()
const serverStartedMetric = new prom_client_2.Counter({
    registers: [registry],
    name: 'grpc_server_started_total',
    help: 'Total number of RPCs started on the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel],
});
const serverHandledMetric = new prom_client_2.Counter({
    registers: [registry],
    name: 'grpc_server_handled_total',
    help: 'Total number of RPCs completed on the server, regardless of success or failure.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel, common_1.codeLabel],
});
const serverStreamMsgReceivedMetric = new prom_client_2.Counter({
    registers: [registry],
    name: 'grpc_server_msg_received_total',
    help: 'Total number of RPC stream messages received by the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel],
});
const serverStreamMsgSentMetric = new prom_client_2.Counter({
    registers: [registry],
    name: 'grpc_server_msg_sent_total',
    help: 'Total number of gRPC stream messages sent by the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel],
});
const serverHandlingSecondsMetric = new prom_client_2.Histogram({
    registers: [registry],
    name: 'grpc_server_handling_seconds',
    help: 'Histogram of response latency (seconds) of gRPC that had been application-level handled by the server.',
    labelNames: [common_1.typeLabel, common_1.serviceLabel, common_1.methodLabel, common_1.pathLabel, common_1.codeLabel],
    buckets: common_1.latencySecondsBuckets,
});
// export function prometheusServerMiddleware(): ServerMiddleware {
//   return async function* prometheusServerMiddlewareGenerator<Request, Response>(
//     call: ServerMiddlewareCall<Request, Response>,
//     context: CallContext,
//   ): AsyncGenerator<Response, Response | void, undefined> {
//     const labels = getLabels(call.method);
//     serverStartedMetric.inc(labels);
//     const stopTimer = serverHandlingSecondsMetric.startTimer(labels);
//     let settled = false;
//     let status: Status = Status.OK;
//     try {
//       let request;
//       if (!call.requestStream) {
//         request = call.request;
//       } else {
//         request = incrementStreamMessagesCounter(
//           call.request,
//           serverStreamMsgReceivedMetric.labels(labels),
//         );
//       }
//       if (!call.responseStream) {
//         const response = yield* call.next(request, context);
//         settled = true;
//         return response;
//       } else {
//         yield* incrementStreamMessagesCounter(
//           call.next(request, context),
//           serverStreamMsgSentMetric.labels(labels),
//         );
//         settled = true;
//         return;
//       }
//     } catch (err: unknown) {
//       settled = true;
//       if (err instanceof ServerError) {
//         status = err.code;
//       } else if (isAbortError(err)) {
//         status = Status.CANCELLED;
//       } else {
//         status = Status.UNKNOWN;
//       }
//       throw err;
//     } finally {
//       if (!settled) {
//         status = Status.CANCELLED;
//       }
//       stopTimer({[codeLabel]: Status[status]});
//       serverHandledMetric.inc({
//         ...labels,
//         [codeLabel]: Status[status],
//       });
//     }
//   };
// }
