/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface GreetRequest {
  Hello: string;
}

export interface GreetResponse {
  Goodbye: string;
}

function createBaseGreetRequest(): GreetRequest {
  return { Hello: "" };
}

export const GreetRequest = {
  encode(message: GreetRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Hello !== "") {
      writer.uint32(10).string(message.Hello);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GreetRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGreetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Hello = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<GreetRequest>): GreetRequest {
    return GreetRequest.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<GreetRequest>): GreetRequest {
    const message = createBaseGreetRequest();
    message.Hello = object.Hello ?? "";
    return message;
  },
};

function createBaseGreetResponse(): GreetResponse {
  return { Goodbye: "" };
}

export const GreetResponse = {
  encode(message: GreetResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Goodbye !== "") {
      writer.uint32(10).string(message.Goodbye);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GreetResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGreetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Goodbye = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  create(base?: DeepPartial<GreetResponse>): GreetResponse {
    return GreetResponse.fromPartial(base ?? {});
  },

  fromPartial(object: DeepPartial<GreetResponse>): GreetResponse {
    const message = createBaseGreetResponse();
    message.Goodbye = object.Goodbye ?? "";
    return message;
  },
};

export type GreetServiceDefinition = typeof GreetServiceDefinition;
export const GreetServiceDefinition = {
  name: "GreetService",
  fullName: "GreetService",
  methods: {
    greetings: {
      name: "Greetings",
      requestType: GreetRequest,
      requestStream: false,
      responseType: GreetResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface GreetServiceImplementation<CallContextExt = {}> {
  greetings(request: GreetRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GreetResponse>>;
}

export interface GreetServiceClient<CallOptionsExt = {}> {
  greetings(request: DeepPartial<GreetRequest>, options?: CallOptions & CallOptionsExt): Promise<GreetResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
