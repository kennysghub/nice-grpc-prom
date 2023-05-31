import { createChannel, createClient, ClientError, Status, createClientFactory } from 'nice-grpc-web';
import { GreetServiceDefinition } from './compiled_proto/app';
import { isAbortError } from 'abort-controller-x';
import { ChannelCredentials } from 'nice-grpc';
const channel = createChannel('http://localhost:8080', ChannelCredentials.createInsecure());
const client = createClient(GreetServiceDefinition, channel);
// createChannel('localhost:3500', ChannelCredentials.createInsecure())
// Call the method 
const response = await client.greetings({ Hello: "This is me!" });
console.log("First Response: ", response);
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
// To create a client with middleware 
const clientKen = createClientFactory()
    .use(middleware)
    .use(loggingMiddleware)
    .create(GreetServiceDefinition, channel);
const ken = await clientKen.greetings({ Hello: "hi from ken" });
console.log("Ken's Response: ", ken);
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
        if (error instanceof ClientError) {
            console.log('Client call', path, `end: ${Status[ error.code ]}: ${error.details}`);
        }
        else if (isAbortError(error)) {
            console.log('Client call', path, 'cancel');
        }
        else {
            console.log('Client call', path, `error: ${error?.stack}`);
        }
        throw error;
    }
}
