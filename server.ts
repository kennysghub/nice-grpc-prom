import {register as globalRegistry, Registry} from 'prom-client';
import {registry as niceGrpcRegistry} from 'nice-grpc-prometheus';
// import {prometheusServerMiddleware} from 'nice-grpc-prometheus';
import { createServer} from 'nice-grpc';
import { ServerCredentials } from 'grpc';
// // use `await mergedRegistry.metrics()` to export all metrics
const mergedRegistry = Registry.merge([globalRegistry, niceGrpcRegistry]);
// const k = await mergedRegistry.metrics();
// console.log(k)
import {
  GreetServiceClient,
  GreetServiceDefinition,
  GreetResponse,
  GreetRequest,
  GreetServiceImplementation,
  DeepPartial
} from './compiled_proto/app';


// import {Registry} from 'prom-client'
import {isAbortError} from 'abort-controller-x';
import {
  CallContext,
  ServerError,
  ServerMiddleware,
  ServerMiddlewareCall,
  Status,
} from 'nice-grpc-common';
import {Counter, Histogram} from 'prom-client';
import {
  codeLabel,
  getLabels,
  incrementStreamMessagesCounter,
  latencySecondsBuckets,
  methodLabel,
  pathLabel,
  serviceLabel,
  typeLabel,
} from './common'
import { prometheusServerMiddleware } from 'nice-grpc-prometheus';
import { createChannel } from 'nice-grpc-web';
// import {registry} from './registry';
const registry = new Registry();
const GreetServiceImpl: GreetServiceImplementation = {
  async greetings(request: GreetRequest,context:CallContext) :Promise<DeepPartial<GreetResponse>>{
    try{
      const response: GreetResponse = {
        Goodbye: "BYE"
      }
      const meow = await mergedRegistry.metrics()
      console.log("MEOW___", meow)
      return response;
    }
    catch(error){
      console.log("ERROR: ",error)
      throw new ServerError(Status.ABORTED, 'An error occurred');

    }
  }
}

const server = createServer()


const getPort = async() => {
  server.use(prometheusServerMiddleware())
  await server.listen('localhost:0');
  const me = await mergedRegistry.metrics()
  console.log("MEEEE______", me )
}
const port = getPort();
export default port;

  

  async function startServer() {
    const address = 'localhost:8080';
    const credentials = ServerCredentials.createInsecure();
    
    const port =  server.listen(address);
    console.log(`Server listening on ${address}`);
    console.log(`Listening on port ${port}`);
  }


// Apply the Prometheus middleware and start the server
const k = async () => {
 try{
  server.use(prometheusServerMiddleware())
  server.add(GreetServiceDefinition,GreetServiceImpl)
  startServer()
  const me = await mergedRegistry.metrics()
  console.log("MEEEE______", me )
 }
 catch(err){
  console.log('err',err)
 }
}
// k()
  




const serverStartedMetric = new Counter({
  registers: [registry],
  name: 'grpc_server_started_total',
  help: 'Total number of RPCs started on the server.',
  labelNames: [typeLabel, serviceLabel, methodLabel, pathLabel],
});

const serverHandledMetric = new Counter({
  registers: [registry],
  name: 'grpc_server_handled_total',
  help: 'Total number of RPCs completed on the server, regardless of success or failure.',
  labelNames: [typeLabel, serviceLabel, methodLabel, pathLabel, codeLabel],
});

const serverStreamMsgReceivedMetric = new Counter({
  registers: [registry],
  name: 'grpc_server_msg_received_total',
  help: 'Total number of RPC stream messages received by the server.',
  labelNames: [typeLabel, serviceLabel, methodLabel, pathLabel],
});

const serverStreamMsgSentMetric = new Counter({
  registers: [registry],
  name: 'grpc_server_msg_sent_total',
  help: 'Total number of gRPC stream messages sent by the server.',
  labelNames: [typeLabel, serviceLabel, methodLabel, pathLabel],
});

const serverHandlingSecondsMetric = new Histogram({
  registers: [registry],
  name: 'grpc_server_handling_seconds',
  help: 'Histogram of response latency (seconds) of gRPC that had been application-level handled by the server.',
  labelNames: [typeLabel, serviceLabel, methodLabel, pathLabel, codeLabel],
  buckets: latencySecondsBuckets,
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
