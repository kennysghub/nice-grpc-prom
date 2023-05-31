import {createChannel, createClient, ClientError, Status, ClientMiddlewareCall, CallOptions, createClientFactory} from 'nice-grpc-web';
import {
  GreetServiceClient,
  GreetServiceDefinition,
  GreetResponse
} from './compiled_proto/app';
import { ChannelImplementation } from "@grpc/grpc-js/build/src/channel";
import { request } from 'http';
import {isAbortError} from 'abort-controller-x';
import {prometheusClientMiddleware, registry} from 'nice-grpc-prometheus';
import port from './server';
import { collectDefaultMetrics } from 'prom-client';
// import { ChannelCredentials } from 'nice-grpc';
const startUp = async() => {
  try{
    const channel = createChannel(`http://localhost:${port}`);
    const client: GreetServiceClient = createClient(
      GreetServiceDefinition,
      channel,
    )
    const response = await client.greetings({Hello:"hi from ken"});
    console.log("Resp's Response: ", response)
    collectDefaultMetrics()
    console.log(GreetResponse)
    return response;
    
  }catch(err){
    console.log('heie')
  }
}
startUp()


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
async function* middleware<Request, Response>(
  call: ClientMiddlewareCall<Request, Response>,
  options: CallOptions,
){
  if (!call.responseStream) {
    const response = yield* call.next(call.request, options);

    return response;
  } else {
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
async function* loggingMiddleware<Request, Response>(
  call: ClientMiddlewareCall<Request, Response>,
  options: CallOptions,
) {
  const {path} = call.method;

  console.log('Client call', path, 'start');

  try {
    const result = yield* call.next(call.request, options);

    console.log('Client call', path, 'end: OK');

    return result;
  } catch (error) {
    if (error instanceof ClientError) {
      console.log(
        'Client call',
        path,
        `end: ${Status[error.code]}: ${error.details}`,
      );
    } else if (isAbortError(error)) {
      console.log('Client call', path, 'cancel');
    } else {
      console.log('Client call', path, `error:`);
    }

    throw error;
  }
}