"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementStreamMessagesCounter = exports.getLabels = exports.latencySecondsBuckets = exports.codeLabel = exports.pathLabel = exports.methodLabel = exports.serviceLabel = exports.typeLabel = void 0;
const prom_client_1 = require("prom-client");
exports.typeLabel = 'grpc_type';
exports.serviceLabel = 'grpc_service';
exports.methodLabel = 'grpc_method';
exports.pathLabel = 'grpc_path';
exports.codeLabel = 'grpc_code';
/**
 * 1ms, 4ms, 16ms, ..., ~1 hour in seconds
 */
exports.latencySecondsBuckets = (0, prom_client_1.exponentialBuckets)(0.001, 4, 12);
function getLabels(method) {
    const callType = method.requestStream
        ? method.responseStream
            ? 'bidi_stream'
            : 'client_stream'
        : method.responseStream
            ? 'server_stream'
            : 'unary';
    const { path } = method;
    const [serviceName, methodName] = path.split('/').slice(1);
    return {
        [exports.typeLabel]: callType,
        [exports.serviceLabel]: serviceName,
        [exports.methodLabel]: methodName,
        [exports.pathLabel]: path,
    };
}
exports.getLabels = getLabels;
async function* incrementStreamMessagesCounter(iterable, counter) {
    for await (const item of iterable) {
        counter.inc();
        yield item;
    }
}
exports.incrementStreamMessagesCounter = incrementStreamMessagesCounter;
